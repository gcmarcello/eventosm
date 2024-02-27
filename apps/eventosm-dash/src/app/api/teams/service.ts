import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateTeamDto, ReadTeamsDto } from "./dto";

export async function readTeams(request: ReadTeamsDto) {
  const team = await prisma.team.findMany({
    where: request.where,
    include: {
      User: {
        select: {
          fullName: true,
          id: true,
          _count: { select: { EventRegistration: true } },
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

export async function createTeam(request: CreateTeamDto) {
  const team = await prisma.team.create({
    data: {
      name: request.name,
      ownerId: request.ownerId,
      User: {
        connect: [
          ...request.members.map((member) => ({ id: member })),
          { id: request.ownerId },
        ],
      },
    },
  });

  return team;
}
