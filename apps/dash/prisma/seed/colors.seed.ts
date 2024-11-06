import { twColor, twColorPalette, twShade } from "odinkit";
import { Color, ColorId } from "@prisma/client";
import prisma from "prisma/prisma";

export const colorSeed = () => {
  const colors: Color[] = Object.entries(twColorPalette).flatMap(
    ([colorName, shades]) =>
      Object.entries(shades).map(([shade, hex]) => ({
        id: `${colorName.replace("/", "_")}${shade.replace("-", "_")}` as ColorId,
        tw: {
          id: `${colorName}${shade}`,
          color: colorName as twColor,
          shade: shade.replace("-", "") as twShade | null,
        },
        hex,
        rgb: null,
      }))
  );
  return prisma.color.createMany({
    data: colors,
  });
};
