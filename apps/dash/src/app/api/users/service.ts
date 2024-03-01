import { UserWithInfo } from "prisma/types/User";
import { UpdateUserDto } from "./dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { TeamSignUpDto } from "../auth/dto";
import { readAddressFromZipCode } from "../geo/service";
import dayjs from "dayjs";
import { normalizeDocument, normalizeZipCode } from "odinkit";
import { Gender } from "@prisma/client";
import { info } from "console";

export async function readUser({
  userId,
}: {
  userId: string;
}): Promise<UserWithInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      document: true,
      email: true,
      id: true,
      info: true,
      infoId: true,
      phone: true,
      role: true,
      updatedAt: true,
      createdAt: true,
      confirmed: true,
    },
  });
  if (!user) throw "Usuário não encontrado";
  return user;
}

export async function readUserInfo({ id }: { id: string }) {
  const userInfo = await prisma.userInfo.findUnique({
    where: { id },
  });
  if (!userInfo) throw "Informações de usuário não encontradas.";
  return userInfo;
}

export async function updateUser({
  request,
}: {
  request: UpdateUserDto & { userSession: UserSession };
}) {
  const { userSession, info, ...data } = request;
  const user = await prisma.user.update({
    where: { id: userSession.id },
    data: {
      ...data,
      info: {
        update: info,
      },
    },
  });
  return user;
}

export async function createMultipleUsers(users: TeamSignUpDto[]) {
  const documents = users.map((member) => normalizeDocument(member.document));

  const existingUsers = await prisma.user.findMany({
    where: { document: { in: documents } },
    select: { id: true, document: true },
  });

  const existingDocuments = new Set(existingUsers.map((user) => user.document));

  const newDocuments = documents.filter(
    (document) => !existingDocuments.has(document)
  );

  const newUsersArrays = { user: [] as any[], userInfo: [] as any[] };

  for (const newDocument of newDocuments) {
    const userRecord = users.find((member) => member.document === newDocument);

    if (!userRecord) throw "User not found";

    const infoId = crypto.randomUUID();
    newUsersArrays.user.push({
      fullName: userRecord.fullName,
      email: userRecord.email,
      document: userRecord.document,
      phone: userRecord.phone,
      role: "user",
      infoId,
    });
    newUsersArrays.userInfo.push({
      id: infoId,
      birthDate: dayjs(userRecord.birthDate, "DD/MM/YYYY").toISOString(),
      zipCode: normalizeZipCode(userRecord.zipCode),
      gender: userRecord.gender,
      number: userRecord.number,
      complement: userRecord.complement,
    });
  }

  await prisma.userInfo.createMany({ data: newUsersArrays.userInfo });
  await prisma.user.createMany({ data: newUsersArrays.user });
  return await prisma.user.findMany({
    where: {
      document: {
        in: documents,
      },
    },
    select: { id: true, document: true, email: true, fullName: true },
  });
}
