import { UserSession } from "@/middleware/functions/userSession.middleware";
import { UpsertOrganizationDto, ReadOrganizationDto } from "./dto";
import { prisma } from "prisma/prisma";
import { OrganizationWithOptions } from "prisma/types/Organization";

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
  const organization = await prisma.organization.create({
    data: {
      id,
      email: request.email,
      name: request.name,
      slug: request.slug || id,
      phone: request.phone,
      document: request?.document || null,
      domain: request?.domain,
      owner: { connect: { id: request.userSession.id } },
    },
  });
  return organization;
}

export async function updateOrganization(
  request: UpsertOrganizationDto & { userSession: UserSession } & {
    organizationId: string;
  }
) {
  const { organizationId, userSession, ...data } = request;
  const organization = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      email: data.email,
      name: data.name,
      slug: data.slug,
      phone: data.phone,
      document: data?.document || null,
      options: {
        images: {
          bg: data?.images?.bg,
          hero: data?.images?.hero,
          logo: data?.images?.logo,
        },
        colors: {
          primaryColor: data?.primaryColor,
          secondaryColor: data?.secondaryColor,
        },
        abbreviation: data?.abbreviation,
      },
    },
  });
  return organization;
}

export async function readOrganizations(request: ReadOrganizationDto) {
  return (await prisma.organization.findMany({
    where: request.where,
  })) as OrganizationWithOptions[];
}
