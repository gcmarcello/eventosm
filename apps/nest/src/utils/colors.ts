export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1] as string, 16),
        g: parseInt(result[2] as string, 16),
        b: parseInt(result[3] as string, 16),
      }
    : null;
}

function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return (
    (a[0] as number) * 0.2126 +
    (a[1] as number) * 0.7152 +
    (a[2] as number) * 0.0722
  );
}

function contrast(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

type ColorShades = {
  [key: string]: {
    [key: number]: string;
  };
};

const colorsObject: ColorShades = {
  gray: {
    100: "#F7FAFC",
    200: "#EDF2F7",
    300: "#E2E8F0",
    400: "#CBD5E0",
    500: "#A0AEC0",
    600: "#718096",
    700: "#4A5568",
    800: "#2D3748",
    900: "#1A202C",
  },
  zinc: {
    100: "#F0F4F8",
    200: "#D9E2EC",
    300: "#BCCCDC",
    400: "#9FB3C8",
    500: "#829AB1",
    600: "#627D98",
    700: "#486581",
    800: "#334E68",
    900: "#243B53",
  },
  neutral: {
    100: "#F5F7FA",
    200: "#E4E7EB",
    300: "#CBD2D9",
    400: "#9AA5B1",
    500: "#7B8794",
    600: "#616E7C",
    700: "#52606D",
    800: "#3E4C59",
    900: "#323F4B",
  },
  stone: {
    100: "#EAEAEA",
    200: "#D4D4D4",
    300: "#BEBEBE",
    400: "#909090",
    500: "#636363",
    600: "#4C4C4C",
    700: "#323232",
    800: "#212121",
    900: "#151515",
  },
  red: {
    100: "#FFF5F5",
    200: "#FED7D7",
    300: "#FEB2B2",
    400: "#FC8181",
    500: "#F56565",
    600: "#E53E3E",
    700: "#C53030",
    800: "#9B2C2C",
    900: "#742A2A",
  },
  orange: {
    100: "#FFFAF0",
    200: "#FEEBC8",
    300: "#FBD38D",
    400: "#F6AD55",
    500: "#ED8936",
    600: "#DD6B20",
    700: "#C05621",
    800: "#9C4221",
    900: "#7B341E",
  },
  amber: {
    100: "#FFFBEB",
    200: "#FEF3C7",
    300: "#FDE68A",
    400: "#FCD34D",
    500: "#FBBF24",
    600: "#F59E0B",
    700: "#D97706",
    800: "#B45309",
    900: "#92400E",
  },
  yellow: {
    100: "#FFFFF0",
    200: "#FEFCBF",
    300: "#FAF089",
    400: "#F6E05E",
    500: "#ECC94B",
    600: "#D69E2E",
    700: "#B7791F",
    800: "#975A16",
    900: "#744210",
  },
  lime: {
    100: "#F7FEE7",
    200: "#ECFCCB",
    300: "#D9F99D",
    400: "#BEF264",
    500: "#A3E635",
    600: "#84CC16",
    700: "#65A30D",
    800: "#4D7C0F",
    900: "#3F6212",
  },
  green: {
    100: "#F0FFF4",
    200: "#C6F6D5",
    300: "#9AE6B4",
    400: "#68D391",
    500: "#48BB78",
    600: "#38A169",
    700: "#2F855A",
    800: "#276749",
    900: "#22543D",
  },
  emerald: {
    100: "#ECFDF5",
    200: "#D1FAE5",
    300: "#A7F3D0",
    400: "#6EE7B7",
    500: "#34D399",
    600: "#10B981",
    700: "#059669",
    800: "#047857",
    900: "#065F46",
  },
  teal: {
    100: "#F0FDFA",
    200: "#CCFBF1",
    300: "#99F6E4",
    400: "#5EEAD4",
    500: "#2DD4BF",
    600: "#14B8A6",
    700: "#0D9488",
    800: "#0F766E",
    900: "#115E59",
  },
  cyan: {
    100: "#ECFEFF",
    200: "#CFFAFE",
    300: "#A5F3FC",
    400: "#67E8F9",
    500: "#22D3EE",
    600: "#06B6D4",
    700: "#0891B2",
    800: "#0E7490",
    900: "#155E75",
  },
  sky: {
    100: "#F0F9FF",
    200: "#E0F2FE",
    300: "#BAE6FD",
    400: "#7DD3FC",
    500: "#38BDF8",
    600: "#0EA5E9",
    700: "#0284C7",
    800: "#0369A1",
    900: "#075985",
  },
  blue: {
    100: "#EFF6FF",
    200: "#DBEAFE",
    300: "#BFDBFE",
    400: "#93C5FD",
    500: "#60A5FA",
    600: "#3B82F6",
    700: "#2563EB",
    800: "#1D4ED8",
    900: "#1E40AF",
  },
  indigo: {
    100: "#EEF2FF",
    200: "#E0E7FF",
    300: "#C7D2FE",
    400: "#A5B4FC",
    500: "#818CF8",
    600: "#6366F1",
    700: "#4F46E5",
    800: "#4338CA",
    900: "#3730A3",
  },
  violet: {
    100: "#F5F3FF",
    200: "#EDE9FE",
    300: "#DDD6FE",
    400: "#C4B5FD",
    500: "#A78BFA",
    600: "#8B5CF6",
    700: "#7C3AED",
    800: "#6D28D9",
    900: "#5B21B6",
  },
  purple: {
    100: "#FAF5FF",
    200: "#F3E8FF",
    300: "#E9D5FF",
    400: "#D8B4FE",
    500: "#C084FC",
    600: "#A855F7",
    700: "#9333EA",
    800: "#7E22CE",
    900: "#6B21A8",
  },
  fuchsia: {
    100: "#FDF4FF",
    200: "#FAE8FF",
    300: "#F5D0FE",
    400: "#F0ABFC",
    500: "#E879F9",
    600: "#D946EF",
    700: "#C026D3",
    800: "#A21CAF",
    900: "#86198F",
  },
  pink: {
    100: "#FDF2F8",
    200: "#FCE7F3",
    300: "#FBCFE8",
    400: "#F9A8D4",
    500: "#F472B6",
    600: "#EC4899",
    700: "#DB2777",
    800: "#BE185D",
    900: "#9D174D",
  },
};

const colors = [
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "black",
  "white",
];

export function chooseTextColor(hexColor: string): string {
  const rgbColor = hexToRgb(hexColor ?? "");
  if (!rgbColor) {
    return "white";
  }
  const darkContrast = contrast(rgbColor, { r: 55, g: 65, b: 81 });
  const whiteContrast = contrast(rgbColor, { r: 255, g: 255, b: 255 });

  return darkContrast > whiteContrast ? "#1F2937" : "white";
}

export function darkenColor(hexColor: string, percent: number): string {
  if (!hexColor.startsWith("#")) {
    return hexColor; // Return original color if not a valid hex color
  }

  // Parse hex color components
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate darker color components
  const darkerR = Math.floor(r * (1 - percent / 100));
  const darkerG = Math.floor(g * (1 - percent / 100));
  const darkerB = Math.floor(b * (1 - percent / 100));

  // Convert to hex format
  const darkerHex = `#${darkerR.toString(16).padStart(2, "0")}${darkerG.toString(16).padStart(2, "0")}${darkerB.toString(16).padStart(2, "0")}`;

  return darkerHex;
}

export function alterColorShade(tailwindColor: string, shade: number): string {
  const [color] = tailwindColor.split("-");
  if (!color || !colors.includes(color)) return tailwindColor;
  return `${color}-${shade}`;
}

export function compareContrasts(
  firstTailwindColor: string,
  secondTailwindColor: string,
  comparingTailwindColor: string
) {
  const [firstColor, firstShade] = firstTailwindColor.split("-");
  const [secondColor, secondShade] = secondTailwindColor.split("-");
  const [comparingColor, comparingShade] = comparingTailwindColor.split("-");

  if (
    !firstColor ||
    !colors.includes(firstColor) ||
    !secondColor ||
    !colors.includes(secondColor) ||
    !comparingColor ||
    !colors.includes(comparingColor)
  )
    return false;

  const firstHexColor =
    colorsObject[firstColor]?.[Number(firstShade)] ?? "#FFFFFF";
  const secondHexColor =
    colorsObject[secondColor]?.[Number(secondShade)] ?? "#FFFFFF";
  const comparingHexColor =
    colorsObject[comparingColor]?.[Number(comparingShade)] ?? "#FFFFFF";

  const firstRgbColor = hexToRgb(firstHexColor ?? "");
  const secondRgbColor = hexToRgb(secondHexColor ?? "");
  const comparingRgbColor = hexToRgb(comparingHexColor ?? "");

  if (!firstRgbColor || !secondRgbColor || !comparingRgbColor) return false;

  const firstContrast = contrast(firstRgbColor, comparingRgbColor);
  const secondContrast = contrast(secondRgbColor, comparingRgbColor);

  return firstContrast > secondContrast
    ? firstTailwindColor
    : secondTailwindColor;
}
