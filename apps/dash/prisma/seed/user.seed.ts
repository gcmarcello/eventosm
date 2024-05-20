import dayjs from "dayjs";
import { hashInfo } from "../../src/utils/bCrypt";
import { prisma } from "../prisma";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { EventGroup, Gender } from "@prisma/client";
import { normalizeEmail } from "odinkit";

export const userSeed = async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const cities = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
  ).then((res) => res.json());

  const states = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  ).then((res) => res.json());

  const uuids = Array.from({ length: 5000 }, () => ({
    userInfoUUID: faker.string.uuid(),
    userUUID: faker.string.uuid(),
  }));

  const infos = uuids.map(({ userInfoUUID }) => ({
    id: userInfoUUID,
    address: faker.location.streetAddress(),
    number: faker.location.buildingNumber(),
    zipCode: faker.location.zipCode(),
    birthDate: faker.date.past({
      refDate: dayjs().subtract(30, "year").toDate(),
    }),
    cityId: String(
      cities[Math.floor(Math.random() * cities.length) as number]?.id
    ),
    stateId: String(
      states[Math.floor(Math.random() * states.length) as number]?.id
    ),
    gender: ["male", "female"][
      Math.floor(Math.random() * 2) as number
    ] as Gender,
  }));

  await prisma.userInfo.createMany({
    data: infos,
  });

  const uniqueEmails = new Set<string>();

  while (uniqueEmails.size < 5000) {
    uniqueEmails.add(
      faker.internet.email({
        allowSpecialCharacters: true,
      })
    );
  }

  const emails = Array.from(uniqueEmails);

  const hashedPassword = await hashInfo("123456");
  const users = uuids.map(({ userUUID, userInfoUUID }, i) => ({
    id: userUUID,
    document: faker.finance.accountNumber(),
    email: normalizeEmail(emails[i] as string),
    fullName: faker.person.fullName(),
    role: "user",
    password: hashedPassword,
    phone: faker.phone.number(),
    confirmed: true,
    infoId: userInfoUUID,
  }));

  await prisma.user.createMany({
    data: users,
  });

  await prisma.user.create({
    data: {
      document: "43895124801",
      email: "teste@teste1.com",
      fullName: "Tester",
      role: "user",
      password: await hashInfo("123456"),
      phone: "21999999998",
      confirmed: true,
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

  return await prisma.user.create({
    data: {
      document: "43895124800",
      email: "sergio@loroza.com",
      fullName: "Sergio Loroza",
      role: "admin",
      password: await hashInfo("123456"),
      phone: "21999999999",
      confirmed: true,
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
};
