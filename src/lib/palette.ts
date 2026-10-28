export interface ArtPalette {
  from: string;
  to: string;
  accent: string;
  seed: number;
}

const palettes: Record<string, ArtPalette> = {
  Craft: { from: "#1d1410", to: "#08070a", accent: "#ff6a3d", seed: 41 },
  Engineering: { from: "#0f1620", to: "#07080b", accent: "#a8c3ff", seed: 53 },
  Strategy: { from: "#18111f", to: "#08070a", accent: "#d9b8ff", seed: 67 },
  Operations: { from: "#151a12", to: "#07080a", accent: "#c9e37f", seed: 79 },
};

export function paletteForCategory(category: string): ArtPalette {
  return (
    palettes[category] ?? {
      from: "#141419",
      to: "#07070a",
      accent: "#ff6a3d",
      seed: 13,
    }
  );
}
