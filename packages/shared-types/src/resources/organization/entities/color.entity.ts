import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ColorId } from "../../../types/colors";

@Entity({ schema: "colors" })
export class Color {
  @PrimaryKey()
  id: string;

  @Property({ type: "jsonb" })
  tw?: { id: string; color: ColorId; shade: string };

  @Property()
  hex?: string;

  @Property()
  rgb?: string;
}
