import dayjs from "dayjs";
import { hashInfo } from "../../src/utils/bCrypt";
import { prisma } from "../prisma";

export const userSeed = async () => {
  const admin = await prisma.user.create({
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

  const user = await prisma.user.create({
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
  return admin;
};
