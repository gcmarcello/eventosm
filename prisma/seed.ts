import { PrismaClient } from "@prisma/client";
import { states } from "../geo/states";
import { cities } from "../geo/cities";
const prisma = new PrismaClient();

async function main() {
  for (const state of states.data) {
    await prisma.state.upsert({
      where: { code: String(state.CodigoUf) },
      update: {},
      create: {
        name: state.Nome,
        abbreviation: state.Uf,
        code: String(state.CodigoUf),
      },
    });
  }

  for (const city of cities.data) {
    await prisma.city.upsert({
      where: { code: String(city.Codigo) },
      update: {},
      create: {
        name: city.Nome,
        code: String(city.Codigo),
        state: {
          connect: {
            abbreviation: String(city.Uf),
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
