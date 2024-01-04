import { UserSession } from "@/middleware/functions/userSession.middleware";
import { CreateOrganizationDto, ReadOrganizationDto } from "./dto";

export async function createOrganization(
  request: CreateOrganizationDto & { userSession: UserSession }
) {
  const organization = await prisma.organization.create({
    data: {
      email: request.email,
      name: request.name,
      slug: request.slug,
      phone: request.phone,
      document: request.document,
      domain: request?.domain,
      owner: { connect: { id: request.userSession.id } },
    },
  });
  return organization;
}

export async function readOrganizations(request: ReadOrganizationDto) {
  return await prisma.organization.findFirst({
    where: request.where,
  });
}
