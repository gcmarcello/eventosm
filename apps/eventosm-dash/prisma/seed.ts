import { PrismaClient } from "@prisma/client";
import { hashInfo } from "../src/utils/bCrypt";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
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

  const user = await prisma.user.upsert({
    where: { email: "sergio@loroza.com" },
    create: {
      document: "88325584084",
      email: "sergio@loroza.com",
      fullName: "Sergio Loroza",
      role: "user",
      password: await hashInfo("123456"),
      phone: "21999999999",
      info: {
        create: {
          address: "Rua do Catete",
          number: "123",
          zipCode: "22220000",
          birthDate: dayjs("1980-01-01").toDate(),
          cityId: "3304557",
          stateId: "33",
          gender: "male",
        },
      },
    },
    update: {
      document: "88325584084",
      email: "sergio@loroza.com",
      fullName: "Sergio Loroza",
      role: "user",
      password: await hashInfo("123456"),
      phone: "21999999999",
      info: {
        create: {
          address: "Rua do Catete",
          number: "123",
          zipCode: "22220000",
          birthDate: dayjs("1980-01-01").toDate(),
          cityId: "3304557",
          stateId: "33",
          gender: "male",
        },
      },
    },
  });

  const orgUUID = "0ce7d854-e9c8-468b-b28b-28d32d725676";

  const org = await prisma.organization.upsert({
    where: { id: orgUUID },
    create: {
      id: orgUUID,
      ownerId: user.id,
      name: "Confederacao Brasileira de MTB",
      slug: "cbmtb",
      options: {
        logos: {
          lg: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/logonotxt.png",
        },
        colors: {
          primaryColor: "green",
          primaryShade: "600",
          tertiaryColor: "yellow",
          tertiaryShade: "300",
          secondaryColor: "blue",
          secondaryShade: "600",
        },
      },
      phone: "21999999999",
      email: "",
    },
    update: {
      ownerId: user.id,
      name: "Confederacao Brasileira de MTB",
      slug: "cbmtb",
      options: {
        logos: {
          lg: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/logonotxt.png",
        },
        colors: {
          primaryColor: "green",
          primaryShade: "600",
          tertiaryColor: "yellow",
          tertiaryShade: "300",
          secondaryColor: "blue",
          secondaryShade: "600",
        },
      },
      phone: "21999999999",
      email: "",
    },
  });

  const eventGroupUUID = "0ce7d854-e9c8-468b-b28b-28d32d725676";
  const batchId = "8f95a855-5c36-47fd-b09e-6e208243fd3d";
  const categoryId = "8f95a855-5c36-47fd-b09e-6e208243fd3d";

  const eventGroup = await prisma.eventGroup.upsert({
    where: { id: eventGroupUUID },
    create: {
      id: eventGroupUUID,
      organizationId: org.id,
      name: "Copa Brasil de MTB",
      slug: "copabrasil",
      registrationType: "mixed",
      location: "Rio de Janeiro",
      eventGroupType: "championship",
      EventGroupRules: {
        create: {
          mode: "league",
          resultType: "time",
          discard: 3,
          scoreCalculation: "average",
          justifiedAbsences: 3,
          unjustifiedAbsences: 0,
        },
      },
      EventModality: {
        create: {
          name: "MTB",
          modalityCategory: {
            create: {
              id: categoryId,
              name: "Mountain Bike",
              maxAge: 60,
              minAge: 16,
              gender: "unisex",
            },
          },
        },
      },
      EventRegistrationBatch: {
        create: {
          registrationType: "mixed",
          id: batchId,
          name: "Lote 1",
          dateStart: dayjs("2022-01-01").toDate(),
          dateEnd: dayjs("2022-12-31").toDate(),
          maxRegistrations: 100,
          price: 0,
        },
      },
    },
    update: {
      id: eventGroupUUID,
      organizationId: org.id,
      name: "Copa Brasil de MTB",
      slug: "copabrasil",
      registrationType: "mixed",
      location: "Rio de Janeiro",
      eventGroupType: "championship",
      EventGroupRules: {
        create: {
          mode: "league",
          resultType: "time",
          discard: 3,
          scoreCalculation: "average",
          justifiedAbsences: 3,
          unjustifiedAbsences: 0,
        },
      },
      EventModality: {
        create: {
          name: "MTB",
          modalityCategory: {
            create: {
              name: "Mountain Bike",
              maxAge: 60,
              minAge: 16,
              gender: "unisex",
            },
          },
        },
      },
      EventRegistrationBatch: {
        create: {
          registrationType: "mixed",
          name: "Lote 1",
          dateStart: dayjs("2022-01-01").toDate(),
          dateEnd: dayjs("2022-12-31").toDate(),
          maxRegistrations: 100,
          price: 100,
        },
      },
    },
  });

  const registration = await prisma.eventRegistration.create({
    data: {
      code: "1",
      status: "completed",
      batchId,
      categoryId,
      userId: user.id,
      eventGroupId: eventGroup.id,
    },
  });
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
