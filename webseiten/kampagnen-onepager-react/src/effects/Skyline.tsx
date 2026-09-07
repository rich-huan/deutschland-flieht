import { useId, useMemo } from "react";
import { type Building, SKYLINE_LAYERS, type Skyline as SkylineModel, buildSkyline } from "./skylineData";
import { cx } from "../lib/cx";
import styles from "./Skyline.module.css";

const BASELINE = 300;

function shapeOf(building: Building): string {
  const { x, width: w, height: h } = building;
  const top = BASELINE - h;

  if (building.kind === "chimney") {
    // Nach oben verjüngter Schornstein.
    return `M${x} ${BASELINE} L${x + w} ${BASELINE} L${x + w * 0.78} ${top} L${x + w * 0.22} ${top} Z`;
  }

  if (building.kind === "cooler") {
    // Eingeschnürter Kühlturm.
    return [
      `M${x} ${BASELINE}`,
      `C${x + w * 0.16} ${BASELINE - h * 0.55}, ${x + w * 0.32} ${BASELINE - h * 0.82}, ${x + w * 0.27} ${top}`,
      `L${x + w * 0.73} ${top}`,
      `C${x + w * 0.68} ${BASELINE - h * 0.82}, ${x + w * 0.84} ${BASELINE - h * 0.55}, ${x + w} ${BASELINE}`,
      "Z",
    ].join(" ");
  }

  return `M${x} ${BASELINE} L${x} ${top} L${x + w} ${top} L${x + w} ${BASELINE} Z`;
}

function BuildingShape({ building }: { building: Building }) {
  const { x, width: w, height: h } = building;
  const top = BASELINE - h;

  if (building.kind === "crane") {
    // Baukran: Mast, Ausleger, Gegengewicht und Hakenseil.
    const mastX = x + w * 0.44;
    return (
      <g>
        <rect x={mastX} y={top} width={5} height={h} />
        <rect x={x} y={top} width={w} height={4} />
        <rect x={x + w * 0.02} y={top + 4} width={16} height={11} />
        <rect x={x + w * 0.8} y={top + 4} width={1.5} height={h * 0.3} />
      </g>
    );
  }

  return (
    <g>
      <path d={shapeOf(building)} />

      {building.antenna > 0 && (
        <rect x={x + w / 2 - 1} y={top - building.antenna} width={2} height={building.antenna} />
      )}

      {building.kind === "chimney" && (
        <>
          <rect className={styles.stripe} x={x + w * 0.21} y={top + 10} width={w * 0.58} height={5} />
          <rect className={styles.stripe} x={x + w * 0.2} y={top + 22} width={w * 0.6} height={5} />
        </>
      )}

      {building.windows.map((window, index) => (
        <rect
          key={`${building.id}-w${index}`}
          className={cx(styles.window, window.flickers && styles.flicker)}
          x={x + window.x}
          y={top + window.y}
          width={5}
          height={7}
          style={{ animationDelay: `${(index % 7) * 730 + (building.x % 900)}ms` }}
        />
      ))}
    </g>
  );
}

function SmokePlume({ x, gradientId }: { x: number; gradientId: string }) {
  return (
    <g className={styles.smoke}>
      {[0, 1, 2].map((puff) => (
        <ellipse
          key={puff}
          className={styles.puff}
          cx={x}
          cy={0}
          rx={26}
          ry={20}
          fill={`url(#${gradientId})`}
          style={{ animationDelay: `${puff * 2600}ms` }}
        />
      ))}
    </g>
  );
}

interface SkylineLayerProps {
  model: SkylineModel;
  index: number;
  gradientId: string;
  withSmoke: boolean;
}

function SkylineLayer({ model, index, gradientId, withSmoke }: SkylineLayerProps) {
  return (
    <svg
      className={styles.layer}
      data-depth={index}
      viewBox={`0 0 ${Math.round(model.width)} ${BASELINE}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor="rgb(196 186 178)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(196 186 178)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {withSmoke &&
        model.chimneys.map((x) => (
          <SmokePlume key={`smoke-${x}`} x={x} gradientId={gradientId} />
        ))}

      {model.buildings.map((building) => (
        <BuildingShape key={building.id} building={building} />
      ))}
    </svg>
  );
}

interface SkylineProps {
  /** `full` zeigt alle drei Tiefenebenen, `far` nur die ferne Silhouette. */
  variant?: "full" | "far";
  className?: string;
}

/**
 * Silhouette einer Industriestadt in drei Tiefenebenen — fern und diesig,
 * Mitte mit Schornsteinen und Kränen, vorne fast schwarz mit erleuchteten
 * Fenstern.
 */
export function SkylineBackdrop({ variant = "full", className }: SkylineProps) {
  const id = useId();
  const layers = useMemo(
    () => SKYLINE_LAYERS.map((config) => buildSkyline(config)),
    [],
  );

  const visible = variant === "far" ? layers.slice(0, 1) : layers;

  return (
    <div className={cx(styles.skyline, styles[variant], className)} aria-hidden="true">
      {visible.map((model, index) => (
        <SkylineLayer
          key={index}
          model={model}
          index={index}
          gradientId={`smoke-${id}-${index}`}
          withSmoke={variant === "full" && index === 1}
        />
      ))}
    </div>
  );
}
