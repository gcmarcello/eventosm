import { createToken } from "@/app/api/auth/service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "prisma/prisma";

export default async function confirmUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });

  if (!user) {
    return redirect("/login?alert=errorConfirm");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { confirmed: true },
  });

  redirect("/login?alert=successConfirm&email=" + user.email);
}
