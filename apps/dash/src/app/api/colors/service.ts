import { ColorId, Color } from "@prisma/client";

export async function generateColorJson<T extends Record<string, ColorId>>({
  colors,
}: {
  colors: T;
}): Promise<{ [key in keyof T]?: Color }> {
  // Changed return type to promise of an object with optional Color values
  const _colors = await prisma.color.findMany({
    where: {
      id: {
        in: Object.values(colors),
      },
    },
  });

  const colorJson: { [key in keyof T]?: Color } = _colors.reduce(
    (acc, color) => {
      const colorNameEntry = Object.entries(colors).find(
        ([_, colorId]) => color.id === colorId
      );
      if (!colorNameEntry) return acc; // If no matching entry is found, return the accumulator as is

      const [colorName] = colorNameEntry;
      return {
        ...acc,
        [colorName]: color,
      };
    },
    {}
  );

  return colorJson;
}
