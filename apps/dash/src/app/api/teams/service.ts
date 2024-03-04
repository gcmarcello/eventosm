import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateTeamDto, ReadTeamsDto, UpsertTeamMemberDto } from "./dto";
import { normalize } from "odinkit";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(parseCustomFormat);

export async function readTeams(request: ReadTeamsDto) {
  const team = await prisma.team.findMany({
    where: request.where,
    include: {
      User: {
        include: {
          info: true,
        },
      },
    },
  });

  if (!team) throw "Time não encontrado!";

  return team;
}

export async function readTeamWithUsers({ teamId }: { teamId: string }) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      User: { include: { info: true } },
    },
  });

  if (!team) throw "Time não encontrado!";

  return team;
}

export async function readTeamSize({ teamId }: { teamId: string }) {
  const teamSize = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      _count: {
        select: { User: true },
      },
    },
  });

  if (!teamSize) {
    throw "Time não encontrado!";
  }

  return teamSize._count.User;
}

export async function createTeam(
  data: CreateTeamDto & { userSession: UserSession }
) {
  let existingUsersIds: { id: string; document: string }[] = [];
  let newUsers: UpsertTeamMemberDto[] = [];

  if (data.addMembers && data.members?.length) {
    const allDocuments = data.members.map((member) =>
      normalize(member.document)
    );

    existingUsersIds = (
      await prisma.user.findMany({
        where: {
          document: {
            in: allDocuments,
          },
        },
      })
    ).map((user) => ({ id: user.id, document: user.document }));

    existingUsersIds.push({
      id: data.userSession.id,
      document: data.userSession.document,
    });

    newUsers = data.members.filter(
      (member) =>
        !existingUsersIds
          .map((user) => user.document)
          .includes(normalize(member.document))
    );
  }

  const team = await prisma.team.create({
    data: {
      name: data.name,
      ownerId: data.userSession.id,
      User: {
        connect: existingUsersIds.map((user) => ({ id: user.id })),
        create: newUsers.map((user) => ({
          ...user,
          document: normalize(user.document),
          phone: normalize(user.phone),
          role: "user",
          info: {
            create: {
              ...user.info,
              birthDate: dayjs(user.info.birthDate, "DD/MM/YYYY").toISOString(),
            },
          },
        })),
      },
    },
  });

  return team;
}
