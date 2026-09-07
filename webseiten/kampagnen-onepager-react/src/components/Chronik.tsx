import { useId, useMemo, useState } from "react";
import { type TimelinePoint, timeline } from "../content/site";
import { useInView } from "../hooks/useInView";
import { formatNumber } from "../lib/format";
import { SectionHead } from "./SectionHead";
import styles from "./Chronik.module.css";

/** Zeichenfläche in Nutzerkoordinaten. Das SVG skaliert selbst mit. */
const VIEW = { width: 900, height: 380 };
const PAD = { top: 32, right: 28, bottom: 44, left: 52 };

interface Plotted extends TimelinePoint {
  cx: number;
  cy: number;
}

function buildPlot(points: readonly TimelinePoint[]) {
  const values = points.map((point) => point.value);
  const max = Math.ceil(Math.max(...values) / 50) * 50;
  const min = 0;

  const innerWidth = VIEW.width - PAD.left - PAD.right;
  const innerHeight = VIEW.height - PAD.top - PAD.bottom;

  const plotted: Plotted[] = points.map((point, index) => ({
    ...point,
    cx: PAD.left + (index / (points.length - 1)) * innerWidth,
    cy: PAD.top + innerHeight - ((point.value - min) / (max - min)) * innerHeight,
  }));

  const line = plotted
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.cx.toFixed(1)} ${point.cy.toFixed(1)}`)
    .join(" ");

  const first = plotted[0];
  const last = plotted[plotted.length - 1];
  const baseline = PAD.top + innerHeight;
  const area =
    first && last
      ? `${line} L${last.cx.toFixed(1)} ${baseline} L${first.cx.toFixed(1)} ${baseline} Z`
      : "";

  // Vier Gitterlinien reichen — das Gitter soll zurücktreten.
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((step) => ({
    value: Math.round(min + (max - min) * step),
    y: PAD.top + innerHeight - step * innerHeight,
  }));

  return { plotted, line, area, ticks, max, baseline };
}

export function Chronik() {
  const id = useId();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [hovered, setHovered] = useState<number | null>(null);

  const plot = useMemo(() => buildPlot(timeline.points), []);
  const active = hovered === null ? null : plot.plotted[hovered];

  return (
    <section id="chronik" data-surface="paper" className={styles.section} aria-labelledby="chronik-title">
      <div className="container">
        <SectionHead index="03" label="Chronik" title={timeline.title} titleId="chronik-title">
          {timeline.lede}
        </SectionHead>

        <figure ref={ref} className={styles.figure} data-visible={inView ? "" : undefined}>
          <figcaption className={styles.legend}>
            <span className={styles.swatch} aria-hidden="true" />
            {timeline.unit}
          </figcaption>

          <div className={styles.plotWrap}>
            <svg
              className={styles.plot}
              viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
              role="img"
              aria-label={`Verlauf ${timeline.unit} von ${timeline.points[0]?.year} bis ${timeline.points[timeline.points.length - 1]?.year}. Die Tabelle darunter enthält alle Werte.`}
              onPointerLeave={() => setHovered(null)}
            >
              <defs>
                <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--c-chart-1)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--c-chart-1)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Gitter und Achsenbeschriftung treten bewusst zurück. */}
              {plot.ticks.map((tick) => (
                <g key={tick.value}>
                  <line
                    className={styles.grid}
                    x1={PAD.left}
                    y1={tick.y}
                    x2={VIEW.width - PAD.right}
                    y2={tick.y}
                  />
                  <text className={styles.axis} x={PAD.left - 12} y={tick.y + 4} textAnchor="end">
                    {tick.value}
                  </text>
                </g>
              ))}

              {plot.plotted.map((point, index) => (
                <text
                  key={`x-${point.year}`}
                  className={styles.axis}
                  x={point.cx}
                  y={VIEW.height - 16}
                  textAnchor="middle"
                  // Auf schmalen Displays bleibt nur jedes zweite Jahr stehen.
                  data-dense={index % 2 === 1 ? "" : undefined}
                >
                  {point.year}
                </text>
              ))}

              <path className={styles.area} d={plot.area} fill={`url(#area-${id})`} />
              <path className={styles.line} d={plot.line} />

              {active && (
                <line
                  className={styles.crosshair}
                  x1={active.cx}
                  y1={PAD.top}
                  x2={active.cx}
                  y2={plot.baseline}
                />
              )}

              {plot.plotted.map((point, index) => (
                <circle
                  key={`dot-${point.year}`}
                  className={styles.dot}
                  cx={point.cx}
                  cy={point.cy}
                  r={hovered === index ? 6 : 4}
                  data-active={hovered === index ? "" : undefined}
                  style={{ transitionDelay: `${900 + index * 55}ms` }}
                />
              ))}

              {/* Großzügige, unsichtbare Trefferflächen für die Maus. */}
              {plot.plotted.map((point, index) => (
                <rect
                  key={`hit-${point.year}`}
                  className={styles.hit}
                  x={point.cx - (VIEW.width - PAD.left - PAD.right) / (plot.plotted.length * 2)}
                  y={PAD.top}
                  width={(VIEW.width - PAD.left - PAD.right) / plot.plotted.length}
                  height={plot.baseline - PAD.top}
                  onPointerEnter={() => setHovered(index)}
                />
              ))}

              {/* Der letzte Wert ist direkt beschriftet — kein Label an jedem Punkt. */}
              {plot.plotted.length > 0 && (
                <text
                  className={styles.endLabel}
                  x={(plot.plotted[plot.plotted.length - 1]?.cx ?? 0) - 6}
                  y={(plot.plotted[plot.plotted.length - 1]?.cy ?? 0) - 18}
                  textAnchor="end"
                >
                  {plot.plotted[plot.plotted.length - 1]?.value}
                </text>
              )}
            </svg>

            {active && (
              <div
                className={styles.tooltip}
                style={{
                  left: `${(active.cx / VIEW.width) * 100}%`,
                  top: `${(active.cy / VIEW.height) * 100}%`,
                }}
                role="status"
              >
                <span className={styles.tooltipYear}>{active.year}</span>
                <span className={styles.tooltipValue}>
                  {formatNumber(active.value)} {timeline.unit}
                </span>
              </div>
            )}
          </div>

          <p className={styles.source}>
            {timeline.source ?? "Platzhalter — Quelle wird ergänzt"}
          </p>

          {/* Textalternative zum Diagramm. */}
          <table className="sr-only">
            <caption>{timeline.title}</caption>
            <thead>
              <tr>
                <th scope="col">Jahr</th>
                <th scope="col">{timeline.unit}</th>
              </tr>
            </thead>
            <tbody>
              {timeline.points.map((point) => (
                <tr key={point.year}>
                  <th scope="row">{point.year}</th>
                  <td>{formatNumber(point.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </div>
    </section>
  );
}
