import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SparkField } from "./sparkEngine";
import styles from "./SparkLayer.module.css";

/**
 * Beobachtet, ob gerade ein Papier-Kapitel die Bildmitte füllt.
 *
 * Glut gehört zur Nacht. Über dem Papier würde sie als schmutzige orange
 * Sprenkel liegen, deshalb blendet die Ebene dort aus.
 */
function usePaperInView(): boolean {
  const [onPaper, setOnPaper] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const papers = document.querySelectorAll("[data-surface='paper']");
    if (papers.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setOnPaper(visible.size > 0);
      },
      // Schmales Band quer durch die Bildmitte.
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    papers.forEach((paper) => observer.observe(paper));
    return () => observer.disconnect();
  }, []);

  return onPaper;
}

/**
 * Effektebene der gesamten Seite: aufsteigende Glut auf einem Canvas und ein
 * weiches, warmes Licht, das dem Mauszeiger nachläuft.
 *
 * Das Licht liegt hinter dem Inhalt (z-index -1) und leuchtet den Hintergrund
 * aus; die Funken liegen darüber, aber unter dem Filmkorn.
 */
export function SparkLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const onPaper = usePaperInView();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const field = new SparkField({
      canvas,
      glow: glowRef.current,
      // Auf Touch-Geräten bleibt nur die ruhige Umgebungsglut.
      ambientRate: finePointer ? 7 : 4,
      cursorEnabled: finePointer,
    });

    field.start();
    return () => field.destroy();
  }, [reduced]);

  // Bei reduzierter Bewegung bleibt die Seite vollständig ruhig.
  if (reduced) return null;

  return (
    <>
      <div ref={glowRef} className={styles.glow} aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-dimmed={onPaper ? "" : undefined}
        aria-hidden="true"
      />
    </>
  );
}
