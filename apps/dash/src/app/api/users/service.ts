import { UserWithInfo } from "prisma/types/User";
import { CreateUserDocumentDto, UpdateUserDto } from "./dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { TeamSignUpDto } from "../auth/dto";
import { readAddressFromZipCode } from "../geo/service";
import dayjs from "dayjs";
import { normalizeDocument, normalizeZipCode } from "odinkit";
import { Gender } from "@prisma/client";
import { info } from "console";
import { get } from "lodash";
import { deletePrivateFile, getPreSignedURL } from "../uploads/service";
import { orgSeed } from "prisma/seed/org.seed";

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
  const existingEmail = await prisma.user.findFirst({
    where: { email: data.email, id: { not: userSession.id } },
  });
  if (existingEmail) throw "Email já cadastrado.";
  const existingDocument = await prisma.user.findFirst({
    where: { document: data.document, id: { not: userSession.id } },
  });
  if (existingDocument) throw "Documento já cadastrado.";
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
      address: userRecord.address,
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

export async function createUserDocument(
  data: CreateUserDocumentDto & { userSession: UserSession }
) {
  const { userSession, ...documentData } = data;

  return await prisma.userDocument.create({
    data: {
      ...documentData,
      userId: userSession.id,
    },
  });
}

export async function getUserDocument(data: {
  id: string;
  userSession: UserSession;
}) {
  const document = await prisma.userDocument.findUnique({
    where:
      data.userSession.role === "admin"
        ? { id: data.id }
        : { id: data.id, userId: data.userSession.id },
  });

  if (!document) throw "Documento não encontrado.";

  return await getPreSignedURL({ key: `documents/${document.key}` });
}

export async function deleteUserDocument(data: {
  id: string;
  userSession: UserSession;
}) {
  const document = await prisma.userDocument.findUnique({
    where: { id: data.id, userId: data.userSession.id },
  });

  if (!document) throw "Documento não encontrado.";

  await deletePrivateFile(`documents/${document.key}`);

  return await prisma.userDocument.delete({ where: { id: data.id } });
}
