import { UserSession } from "@/middleware/functions/userSession.middleware";
import { UpsertEventModalityCategoriesDto } from "../events/dto";
import { TeamWithUsers } from "prisma/types/Teams";
import { CategoryBatch, ModalityCategory, Organization } from "@prisma/client";
import { readTeamSize } from "../teams/service";
import dayjs from "dayjs";
import { readUser } from "../users/service";
import { ReadEventCategoryModalitiesDto } from "./dto";

export async function readModalityCategories(
  request: ReadEventCategoryModalitiesDto
) {
  return await prisma.modalityCategory.findMany({
    where: request.where,
  });
}

export async function upsertEventModalityCategories(
  request: UpsertEventModalityCategoriesDto & { organization: Organization }
) {
  const { organization, ...rest } = request;

  if (request.categories.some((category) => !category.eventModalityId))
    throw "Nenhuma categoria informada";

  const modality = await prisma.eventModality.findFirst({
    where: { id: request.categories[0]?.eventModalityId },
    include: { event: true, eventGroup: true },
  });

  if (
    modality?.event?.organizationId !== request.organization.id &&
    modality?.eventGroup?.organizationId !== request.organization.id
  )
    throw "Modalidade de evento não encontrado nessa organização.";

  for (const category of request.categories) {
    category.id = category.id ?? crypto.randomUUID();
  }

  const newModalityCategories = await prisma.$transaction(
    rest.categories.map((category) => {
      category.id = category.id ?? crypto.randomUUID();

      return prisma.modalityCategory.upsert({
        where: { id: category.id },
        update: {
          ...category,
          id: category.id,
        },
        create: {
          ...category,
          id: category.id,
        },
      });
    })
  );

  return { categories: newModalityCategories, eventId: modality.eventId };
}

export async function verifyCategoryEligibility({
  category,
  userId,
  team,
  eventId,
  eventGroupId,
}: {
  category: ModalityCategory;
  userId: string;
  team?: TeamWithUsers | null;
  eventId?: string;
  eventGroupId?: string;
}) {
  if (!category) throw "Categoria não encontrada";

  if (eventId && eventGroupId)
    throw "Evento e grupo de evento não podem ser informados ao mesmo tempo";
  if (!eventId && !eventGroupId)
    throw "Evento ou grupo de evento não informado";

  const teamSize = team ? await readTeamSize({ teamId: team.id }) : 1;

  if (category.teamSize && teamSize > category.teamSize)
    throw `Categoria só permite times com até ${category.teamSize} pessoa${
      category.teamSize > 1 ? "s." : "."
    }`;

  const user = await readUser({ userId });

  const participants = team ? team.User : [user];

  for (const member of participants) {
    const memberRegistrations = await prisma.eventRegistration.findFirst({
      where: eventId
        ? { userId: member.id, eventId, status: { not: "cancelled" } }
        : { userId: member.id, eventGroupId, status: { not: "cancelled" } },
    });

    if (memberRegistrations)
      throw `${member.fullName} já está inscrito neste evento.`;

    const memberAge = dayjs().diff(dayjs(member.info.birthDate), "year");

    if (memberAge < category.minAge)
      throw `${member.fullName} não tem a idade mínima para esta categoria`;

    if (memberAge > category.maxAge)
      throw `${member.fullName} é mais velho do que a idade máxima para esta categoria`;

    if (
      category.gender &&
      category.gender !== member.info.gender &&
      category.gender !== "unisex"
    )
      throw `${member.fullName} não tem o gênero permitido para esta categoria`;
  }
}
