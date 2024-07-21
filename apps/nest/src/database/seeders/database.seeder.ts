import { City } from "@/resources/geo/entites/city.entity";
import { State } from "@/resources/geo/entites/state.entity";
import { OrganizationPermission } from "@/resources/organizations/entities/organizationPermission.entity";

import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { OrganizationPermissions } from "shared-types";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const permissions = Object.values(OrganizationPermissions);

    for (const permission of permissions) {
      const entity = em.create(OrganizationPermission, {
        permission: permission,
      });
      em.persist(entity);
    }

    const cities = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    ).then((res) => res.json());

    const states = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    ).then((res) => res.json());

    for (const state of states) {
      const entity = em.create(State, {
        id: String(state.id),
        uf: state.sigla,
        name: state.nome,
      });
      em.persist(entity);
    }

    for (const city of cities) {
      const entity = em.create(City, {
        id: String(city.id),
        name: city.nome,
        state: String(city.microrregiao.mesorregiao.UF.id),
      });
      em.persist(entity);
    }

    await em.flush();
  }
}
