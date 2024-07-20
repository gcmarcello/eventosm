import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { State } from "./state.entity";

@Entity({ schema: "geo" })
export class City {
  @PrimaryKey({ type: "string" })
  id!: string;

  @Property({ unique: true })
  uf!: string;

  @Property({ unique: true })
  name!: string;

  @ManyToOne()
  state: State;
}
