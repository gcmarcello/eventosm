import { isEmail, maskEmail, normalize, normalizeEmail } from "odinkit";
import {
  CreateNewPasswordDto,
  ReadPasswordRecoveryTokenDto,
  UpsertPasswordRecoveryTokenDto,
} from "./dto";
import dayjs from "dayjs";
import {
  readRecoveryToken,
  updateRecoveryToken,
  upsertRecoveryToken,
} from "./repository";
import { getServerEnv, isProd } from "@/app/api/env";
import { updateUser } from "../../users/repository";
import { hashInfo } from "@/utils/bCrypt";
import { createToken } from "../service";
import { sendEmail } from "../../emails/service";
import { chooseTextColor } from "@/utils/colors";
import { getClientEnv } from "@/app/(frontend)/env";
import prisma from "prisma/prisma";

export async function generateRecoveryToken(
  data: UpsertPasswordRecoveryTokenDto
) {
  function findUserQuery() {
    switch (data.type) {
      case "email":
        return { email: normalizeEmail(data.identifier) };
      case "document":
        return { document: normalize(data.identifier) };
      default:
        throw "Tipo de identificador inválido.";
    }
  }

  const user = await prisma.user.findUnique({
    where: findUserQuery(),
  });

  if (!user) throw "Usuário não encontrado.";

  const recoveryToken = await upsertRecoveryToken({
    where: { userId: user.id },
    create: {
      token: crypto.randomUUID(),
      user: { connect: { id: user.id } },
    },
    update: {
      token: crypto.randomUUID(),
      Organization: data.organizationId
        ? { connect: { id: data.organizationId } }
        : { disconnect: true },
    },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: data.organizationId },
    include: { OrgCustomDomain: true },
  });

  const url =
    organization?.OrgCustomDomain[0]?.domain ||
    process.env.NEXT_PUBLIC_SITE_URL;

  await sendEmail([
    {
      template: "recover_pass",
      setup: {
        from: getServerEnv("SENDGRID_EMAIL"),
        subject: "Recuperação de senha",
        to: user.email,
      },
      templateParameters: {
        headerTextColor: chooseTextColor(
          organization?.options.colors.primaryColor.hex || "#4F46E5"
        ),
        mainColor: organization?.options.colors.primaryColor.hex || "#4F46E5",
        orgName: organization?.name || "EventoSM",
        name: user.fullName,
        recoveryLink: `${url}/recuperar/${recoveryToken.token}`,
      },
    },
  ]);

  return { recoveryToken, email: maskEmail(user.email) };
}

export async function validateRecoveryToken(
  data: ReadPasswordRecoveryTokenDto
) {
  const recoveryToken = await readRecoveryToken({
    where: { token: data.token },
  });

  if (!recoveryToken) throw "Token inválido.";

  if (
    dayjs(recoveryToken.updatedAt)
      .add(10, isProd ? "minutes" : "hours")
      .isBefore(dayjs())
  )
    throw "Token expirado.";

  return recoveryToken;
}

export async function createNewPassword(data: CreateNewPasswordDto) {
  const token = await validateRecoveryToken({ token: data.token });

  const user = await updateUser({
    data: { password: await hashInfo(data.password), confirmed: true },
    where: { id: token.userId },
  });

  await updateRecoveryToken({
    where: { id: token.id },
    data: { token: crypto.randomUUID() },
  });

  return createToken({ id: user.id });
}
