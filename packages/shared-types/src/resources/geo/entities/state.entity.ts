import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { City } from "./city.entity";

@Entity({ schema: "geo" })
export class State {
  @PrimaryKey({ type: "string" })
  id!: string;

  @Property({ unique: true })
  uf!: string;

  @Property({ unique: true })
  name!: string;

  @OneToMany(() => City, (city) => city.state)
  city?: City[];
}
