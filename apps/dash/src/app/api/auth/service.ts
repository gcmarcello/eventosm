import { compareHash, hashInfo } from "@/utils/bCrypt";
import { LoginDto, SignupDto } from "./dto";
import { getServerEnv, isDev } from "@/app/api/env";
import * as jose from "jose";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  isEmail,
  normalize,
  normalizeEmail,
  normalizePhone,
  normalizeZipCode,
} from "odinkit";
import { cookies } from "next/headers";
import { sendEmail } from "../emails/service";
import { chooseTextColor } from "@/utils/colors";
import path from "path";

dayjs.extend(customParseFormat);

export async function signup(request: SignupDto, bypassEmail = false) {
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
  if (!bypassEmail) {
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
  }
  return newUser;
}

/* export async function resendConfirmationEmail({
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
} */

/* export async function readUserFromDocument(data: {
  document: string;
  organizationId: string;
}) {
  const user = await prisma.user.findUnique({
    where: { document: normalizeDocument(data.document) },
    include: { UserOrgLink: true },
  });

  if (!user) return { existent: false };

  const organizationsArray = user?.UserOrgLink.map((org) => org.organizationId);

  const loginOrg = organizationsArray?.includes(data.organizationId);

  return { existent: !!user, type: loginOrg ? "sameorg" : "differentOrg" };
} */

export async function login(data: LoginDto) {
  const res = await fetch(path.join(process.env.QUEUE_URL!, `/auth/login`), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const parsedData = await res.json();
  if (!res.ok) throw parsedData;
  cookies().set("token", parsedData.token);
  return parsedData;
}

export async function updateActiveOrganization(id: string) {
  const Authorization = cookies().get("token")?.value;
  if (!Authorization) throw "Usuário não autenticado.";
  const res = await fetch(
    path.join(process.env.QUEUE_URL!, `/auth/active-organization/${id}`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization,
      },
    }
  );
  const parsedData = await res.json();
  if (!res.ok) throw parsedData;
  cookies().set("token", parsedData.token);
  return await parsedData;
}

export async function createToken(request: { id: string }) {
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
