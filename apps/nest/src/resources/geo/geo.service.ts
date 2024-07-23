import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { City, State } from "shared-types";

@Injectable()
export class GeoService {
  constructor(private em: EntityManager) {}

  async findCityById(id: string) {
    const city = await this.em.findOne(City, { id });
    return city;
  }

  async findStateById(id: string) {
    const state = await this.em.findOne(State, { id });
    return state;
  }
}
