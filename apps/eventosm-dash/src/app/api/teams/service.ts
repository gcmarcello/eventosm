import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateTeamDto, ReadTeamsDto } from "./dto";

export async function readTeams(request: ReadTeamsDto) {
  const team = await prisma.team.findMany({
    where: request.where,
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
  request: CreateTeamDto & { userSession: UserSession }
) {
  const team = await prisma.team.create({
    data: {
      name: request.name,
      ownerId: request.userSession.id,
      User: {
        connect: [
          ...request.members.map((member) => ({ id: member })),
          { id: request.userSession.id },
        ],
      },
    },
  });

  return team;
}
