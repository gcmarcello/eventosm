import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ColorId } from "shared-types";

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
