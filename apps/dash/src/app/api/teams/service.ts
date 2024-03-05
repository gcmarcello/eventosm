import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateTeamDto, ReadTeamsDto, UpsertTeamMemberDto } from "./dto";
import { formatPhone, hasDuplicates, normalize } from "odinkit";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
import { Email } from "email-templates";
import { getServerEnv } from "../env";
import { chooseTextColor } from "@/utils/colors";
import { sendEmail } from "../emails/service";
import { request } from "http";
import _ from "lodash";
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
  let existingUsersIds: { id: string; document: string; email: string }[] = [];
  let newUsers: UpsertTeamMemberDto[] = [];

  if (data.addMembers && data.members?.length) {
    const allDocuments = data.members.map((member) =>
      normalize(member.document)
    );

    const allEmails = data.members.map((member) => member.email);

    if (hasDuplicates(allDocuments)) throw "Documentos duplicados";
    if (hasDuplicates(allEmails)) throw "Emails duplicados";

    existingUsersIds = (
      await prisma.user.findMany({
        where: {
          document: {
            in: allDocuments,
          },
        },
      })
    ).map((user) => ({
      id: user.id,
      document: user.document,
      email: user.email,
    }));

    newUsers = data.members.filter(
      (member) =>
        !existingUsersIds
          .map((user) => user.document)
          .includes(normalize(member.document))
    );
  }
  if (!existingUsersIds.find((user) => user.email === data.userSession.email)) {
    existingUsersIds.push({
      id: data.userSession.id,
      document: data.userSession.document,
      email: data.userSession.email,
    });
  }

  const team = await prisma.team.create({
    data: {
      name: data.name,
      ownerId: data.userSession.id,
      originalOrganizationId: data.originOrganizationId,
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
    include: {
      originalOrganization: { include: { OrgCustomDomain: true } },
      User: true,
    },
  });

  if (data.originOrganizationId) {
    await prisma.$transaction(
      team.User.map((user) =>
        prisma.userOrgLink.upsert({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: data.originOrganizationId!,
            },
          },
          update: {},
          create: {
            userId: user.id,
            organizationId: data.originOrganizationId!,
          },
        })
      )
    );
  }

  const existingUsersEmailArray: Email<"added_to_team">[] =
    existingUsersIds.map((user) => ({
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: user.email,
      },
      template: "added_to_team",
      templateParameters: {
        mainColor: "#000",
        headerTextColor: "#fff",
        name: user.email,
        siteLink:
          (team.originalOrganization?.OrgCustomDomain[0]?.domain ||
            process.env.NEXT_PUBLIC_SITE_URL) + "/perfil/times",
        teamName: team.name,
        orgName: team.originalOrganization?.name || "Time",
        ownerName: data.userSession.fullName,
        ownerPhone: formatPhone(data.userSession.phone),
      },
    }));

  const newUsersEmailArray: Email<"added_to_team_signup">[] = newUsers.map(
    (user) => ({
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: user.email,
      },
      template: "added_to_team_signup",
      templateParameters: {
        mainColor:
          team.originalOrganization?.options.colors.primaryColor.hex ||
          "#4F46E5",
        headerTextColor: chooseTextColor(
          team.originalOrganization?.options.colors.primaryColor.hex ||
            "#4F46E5"
        ),
        name: user.email,
        siteLink:
          (team.originalOrganization?.OrgCustomDomain[0]?.domain ||
            process.env.NEXT_PUBLIC_SITE_URL) + "/perfil/times",
        teamName: team.name,
        orgName: team.originalOrganization?.name || "Time",
        ownerName: data.userSession.fullName,
        ownerPhone: formatPhone(data.userSession.phone),
      },
    })
  );

  await sendEmail([...existingUsersEmailArray, ...newUsersEmailArray]);

  return team;
}
