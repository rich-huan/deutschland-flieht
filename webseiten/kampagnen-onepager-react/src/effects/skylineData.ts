/**
 * Erzeugt die Silhouette einer Industriestadt.
 *
 * Die Formen werden aus einem festen Startwert (Seed) berechnet, sind also bei
 * jedem Laden identisch — nur eben nicht von Hand gesetzt. So bleibt der
 * Rhythmus der Skyline unregelmäßig, ohne dass 60 Gebäude im Code stehen.
 */

export type BuildingKind = "block" | "tower" | "chimney" | "cooler" | "crane";

export interface Window {
  x: number;
  y: number;
  /** Ein Teil der Fenster flackert; der Index steuert die Verzögerung. */
  flickers: boolean;
}

export interface Building {
  id: string;
  kind: BuildingKind;
  x: number;
  width: number;
  height: number;
  /** Antennenhöhe über dem Dach, 0 = keine. */
  antenna: number;
  windows: Window[];
}

export interface Skyline {
  /** Gesamtbreite der erzeugten Silhouette in viewBox-Einheiten. */
  width: number;
  height: number;
  buildings: Building[];
  /** x-Positionen der Schornsteine — dort steigt Rauch auf. */
  chimneys: number[];
}

export interface LayerConfig {
  seed: number;
  count: number;
  height: number;
  widthRange: [number, number];
  heightRange: [number, number];
  gapRange: [number, number];
  chimneyChance: number;
  coolerChance: number;
  craneChance: number;
  antennaChance: number;
  /** Anteil beleuchteter Fenster; 0 = fensterlose Silhouette. */
  windowDensity: number;
}

/** Kleiner, schneller PRNG mit festem Startwert. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWindows(
  width: number,
  height: number,
  density: number,
  random: () => number,
): Window[] {
  if (density <= 0) return [];

  const columns = Math.floor((width - 10) / 15);
  const rows = Math.floor((height - 14) / 20);
  if (columns < 1 || rows < 1) return [];

  const windows: Window[] = [];
  const offsetX = (width - (columns - 1) * 15) / 2;

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      if (random() > density) continue;
      windows.push({
        x: offsetX + column * 15 - 3,
        y: 12 + row * 20,
        // Nur wenige Fenster flackern, sonst wirkt die Stadt unruhig.
        flickers: random() < 0.22,
      });
    }
  }

  return windows;
}

export function buildSkyline(config: LayerConfig): Skyline {
  const random = mulberry32(config.seed);
  const buildings: Building[] = [];
  const chimneys: number[] = [];

  const [minWidth, maxWidth] = config.widthRange;
  const [minHeight, maxHeight] = config.heightRange;
  const [minGap, maxGap] = config.gapRange;

  let cursor = 0;

  for (let index = 0; index < config.count; index += 1) {
    const roll = random();
    let kind: BuildingKind = "block";
    if (roll < config.chimneyChance) kind = "chimney";
    else if (roll < config.chimneyChance + config.coolerChance) kind = "cooler";
    else if (roll < config.chimneyChance + config.coolerChance + config.craneChance) kind = "crane";
    else if (random() < 0.32) kind = "tower";

    let width = minWidth + random() * (maxWidth - minWidth);
    let height = minHeight + random() * (maxHeight - minHeight);

    // Schornsteine sind schmal und ragen weit über die Dächer hinaus.
    if (kind === "chimney") {
      width = 12 + random() * 10;
      height = maxHeight * (1.05 + random() * 0.35);
    } else if (kind === "cooler") {
      width = maxWidth * (0.8 + random() * 0.4);
      height = maxHeight * (0.55 + random() * 0.25);
    } else if (kind === "crane") {
      width = maxWidth * (0.9 + random() * 0.5);
      height = maxHeight * (0.7 + random() * 0.4);
    } else if (kind === "tower") {
      width = minWidth + random() * (maxWidth - minWidth) * 0.6;
      height = maxHeight * (0.8 + random() * 0.35);
    }

    height = Math.min(height, config.height - 4);

    const antenna =
      kind === "tower" && random() < config.antennaChance ? 12 + random() * 34 : 0;

    buildings.push({
      id: `b${config.seed}-${index}`,
      kind,
      x: cursor,
      width,
      height,
      antenna,
      windows:
        kind === "block" || kind === "tower"
          ? buildWindows(width, height, config.windowDensity, random)
          : [],
    });

    if (kind === "chimney") chimneys.push(cursor + width / 2);

    cursor += width + minGap + random() * (maxGap - minGap);
  }

  return { width: cursor, height: config.height, buildings, chimneys };
}

/** Drei Tiefenebenen: fern und diesig, Mitte mit Industrie, nah und fast schwarz. */
export const SKYLINE_LAYERS: readonly LayerConfig[] = [
  {
    seed: 20_260_904,
    count: 34,
    height: 300,
    widthRange: [22, 58],
    heightRange: [70, 190],
    gapRange: [6, 26],
    chimneyChance: 0.1,
    coolerChance: 0.05,
    craneChance: 0,
    antennaChance: 0.5,
    windowDensity: 0,
  },
  {
    seed: 71_113,
    count: 26,
    height: 300,
    widthRange: [34, 86],
    heightRange: [80, 210],
    gapRange: [10, 40],
    chimneyChance: 0.14,
    coolerChance: 0.08,
    craneChance: 0.08,
    antennaChance: 0.35,
    windowDensity: 0.1,
  },
  {
    seed: 480_915,
    count: 18,
    height: 300,
    widthRange: [58, 132],
    heightRange: [64, 150],
    gapRange: [14, 54],
    chimneyChance: 0.1,
    coolerChance: 0.06,
    craneChance: 0.06,
    antennaChance: 0.2,
    windowDensity: 0.16,
  },
] as const;
