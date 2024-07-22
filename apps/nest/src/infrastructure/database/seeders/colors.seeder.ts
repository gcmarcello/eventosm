import { Color } from "@/resources/organizations/entities/color.entity";
import { EntityManager } from "@mikro-orm/core";
import { ColorId, twColor, twColorPalette, twShade } from "shared-types";

export async function colorSeeder(em: EntityManager) {
  const colors: any[] = Object.entries(twColorPalette).flatMap(
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

  for (const color of colors) {
    const entity = em.create(Color, color);
    em.persist(entity);
  }
}
