import { compareHash } from "@/utils/bCrypt";
import { ParsedSignupDto, SignupDto } from "./dto";
import { getEnv } from "@/utils/settings";
import * as jose from "jose";
import { prisma } from "prisma/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export async function signup(request: ParsedSignupDto) {
  const newUser = await prisma.user.create({
    data: {
      fullName: request.fullName,
      email: request.email,
      document: request.document.value,
      phone: request.phone,
      password: request.passwords.password,
      role: "user",
      info: {
        create: {
          birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY").toISOString(),
          gender: request.info.gender,
          zipCode: request.info.zipCode,
          address: request.info.address,
          number: request.info.number,
          complement: request.info.complement,
          cityId: request.info.cityId,
          stateId: request.info.stateId,
        },
      },
    },
  });
  return newUser;
}

export function createToken(request: { id: string }) {
  const JWT_KEY = new TextEncoder().encode(getEnv("JWT_KEY"));
  if (!JWT_KEY)
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  const token = new jose.SignJWT({ id: request.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("eventosmapi")
    .setAudience("user")
    .setExpirationTime("1h")
    .sign(JWT_KEY);
  return token;
}

export async function login(request: any) {
  if (!(await compareHash(request.password, request.user.password)))
    throw `${request.isEmail ? "Email" : "Usuário"} ou senha incorretos.`;

  return createToken({ id: request.user.id });
}
