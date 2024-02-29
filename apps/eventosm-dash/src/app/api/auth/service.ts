import { compareHash, hashInfo } from "@/utils/bCrypt";
import { LoginDto, SignupDto } from "./dto";
import { getEnv, isDev } from "@/utils/settings";
import * as jose from "jose";
import { prisma } from "prisma/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  normalize,
  normalizeEmail,
  normalizePhone,
  normalizeZipCode,
} from "odinkit";
import { cookies } from "next/headers";
import { UserSession } from "@/middleware/functions/userSession.middleware";
dayjs.extend(customParseFormat);

export async function signup(request: SignupDto) {
  const newUser = await prisma.user.create({
    data: {
      fullName: request.fullName,
      email: normalizeEmail(request.email),
      document: normalize(request.document),
      phone: normalizePhone(request.phone),
      password: await hashInfo(request.passwords.password),
      role: "user",
      info: {
        create: {
          ...request.info,
          birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY").toISOString(),
          zipCode: normalizeZipCode(request.info.zipCode),
        },
      },
    },
  });
  return newUser;
}

export async function linkUserToOrg(request: {
  user: UserSession;
  orgId: string;
}) {}

export function createToken(request: { id: string }) {
  const JWT_KEY = new TextEncoder().encode(getEnv("JWT_KEY"));
  if (!JWT_KEY)
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  const token = new jose.SignJWT({ id: request.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("eventosmapi")
    .setAudience("user")
    .setExpirationTime(isDev ? "10000d" : "1d")
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
    include: {
      UserOrgLink: { include: { Organization: { select: { name: true } } } },
    },
  });

  if (!potentialUser) throw `Informações de login incorretas!`;
  if (!potentialUser.password) throw `Usuário não possui uma conta configurada`;

  if (!(await compareHash(request.password, potentialUser.password)))
    throw `Dados de login ou senha incorretos.`;

  if (request.organizationId) {
    const isUserLinkedToOrg = await prisma.userOrgLink.findFirst({
      where: {
        organizationId: request.organizationId,
        userId: potentialUser.id,
      },
    });
    if (!isUserLinkedToOrg && !request.acceptTerms) {
      const { password, ...user } = potentialUser;
      throw user;
    }
    if (!isUserLinkedToOrg) {
      await prisma.userOrgLink.create({
        data: {
          userId: potentialUser.id,
          organizationId: request.organizationId,
        },
      });
    }
  }

  return createToken({ id: potentialUser.id });
}
