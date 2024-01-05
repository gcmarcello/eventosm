import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const cities = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
  ).then((res) => res.json());

  const states = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  ).then((res) => res.json());

  for (const state of states) {
    await prisma.state.upsert({
      where: { id: state.id },
      update: {},
      create: {
        id: state.id,
        name: state.nome,
        uf: state.sigla,
      },
    });
  }

  for (const city of cities) {
    const stateId = city.microrregiao.mesorregiao.UF.id;
    await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: {
        id: city.id,
        name: city.nome,
        state: {
          connect: {
            id: stateId,
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
