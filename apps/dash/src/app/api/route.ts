/* import dayjs from "dayjs";
import _ from "lodash";
import { prisma } from "/workspaces/eventosm/apps/dash/prisma/prisma";
import { NextResponse } from "next/server";
import { users } from "./users";

export async function GET() {
  const registrations = await prisma.eventGroup
    .findFirst({
      where: {
        id: "0135c540-502d-4192-af32-3c98d02b73a4",
      },
      include: {
        EventRegistration: {
          where: {
            category: {
              gender: {
                not: "unisex",
              },
            },
            status: {
              not: "canceled",
            },
          },
          include: {
            EventCheckIn: true,
            category: true,
            user: {
              include: {
                info: true,
              },
            },
          },
        },
      },
    })
    .then((e) => e?.EventRegistration)
    .then((rs) =>
      rs?.map((r) => ({
        name: r.user.fullName,
        registrationId: r.id,
        cpf: r.user.document,
        code: r.code,
        userId: r.userId,
        userGender: r.user.info.gender,
        checkin: r.EventCheckIn.length > 0,
        category: r.category,
        age: dayjs().year() - dayjs(r.user.info.birthDate).year(),
        birthDate: r.user.info.birthDate,
      }))
    );

  if (!registrations) return null;

  let xlsxUsers = users;

  let notProcessed = [];
  for (const r of registrations) {
    const xUser = xlsxUsers.findIndex((u) => u.Document === r.cpf);

    if (xUser === -1) {
      notProcessed.push({
        xUser,
        r,
      });
      continue;
    }

    console.log(xUser, r);

    xlsxUsers[xUser]!.Categoria = r.category.name;
  }

  return NextResponse.json(xlsxUsers);
}
 */
