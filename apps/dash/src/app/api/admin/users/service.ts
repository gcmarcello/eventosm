import prisma from "prisma/prisma";
import { UpdateUserDto } from "../../users/dto";
import { AdminUpdateUserDto } from "./dto";

export async function updateUser(data: AdminUpdateUserDto) {
  const { info, userId, ...userData } = data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      info: {
        update: info,
      },
    },
  });
  return user;
}
