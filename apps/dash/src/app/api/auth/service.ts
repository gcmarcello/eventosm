import { compareHash, hashInfo } from "@/utils/bCrypt";
import { LoginDto, SignupDto } from "./dto";
import { getServerEnv, isDev } from "@/app/api/env";
import * as jose from "jose";
import { prisma } from "prisma/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  cpfValidator,
  isEmail,
  normalize,
  normalizeEmail,
  normalizePhone,
  normalizeZipCode,
} from "odinkit";
import { cookies } from "next/headers";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { sendEmail } from "../emails/service";
import { chooseTextColor } from "@/utils/colors";
import { getClientEnv } from "@/app/(frontend)/env";
import { Organization } from "@prisma/client";
dayjs.extend(customParseFormat);

export async function signup(request: SignupDto) {
  const newUser = await prisma.user.create({
    data: {
      fullName: request.fullName,
      email: normalizeEmail(request.email),
      document: normalize(request.document as string),
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

  let organization;
  if (request.organizationId) {
    organization = await prisma.organization.findUnique({
      where: { id: request.organizationId },
      include: { OrgCustomDomain: true },
    });
    await prisma.userOrgLink.create({
      data: {
        userId: newUser.id,
        organizationId: request.organizationId,
      },
    });
  }

  const url = organization?.OrgCustomDomain[0]?.domain
    ? "https://" + organization?.OrgCustomDomain[0]?.domain
    : process.env.NEXT_PUBLIC_SITE_URL;

  await sendEmail([
    {
      template: "welcome_email",
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: `Bem vindo ${organization?.id ? `à ${organization.name}` : "ao Evento SM"}`,
        to: newUser.email,
      },
      templateParameters: {
        headerTextColor: chooseTextColor(
          organization?.options.colors.primaryColor.hex || "#4F46E5"
        ),
        mainColor: organization?.options.colors.primaryColor.hex || "#4F46E5",
        orgName: organization?.name || "EventoSM",
        name: newUser.fullName.split(" ")[0] as string,
        siteLink: `${url}/confirmar/${newUser.id}`,
      },
    },
  ]);
  return newUser;
}

export async function resendConfirmationEmail({
  userId,
  organization,
}: {
  userId: string;
  organization: Organization;
}) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const customDomain = await prisma.orgCustomDomain.findFirst({
    where: { organizationId: organization.id },
  });

  if (!organization) throw "Organização não encontrada.";
  if (!user) throw "Usuário não encontrado.";

  const url = customDomain
    ? "https://" + customDomain
    : process.env.NEXT_PUBLIC_SITE_URL;

  await sendEmail([
    {
      template: "welcome_email",
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: `Bem vindo ${organization?.id ? `à ${organization.name}` : "ao Evento SM"}`,
        to: user.email,
      },
      templateParameters: {
        headerTextColor: chooseTextColor(
          organization?.options.colors.primaryColor.hex || "#4F46E5"
        ),
        mainColor: organization?.options.colors.primaryColor.hex || "#4F46E5",
        orgName: organization?.name || "EventoSM",
        name: user.fullName.split(" ")[0] as string,
        siteLink: `${url}/confirmar/${user.id}`,
      },
    },
  ]);
  return user;
}

export async function linkUserToOrg(request: {
  user: UserSession;
  orgId: string;
}) {}

export function createToken(request: { id: string }) {
  const JWT_KEY = new TextEncoder().encode(getServerEnv("JWT_KEY"));
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
  const isIdentifierEmail = isEmail(request.identifier);

  const potentialUser = await prisma.user.findUnique({
    where: isIdentifierEmail
      ? { email: normalizeEmail(request.identifier) }
      : { document: normalize(request.identifier) },
    include: { UserOrgLink: { include: { Organization: true } } },
  });

  if (!potentialUser) throw `Informações de login incorretas!`;
  if (!potentialUser.password)
    throw `Usuário não possui uma conta configurada. Por favor, acesse a recuperação de senha.`;
  if (!potentialUser.confirmed)
    throw `Usuário não confirmado. Por favor confirme sua conta através do e-mail enviado.`;

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
