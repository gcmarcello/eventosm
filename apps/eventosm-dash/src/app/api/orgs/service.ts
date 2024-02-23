import { UserSession } from "@/middleware/functions/userSession.middleware";
import { UpsertOrganizationDto, ReadOrganizationDto } from "./dto";
import { prisma } from "prisma/prisma";
import { generateColorJson } from "../colors/service";
import { normalizePhone } from "odinkit";
import { Organization } from "@prisma/client";

export async function createOrganization(
  request: UpsertOrganizationDto & { userSession: UserSession }
) {
  const existingSlug = await prisma.organization.findFirst({
    where: { slug: request.slug },
  });
  if (existingSlug) {
    throw "Já existe uma organização com este link";
  }
  const id = crypto.randomUUID();

  const { primaryColor, secondaryColor, tertiaryColor } =
    await generateColorJson({
      colors: {
        primaryColor: request.primaryColor,
        secondaryColor: request.secondaryColor,
        tertiaryColor: request.tertiaryColor,
      },
    });

  if (!primaryColor || !secondaryColor || !tertiaryColor)
    throw "Cor não encontrada";

  const organization = await prisma.organization.create({
    data: {
      id,
      email: request.email,
      name: request.name,
      abbreviation: request.abbreviation,
      slug: request.slug || id,
      phone: request.phone,
      document: request?.document || null,
      domain: request?.domain,
      owner: { connect: { id: request.userSession.id } },
      options: {
        images: {
          bg: request?.images?.bg,
          hero: request?.images?.hero,
          logo: request?.images?.logo,
        },
        colors: {
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          tertiaryColor: tertiaryColor,
        },
      },
    },
  });
  return organization;
}

export async function updateOrganization(
  request: UpsertOrganizationDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  const { userSession, organization, ...data } = request;

  const currentOrg = await prisma.organization.findFirst({
    where: { id: request.organization.id },
    select: { options: true },
  });

  if (!currentOrg) throw "Organização não encontrada";

  const currentOptions = currentOrg?.options;

  const primaryColor =
    (await prisma.color.findFirst({
      where: { id: data.primaryColor },
    })) ?? undefined;

  const secondaryColor =
    (await prisma.color.findFirst({
      where: { id: data.secondaryColor },
    })) ?? undefined;

  const tertiaryColor =
    (await prisma.color.findFirst({
      where: { id: data.tertiaryColor },
    })) ?? undefined;

  const updatedOrganization = await prisma.organization.update({
    where: { id: organization.id },
    data: {
      email: data.email,
      name: data.name,
      slug: data.slug,
      abbreviation: data?.abbreviation,
      phone: normalizePhone(data.phone),
      document: data?.document || null,
      options: {
        images: {
          bg: data?.images?.bg,
          hero: data?.images?.hero,
          logo: data?.images?.logo,
        },
        colors: {
          primaryColor: primaryColor ?? currentOptions?.colors?.primaryColor!,
          secondaryColor:
            secondaryColor ?? currentOptions?.colors?.secondaryColor!,
          tertiaryColor:
            tertiaryColor ?? currentOptions?.colors?.tertiaryColor!,
        },
      },
    },
  });
  return updatedOrganization;
}

export async function readOrganizations(request: ReadOrganizationDto) {
  return await prisma.organization.findMany({
    where: request.where,
  });
}
