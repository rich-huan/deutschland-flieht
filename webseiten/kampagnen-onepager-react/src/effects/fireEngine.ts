/**
 * Feuer am Horizont.
 *
 * Anders als der seitenweite Funkenflug ist diese Simulation auf einen Bereich
 * begrenzt (Hero, Manifest). Sie besteht aus zwei Sorten Partikel: große, sehr
 * schwache Hitzeballen, die die Glut­wolke bilden, und kleinere, hellere
 * Flammenzungen, die schnell aufsteigen und verlöschen.
 *
 * Das Feuer brennt nicht gleichmäßig über die Breite, sondern an einigen
 * Herden — sonst wirkt es wie ein Farbverlauf und nicht wie Feuer.
 */

interface Flame {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  /** Anfangs- und Endradius; Rauch dehnt sich beim Aufsteigen aus. */
  radius: number;
  growth: number;
  alpha: number;
  drift: number;
  seed: number;
  heatScale: number;
}

const FIRE_RAMP: ReadonlyArray<readonly [number, number, number]> = [
  [128, 28, 4],
  [196, 56, 8],
  [238, 92, 14],
  [255, 138, 34],
  [255, 190, 96],
  [255, 236, 194],
];

const MAX_FLAMES = 110;
const SPRITE_SIZE = 96;

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createSprite([r, g, b]: readonly [number, number, number]): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;

  const context = sprite.getContext("2d");
  if (!context) return sprite;

  const half = SPRITE_SIZE / 2;
  const gradient = context.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
  gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.34)`);
  gradient.addColorStop(0.72, `rgba(${r}, ${g}, ${b}, 0.07)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  context.fillStyle = gradient;
  context.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

export interface FireFieldOptions {
  canvas: HTMLCanvasElement;
  /** Bezugsbox für die Größe — üblicherweise das umschließende Element. */
  host: HTMLElement;
  /** Gesamtstärke des Feuers, 0–1. */
  intensity?: number;
}

export class FireField {
  private readonly canvas: HTMLCanvasElement;
  private readonly host: HTMLElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly sprites: HTMLCanvasElement[];
  private readonly intensity: number;
  /** Feuerherde als Anteil der Breite mit eigener Stärke. */
  private readonly sources: ReadonlyArray<{ at: number; power: number }>;

  private flames: Flame[] = [];
  private width = 0;
  private height = 0;
  private raf = 0;
  private lastFrame = 0;
  private time = 0;
  private heatDebt = 0;
  private flameDebt = 0;
  private observer: ResizeObserver | null = null;
  private inViewObserver: IntersectionObserver | null = null;
  private visible = true;

  constructor({ canvas, host, intensity = 1 }: FireFieldOptions) {
    this.canvas = canvas;
    this.host = host;
    this.context = canvas.getContext("2d", { alpha: true });
    this.intensity = intensity;
    this.sprites = FIRE_RAMP.map(createSprite);
    this.sources = [
      { at: 0.14, power: 0.7 },
      { at: 0.35, power: 1 },
      { at: 0.58, power: 0.55 },
      { at: 0.79, power: 0.9 },
      { at: 0.94, power: 0.4 },
    ];
  }

