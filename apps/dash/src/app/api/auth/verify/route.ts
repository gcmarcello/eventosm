import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "prisma/prisma";

export async function GET(request: Request, response: NextResponse) {
  try {
    const token = headers().get("Authorization");

    if (!token) throw "Token não encontrado.";

    const user = await prisma.user.findUnique({
      where: { id: token },
      select: { id: true, role: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: error, status: 403 }, { status: 403 });
  }
}
