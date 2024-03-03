import dayjs from "dayjs";
import { hashInfo } from "../../src/utils/bCrypt";
import { prisma } from "../prisma";

export const userSeed = async () => {
  return await prisma.user.create({
    data: {
      document: "88325584084",
      email: "sergio@loroza.com",
      fullName: "Sergio Loroza",
      role: "admin",
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
};
