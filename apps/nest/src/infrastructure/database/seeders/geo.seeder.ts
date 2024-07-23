import { EntityManager } from "@mikro-orm/core";
import { City, State } from "shared-types";

export async function geoSeeder(em: EntityManager) {
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
}
