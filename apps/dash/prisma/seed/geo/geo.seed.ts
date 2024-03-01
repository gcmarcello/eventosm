import { prisma } from "../../prisma";

export const geoSeed = async () => {
  const cities = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
  ).then((res) => res.json());

  const states = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  ).then((res) => res.json());

  await prisma.state.createMany({
    data: states.map((state: any) => ({
      id: String(state.id),
      name: state.nome,
      uf: state.sigla,
    })),
  });

  await prisma.city.createMany({
    data: cities.map((city: any) => ({
      id: String(city.id),
      name: city.nome,
      stateId: String(city.microrregiao.mesorregiao.UF.id),
    })),
  });
};
