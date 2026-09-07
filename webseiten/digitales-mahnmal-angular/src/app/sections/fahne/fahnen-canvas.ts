import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  Color,
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';

import { FRAGMENT_SHADER, VERTEX_SHADER } from './fahne-shader';

/**
 * WebGL-Leinwand mit der wehenden Deutschlandfahne.
 *
 * Der Zustand wird ausschliesslich ueber `fortschritt` (0 bis 1) gesteuert:
 * daraus ergeben sich Verschmutzung, Loecher und die Flugbahn durch das Bild.
 *
 * Ruecksichten, die hier eingebaut sind:
 *   - Die Renderschleife laeuft nur, solange die Sektion sichtbar ist.
 *   - Bei prefers-reduced-motion steht die Zeit still; die Fahne bleibt in
 *     einer ruhigen Pose und reagiert nur noch auf den Scroll-Fortschritt.
 *   - Alle GPU-Ressourcen werden beim Zerstoeren wieder freigegeben.
 */
@Component({
  selector: 'app-fahnen-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #leinwand class="leinwand" [attr.aria-label]="beschreibung()" role="img"></canvas>`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .leinwand {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class FahnenCanvas {
  /** Scroll-Fortschritt der Sektion, 0 bis 1. */
  readonly fortschritt = input.required<number>();
  /** Beschreibung fuer Screenreader. */
  readonly beschreibung = input('Wehende Deutschlandfahne');

  private readonly leinwand = viewChild.required<ElementRef<HTMLCanvasElement>>('leinwand');
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private renderer?: WebGLRenderer;
  private szene?: Scene;
  private kamera?: PerspectiveCamera;
  private mesh?: Mesh<PlaneGeometry, ShaderMaterial>;
  private laeuft = false;
  private frame = 0;
  private startzeit = 0;
  private ruhig = false;

  constructor() {
    afterNextRender(() => this.aufbauen());

    /* Der Scroll-Fortschritt wirkt direkt auf Uniforms und Flugbahn.
       Bei reduzierter Bewegung ist das der einzige Ausloeser fuers Rendern. */
    effect(() => {
      const p = this.fortschritt();
      this.zustandSetzen(p);
      if (this.ruhig) {
        this.einmalRendern();
      }
    });
  }

  private aufbauen(): void {
    const canvas = this.leinwand().nativeElement;

    this.ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      /* Ohne WebGL bleibt die Sektion einfach ohne Fahne — Text und
         Typografie tragen die Aussage weiterhin. */
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    this.renderer = renderer;

    this.szene = new Scene();

    this.kamera = new PerspectiveCamera(42, 1, 0.1, 100);
    this.kamera.position.set(0, 0, 6.8);

    /* Das Band ist deutlich laenger als der sichtbare Bildausschnitt
       (rund 5 Einheiten breit), damit es an beiden Raendern herauslaeuft
       statt im Bild zu enden. Die tatsaechliche Form entsteht im
       Vertexshader; die Geometrie liefert nur das uv-Raster.
       Laengs hoch aufgeloest, quer genuegen wenige Segmente. */
    /* Die Laenge ist bewusst weit ueberdimensioniert. Das Band liegt
       schraeg im Bild; bei rund 23 Grad Neigung wandern die Enden eines
       kurzen Bandes vertikal in den sichtbaren Bereich und werden sichtbar.
       Bei dieser Laenge verlassen sie den Ausschnitt in jeder Lage. */
    const laenge = 26.0;
    const breite = 2.05;

    const geometrie = new PlaneGeometry(1, 1, 420, 28);

    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: DoubleSide,
      /* Das Band ist leicht durchscheinend. depthWrite bleibt an, sonst
         sortieren sich die Lagen bei Selbstueberschneidung falsch. */
      transparent: true,
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        uDirty: { value: 0 },
        uLength: { value: laenge },
        uWidth: { value: breite },
        /* Gedaempftes Schwarz-Rot-Gold: eine voll gesaettigte Fahne wuerde
           gegen die Putty-Ink-Palette der Seite anschreien. Der Ton ist der
           einer echten, gealterten Fahne.
           Fuer die amtlichen Farben hier ersetzen durch:
           0x000000 / 0xdd0000 / 0xffce00 */
        uSchwarz: { value: new Color(0x14120f) },
        uRot: { value: new Color(0x8c2f24) },
        uGold: { value: new Color(0xb8912f) },
      },
    });

    this.mesh = new Mesh(geometrie, material);
    this.szene.add(this.mesh);

    this.groesseAnpassen();
    this.zustandSetzen(this.fortschritt());

    const resize = (): void => {
      this.groesseAnpassen();
      this.einmalRendern();
    };
    window.addEventListener('resize', resize, { passive: true });

    /* Rechenzeit nur ausgeben, solange die Sektion wirklich zu sehen ist. */
    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting && !this.ruhig) {
          this.starten();
        } else {
          this.stoppen();
          if (eintrag.isIntersecting) {
            this.einmalRendern();
          }
        }
      },
      { rootMargin: '10% 0px' },
    );
    beobachter.observe(this.host.nativeElement);

    this.einmalRendern();

    this.destroyRef.onDestroy(() => {
      this.stoppen();
      beobachter.disconnect();
      window.removeEventListener('resize', resize);
      geometrie.dispose();
      material.dispose();
      renderer.dispose();
    });
  }

  /** Uebersetzt den Scroll-Fortschritt in Verschleiss und Flugbahn. */
  private zustandSetzen(p: number): void {
    const mesh = this.mesh;
    if (!mesh) {
      return;
    }

    /* Verschleiss setzt bewusst erst nach einem Viertel der Strecke ein:
       zuerst sieht man eine intakte Fahne, dann beginnt der Zerfall.
       Der Endwert liegt unter 1, damit die Fahne am Ende verdreckt und
       loechrig, aber intakt genug ist, um noch Fahne zu sein. */
    const dreck = Math.min(1, Math.max(0, (p - 0.22) / 0.72)) * 0.8;
    mesh.material.uniforms['uDirty'].value = dreck;

    /* Das Band zieht diagonal ueber die volle Breite und laeuft an beiden
       Raendern aus dem Bild. Es wandert deshalb nur langsam durchs Bild —
       ein weiter Weg wuerde es aus dem Ausschnitt schieben, statt den
       Verschleiss zu zeigen. Die Schraeglage oeffnet sich beim Scrollen
       leicht, dadurch wirkt die Bewegung getragen statt statisch. */
    mesh.position.x = -0.55 + p * 1.1;
    mesh.position.y = 0.55 - p * 1.15;
    mesh.rotation.z = -0.40 + p * 0.17;
    mesh.rotation.x = 0.16 - p * 0.26;
  }

  private groesseAnpassen(): void {
    const renderer = this.renderer;
    const kamera = this.kamera;
    if (!renderer || !kamera) {
      return;
    }
    const el = this.host.nativeElement;
    const b = el.clientWidth || 1;
    const h = el.clientHeight || 1;

    renderer.setSize(b, h, false);
    kamera.aspect = b / h;

    /* Bei schmalen Viewports weiter weggehen, damit vom Band mehr als nur
       ein Streifen im Bild steht. */
    kamera.position.z = b / h < 1 ? 10.5 : 7.5;
    kamera.updateProjectionMatrix();
  }

  private starten(): void {
    if (this.laeuft) {
      return;
    }
    this.laeuft = true;
    this.startzeit ||= performance.now();

    const schleife = (jetzt: number): void => {
      if (!this.laeuft) {
        return;
      }
      const mesh = this.mesh;
      if (mesh) {
        mesh.material.uniforms['uTime'].value = (jetzt - this.startzeit) / 1000;
      }
      this.einmalRendern();
      this.frame = requestAnimationFrame(schleife);
    };

    this.frame = requestAnimationFrame(schleife);
  }

  private stoppen(): void {
    this.laeuft = false;
    if (this.frame !== 0) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private einmalRendern(): void {
    if (this.renderer && this.szene && this.kamera) {
      this.renderer.render(this.szene, this.kamera);
    }
  }
}
