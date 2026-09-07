/**
 * Funkenflug.
 *
 * Ein einzelnes Canvas über der gesamten Seite, auf dem kleine Glut-Partikel
 * simuliert werden: Sie steigen auf, flackern, kühlen von weißgelb über orange
 * nach dunkelrot ab und verlöschen. Am Mauszeiger entstehen zusätzlich Funken.
 *
 * Bewusst framework-frei und ohne React-State: Die Simulation läuft in einer
 * einzigen requestAnimationFrame-Schleife und löst keine Re-Renders aus.
 */

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Verbleibende Lebenszeit in Sekunden. */
  life: number;
  maxLife: number;
  /** Kerngröße in CSS-Pixeln. */
  size: number;
  alpha: number;
  /** Auftrieb in px/s² — heiße Luft trägt die Glut nach oben. */
  lift: number;
  /** Stärke der seitlichen Turbulenz. */
  drift: number;
  /** Obergrenze der Farbtemperatur: nur frische Funken glühen weißgelb. */
  heatScale: number;
  seed: number;
  /** Funken am Zeiger ziehen einen kurzen Schweif, Umgebungsglut nicht. */
  streak: boolean;
}

/** Temperaturverlauf einer abkühlenden Glut, von dunkelrot bis weißgelb. */
const EMBER_RAMP: ReadonlyArray<readonly [number, number, number]> = [
  [128, 26, 4],
  [206, 58, 8],
  [244, 108, 18],
  [255, 150, 46],
  [255, 198, 92],
  [255, 238, 190],
];

const MAX_SPARKS = 260;
const SPRITE_SIZE = 64;

/** Grundrauschen am Zeiger, damit auch bei ruhiger Maus etwas glimmt. */
const CURSOR_IDLE_RATE = 7;
const CURSOR_MAX_RATE = 46;

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
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  gradient.addColorStop(0.16, `rgba(${r}, ${g}, ${b}, 0.62)`);
  gradient.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, 0.16)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  context.fillStyle = gradient;
  context.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

export interface SparkFieldOptions {
  canvas: HTMLCanvasElement;
  /** Weiches Licht, das dem Zeiger nachläuft. */
  glow?: HTMLElement | null;
  /** Umgebungsglut pro Sekunde — auf Touch-Geräten bewusst niedriger. */
  ambientRate?: number;
  /** Ohne feinen Zeiger entfallen Funken und Licht an der Maus. */
  cursorEnabled?: boolean;
}

export class SparkField {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly glow: HTMLElement | null;
  private readonly sprites: HTMLCanvasElement[];
  private readonly ambientRate: number;
  private readonly cursorEnabled: boolean;

  private sparks: Spark[] = [];
  private width = 0;
  private height = 0;

  private raf = 0;
  private lastFrame = 0;
  private time = 0;
  private ambientDebt = 0;
  private cursorDebt = 0;

  private pointerActive = false;
  private pointerX = 0;
  private pointerY = 0;
  private previousPointerX = 0;
  private previousPointerY = 0;
  private pointerSpeed = 0;
  private glowX = 0;
  private glowY = 0;
  private glowReady = false;

