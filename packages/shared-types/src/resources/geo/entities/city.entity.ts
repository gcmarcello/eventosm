import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { State } from "./state.entity";

@Entity({ schema: "geo" })
export class City {
  @PrimaryKey({ type: "string" })
  id: string;

  @Property()
  name: string;

  @ManyToOne()
  state: State;
}
