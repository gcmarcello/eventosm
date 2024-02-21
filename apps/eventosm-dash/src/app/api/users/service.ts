import { UserWithInfo } from "prisma/types/User";

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