  start(): void {
    this.resize();

    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.host);
    }

    document.addEventListener("visibilitychange", this.handleVisibility);

    // Außerhalb des Sichtfelds wird nicht gerechnet.
    if (typeof IntersectionObserver !== "undefined") {
      const inView = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry?.isIntersecting ?? true;
          if (this.visible) this.resume();
          else this.pause();
        },
        { threshold: 0 },
      );
      inView.observe(this.host);
      this.inViewObserver = inView;
    }

    this.resume();
  }

  destroy(): void {
    this.pause();
    this.observer?.disconnect();
    this.inViewObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.flames = [];
  }

  private handleVisibility = (): void => {
    if (document.visibilityState === "visible" && this.visible) this.resume();
    else this.pause();
  };

  private resume(): void {
    if (this.raf || !this.context) return;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private pause(): void {
    if (!this.raf) return;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private resize(): void {
    const rect = this.host.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  /** Wählt einen Feuerherd und streut die Startposition darum. */
  private pickSource(): number {
    const total = this.sources.reduce((sum, source) => sum + source.power, 0);
    let ticket = Math.random() * total;
    for (const source of this.sources) {
      ticket -= source.power;
      if (ticket <= 0) return source.at * this.width + random(-0.09, 0.09) * this.width;
    }
    return this.width / 2;
  }

  private push(flame: Flame): void {
    if (this.flames.length >= MAX_FLAMES) return;
    this.flames.push(flame);
  }

  private frame = (now: number): void => {
    const delta = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    this.time += delta;

    this.emit(delta);
    this.simulate(delta);
    this.render();

    this.raf = requestAnimationFrame(this.frame);
  };

  private emit(delta: number): void {
    // Große, träge Hitzeballen bilden die Glutwolke.
    this.heatDebt += 7 * this.intensity * delta;
    while (this.heatDebt >= 1) {
      this.heatDebt -= 1;
      const life = random(2.6, 5.2);
      this.push({
        x: this.pickSource(),
        y: this.height + random(0, 26),
        vx: random(-10, 10),
        vy: random(-34, -14),
        life,
        maxLife: life,
        radius: random(34, 62),
        growth: random(26, 62),
        alpha: random(0.05, 0.11) * this.intensity,
        drift: random(4, 12),
        seed: random(0, 100),
        heatScale: random(0.3, 0.62),
      });
    }

    // Kleinere, hellere Flammenzungen darüber.
    this.flameDebt += 11 * this.intensity * delta;
    while (this.flameDebt >= 1) {
      this.flameDebt -= 1;
      const life = random(0.7, 1.7);
      this.push({
        x: this.pickSource(),
        y: this.height + random(0, 14),
        vx: random(-16, 16),
        vy: random(-92, -46),
        life,
        maxLife: life,
        radius: random(9, 20),
        growth: random(10, 26),
        alpha: random(0.14, 0.3) * this.intensity,
        drift: random(10, 26),
        seed: random(0, 100),
        heatScale: random(0.75, 1),
      });
    }
  }

  private simulate(delta: number): void {
    const alive: Flame[] = [];

    for (const flame of this.flames) {
      flame.life -= delta;
      if (flame.life <= 0) continue;

      flame.vy -= 14 * delta;
      flame.vx += Math.sin(this.time * 1.4 + flame.seed) * flame.drift * delta;
      flame.vx *= 1 - Math.min(delta * 0.9, 1);
      flame.vy *= 1 - Math.min(delta * 0.5, 1);
      flame.x += flame.vx * delta;
      flame.y += flame.vy * delta;

      if (flame.y < -220) continue;
      alive.push(flame);
    }

    this.flames = alive;
  }

  private render(): void {
    const context = this.context;
    if (!context) return;

    context.clearRect(0, 0, this.width, this.height);
    context.globalCompositeOperation = "lighter";

    for (const flame of this.flames) {
      const remaining = flame.life / flame.maxLife;
      const age = 1 - remaining;

      const heat = Math.max(0, Math.min(1, remaining * flame.heatScale));
      const sprite = this.sprites[Math.min(this.sprites.length - 1, Math.floor(heat * this.sprites.length))];
      if (!sprite) continue;

      const fadeIn = Math.min(1, age * 6);
      const fadeOut = Math.min(1, remaining * 1.8);
      const flicker = 0.82 + 0.18 * Math.sin(this.time * 9 + flame.seed * 5);
      const alpha = flame.alpha * fadeIn * fadeOut * flicker;
      if (alpha <= 0.004) continue;

      const radius = flame.radius + flame.growth * age;
      context.globalAlpha = alpha;
      context.drawImage(sprite, flame.x - radius, flame.y - radius, radius * 2, radius * 2);
    }

    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
  }
}