  constructor({ canvas, glow, ambientRate = 5, cursorEnabled = true }: SparkFieldOptions) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: true });
    this.glow = glow ?? null;
    this.ambientRate = ambientRate;
    this.cursorEnabled = cursorEnabled;
    this.sprites = EMBER_RAMP.map(createSprite);
  }

  start(): void {
    this.resize();
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("visibilitychange", this.handleVisibility);

    if (this.cursorEnabled) {
      window.addEventListener("pointermove", this.handlePointerMove, { passive: true });
      window.addEventListener("pointerdown", this.handlePointerDown, { passive: true });
      document.addEventListener("pointerleave", this.handlePointerLeave);
    }

    this.resume();
  }

  destroy(): void {
    this.pause();
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerdown", this.handlePointerDown);
    document.removeEventListener("pointerleave", this.handlePointerLeave);
    this.sparks = [];
  }

  // --- Ereignisse -------------------------------------------------------

  private handleResize = (): void => {
    this.resize();
  };

  private handleVisibility = (): void => {
    // Im Hintergrund-Tab wird nicht gerechnet.
    if (document.visibilityState === "visible") this.resume();
    else this.pause();
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;
    if (!this.pointerActive) {
      this.previousPointerX = event.clientX;
      this.previousPointerY = event.clientY;
      this.glowX = event.clientX;
      this.glowY = event.clientY;
    }
    this.pointerActive = true;
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
  };

  private handlePointerDown = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;
    this.burst(event.clientX, event.clientY, 22);
  };

  private handlePointerLeave = (): void => {
    this.pointerActive = false;
    this.setGlowVisible(false);
  };

  // --- Schleife ---------------------------------------------------------

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

  private frame = (now: number): void => {
    // Nach einem Tab-Wechsel darf kein riesiger Zeitsprung entstehen.
    const delta = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    this.time += delta;

    this.trackPointer(delta);
    this.emitAmbient(delta);
    this.emitAtCursor(delta);
    this.simulate(delta);
    this.render();

    this.raf = requestAnimationFrame(this.frame);
  };

  private resize(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // --- Partikel ---------------------------------------------------------

  private push(spark: Spark): void {
    if (this.sparks.length >= MAX_SPARKS) return;
    this.sparks.push(spark);
  }

  /** Glut, die von unten durch das Bild steigt. */
  private emitAmbient(delta: number): void {
    this.ambientDebt += this.ambientRate * delta;
    while (this.ambientDebt >= 1) {
      this.ambientDebt -= 1;
      const life = random(7, 14);
      this.push({
        x: random(-40, this.width + 40),
        // Nicht nur vom unteren Rand: so glimmt es über die ganze Höhe,
        // ohne dass die Partikelzahl steigen muss.
        y: this.height * random(0.2, 1.12),
        vx: random(-14, 14),
        vy: random(-52, -18),
        life,
        maxLife: life,
        size: random(0.9, 2.3),
        alpha: random(0.3, 0.65),
        lift: random(6, 16),
        drift: random(5, 16),
        // Ferne Glut bleibt orange bis rot — kein weißes Glühen.
        heatScale: random(0.32, 0.72),
        seed: random(0, 100),
        streak: false,
      });
    }
  }

  /** Funken am Mauszeiger — mehr, je schneller die Bewegung. */
  private emitAtCursor(delta: number): void {
    if (!this.cursorEnabled || !this.pointerActive) return;

    const rate = Math.min(CURSOR_IDLE_RATE + this.pointerSpeed * 0.045, CURSOR_MAX_RATE);
    this.cursorDebt += rate * delta;

    while (this.cursorDebt >= 1) {
      this.cursorDebt -= 1;
      const angle = random(0, Math.PI * 2);
      const speed = random(12, 40) + this.pointerSpeed * random(0.04, 0.16);
      const life = random(0.5, 1.5);
      this.push({
        x: this.pointerX + random(-6, 6),
        y: this.pointerY + random(-6, 6),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - random(10, 45),
        life,
        maxLife: life,
        size: random(0.8, 2.1),
        alpha: random(0.45, 0.9),
        lift: random(10, 26),
        drift: random(8, 22),
        heatScale: random(0.8, 1),
        seed: random(0, 100),
        streak: true,
      });
    }
  }

  /** Kurzer Funkenschlag, z. B. bei einem Klick. */
  burst(x: number, y: number, count: number): void {
    for (let index = 0; index < count; index += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(60, 260);
      const life = random(0.45, 1.2);
      this.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life,
        maxLife: life,
        size: random(1, 2.4),
        alpha: random(0.6, 1),
        lift: random(14, 34),
        drift: random(10, 26),
        heatScale: 1,
        seed: random(0, 100),
        streak: true,
      });
    }
  }

  private trackPointer(delta: number): void {
    if (!this.cursorEnabled) return;

    const dx = this.pointerX - this.previousPointerX;
    const dy = this.pointerY - this.previousPointerY;
    this.previousPointerX = this.pointerX;
    this.previousPointerY = this.pointerY;

    const instant = Math.hypot(dx, dy) / Math.max(delta, 0.001);
    // Geglättete Geschwindigkeit — sonst zuckt die Funkenmenge.
    this.pointerSpeed += (instant - this.pointerSpeed) * Math.min(delta * 8, 1);

    if (!this.glow) return;

    if (this.pointerActive) {
      const ease = Math.min(delta * 7, 1);
      this.glowX += (this.pointerX - this.glowX) * ease;
      this.glowY += (this.pointerY - this.glowY) * ease;
      this.glow.style.transform = `translate3d(${this.glowX}px, ${this.glowY}px, 0) translate(-50%, -50%)`;
      this.setGlowVisible(true);
    }
  }

  private setGlowVisible(visible: boolean): void {
    if (!this.glow || this.glowReady === visible) return;
    this.glowReady = visible;
    this.glow.style.opacity = visible ? "1" : "0";
  }

  private simulate(delta: number): void {
    const alive: Spark[] = [];

    for (const spark of this.sparks) {
      spark.life -= delta;
      if (spark.life <= 0) continue;

      // Auftrieb, Turbulenz und Luftwiderstand.
      spark.vy -= spark.lift * delta;
      spark.vx += Math.sin(this.time * 1.9 + spark.seed) * spark.drift * delta;
      spark.vx *= 1 - Math.min(delta * 1.1, 1);
      spark.vy *= 1 - Math.min(delta * 0.75, 1);
      spark.x += spark.vx * delta;
      spark.y += spark.vy * delta;

      if (spark.y < -80 || spark.x < -120 || spark.x > this.width + 120) continue;
      alive.push(spark);
    }

    this.sparks = alive;
  }

  private render(): void {
    const context = this.context;
    if (!context) return;

    context.clearRect(0, 0, this.width, this.height);
    context.globalCompositeOperation = "lighter";

    for (const spark of this.sparks) {
      const remaining = spark.life / spark.maxLife;
      // Heiß beim Entstehen, dunkelrot kurz vor dem Verlöschen.
      const heat = Math.max(0, Math.min(1, remaining * spark.heatScale));
      const sprite = this.sprites[Math.min(this.sprites.length - 1, Math.floor(heat * this.sprites.length))];
      if (!sprite) continue;

      // Weiches Auf- und Abblenden plus unruhiges Flackern.
      const fadeIn = Math.min(1, (1 - remaining) * 8);
      const fadeOut = Math.min(1, remaining * 2.4);
      const flicker = 0.78 + 0.22 * Math.sin(this.time * 21 + spark.seed * 7);
      const alpha = spark.alpha * fadeIn * fadeOut * flicker;
      if (alpha <= 0.01) continue;

      const radius = spark.size * 4.2;
      context.globalAlpha = alpha * 0.9;
      context.drawImage(sprite, spark.x - radius, spark.y - radius, radius * 2, radius * 2);

      // Schneller Funke: kurzer Schweif in Flugrichtung.
      const speed = Math.hypot(spark.vx, spark.vy);
      if (spark.streak && speed > 90) {
        context.globalAlpha = alpha * 0.55;
        context.strokeStyle = "rgba(255, 214, 150, 1)";
        context.lineWidth = spark.size * 0.7;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(spark.x, spark.y);
        context.lineTo(spark.x - spark.vx * 0.022, spark.y - spark.vy * 0.022);
        context.stroke();
      }

      // Heller Kern nur solange die Glut wirklich heiß ist.
      if (heat > 0.55) {
        const core = spark.size * 0.8;
        context.globalAlpha = alpha;
        context.fillStyle = "rgba(255, 240, 214, 1)";
        context.fillRect(spark.x - core / 2, spark.y - core / 2, core, core);
      }
    }

    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
  }
}
