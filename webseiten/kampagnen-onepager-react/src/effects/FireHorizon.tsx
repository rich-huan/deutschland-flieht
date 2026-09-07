import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { FireField } from "./fireEngine";
import { SkylineBackdrop } from "./Skyline";
import { cx } from "../lib/cx";
import styles from "./FireHorizon.module.css";

interface FireHorizonProps {
  /** Stärke des Feuers, 0–1. */
  intensity?: number;
  /** Welche Tiefe die Stadt bekommt — `far` nur als ferne Andeutung. */
  skyline?: "full" | "far" | "none";
  className?: string;
}

/**
 * Horizont eines Abschnitts: ein warmes Grundlicht, darüber brennende Glut auf
 * einem Canvas und davor die Silhouette der Stadt.
 *
 * Bei reduzierter Bewegung bleibt das ruhige Grundlicht mit der Silhouette —
 * nur das Feuer selbst wird nicht simuliert.
 */
export function FireHorizon({ intensity = 1, skyline = "full", className }: FireHorizonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || reduced) return;

    const field = new FireField({ canvas, host, intensity });
    field.start();
    return () => field.destroy();
  }, [reduced, intensity]);

  return (
    <div ref={hostRef} className={cx(styles.horizon, className)} aria-hidden="true">
      <div className={styles.glow} />
      {!reduced && <canvas ref={canvasRef} className={styles.canvas} />}
      {skyline !== "none" && <SkylineBackdrop variant={skyline} />}
      <div className={styles.haze} />
    </div>
  );
}
