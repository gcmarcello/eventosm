import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateOrganizationDto, ReadOrganizationDto } from "./dto";
import { prisma } from "prisma/prisma";

export async function createOrganization(
  request: CreateOrganizationDto & { userSession: UserSession }
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

export async function readOrganizations(request: ReadOrganizationDto) {
  return await prisma.organization.findMany({
    where: request.where,
  });
}
