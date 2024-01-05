import { compareHash, hashInfo } from "@/utils/bCrypt";
import { LoginDto, ParsedSignupDto, SignupDto } from "./dto";
import { getEnv } from "@/utils/settings";
import * as jose from "jose";
import { prisma } from "prisma/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { normalize, normalizeEmail, normalizePhone } from "@/utils/format";
import { cookies } from "next/headers";
dayjs.extend(customParseFormat);

export async function signup(request: ParsedSignupDto) {
  const newUser = await prisma.user.create({
    data: {
      fullName: request.fullName,
      email: normalizeEmail(request.email),
      document: normalize(request.document.value),
      phone: normalizePhone(request.phone),
      password: await hashInfo(request.passwords.password),
      role: "user",
      info: {
        create: {
          ...request.info,
          birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY").toISOString(),
        },
      },
    },
  });
  const loginToken = await createToken({ id: newUser.id });
  cookies().set("token", loginToken);
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

export async function login(request: LoginDto) {
  const potentialUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizeEmail(request.identifier) },
        { document: normalize(request.identifier) },
        { phone: normalizePhone(request.identifier) },
      ],
    },
  });

  if (!potentialUser) throw `Informações de login incorretas!`;
  if (!potentialUser.password) throw `Usuário não possui uma conta configurada`;

  if (!(await compareHash(request.password, potentialUser.password)))
    throw `Dados de login ou senha incorretos.`;

  return createToken({ id: potentialUser.id });
}
