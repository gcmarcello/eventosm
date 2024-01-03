import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "prisma/prisma";

export async function GET(request: Request, response: NextResponse) {
  try {
    const token = headers().get("Authorization");

    if (!token) throw "Token não encontrado.";

    const user = await prisma.user.findFirst({ where: { id: token } });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 403 }, { status: 403 });
  }
}
