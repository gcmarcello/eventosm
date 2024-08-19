import {
  UpdateOrganizationDto,
  ReadOrganizationDto,
  CreateOrganizationDto,
  Organization,
} from "shared-types";
import { getPreSignedURL } from "../uploads/service";
import { API } from "../_shared/utils/api.service";
import { cookies } from "next/headers";

export async function readUserOrganizations() {
  try {
    const organizations = await API.get<Organization[]>("/organization/user");
    return organizations;
  } catch (error) {
    console.log(error);
  }
}

export async function createOrganization(request: UpdateOrganizationDto) {}

/* export async function updateOrganization(
  request: UpdateOrganizationDto & {
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

  const updatedOrganization = await prisma.organization.update({
    where: { id: organization.id },
    data: {
      email: normalizeEmail(data.email),
      name: data.name,
      slug: data.slug,
      abbreviation: data?.abbreviation.toUpperCase(),
      phone: normalizePhone(data.phone),
      document: data?.document ? normalizeDocument(data.document) : null,
      options: {
        socialMedia: {
          facebook: data?.options?.socialMedia?.facebook || null,
          instagram: data?.options?.socialMedia?.instagram || null,
          twitter: data?.options?.socialMedia?.twitter || null,
          youtube: data?.options?.socialMedia?.youtube || null,
        },
        colors: {
          primaryColor:
            currentOrg?.options?.colors?.primaryColor || "indigo_600",
          secondaryColor:
            currentOrg?.options?.colors?.secondaryColor || "slate_200",
          tertiaryColor:
            currentOrg?.options?.colors?.tertiaryColor || "zinc_700",
        },
        images: {
          bg: currentOrg?.options?.images?.bg,
          hero: currentOrg?.options?.images?.hero,
          logo: currentOrg?.options?.images?.logo,
        },
      },
    },
  });
  return updatedOrganization;
} */

/* export async function updateOrganizationStyle(
  request: UpdateOrganizationStyleDto & {
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
} */

export async function readOrganizations(request: ReadOrganizationDto) {
  return await prisma.organization.findMany({
    where: request,
    include: { OrgCustomDomain: true },
  });
}

export async function readConnectedOrganizations({
  userId,
}: {
  userId: string;
}) {
  return await prisma.organization.findMany({
    where: {
      UserOrgLink: {
        some: {
          userId,
        },
      },
    },
  });
}

/* export async function upsertOrganizationDocument(
  data: UpsertOrganizationDocumentDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  const { userSession, organization, ...documentData } = data;
  const id = documentData.id || crypto.randomUUID();
  const document = await prisma.organizationDocument.upsert({
    where: { id },
    create: {
      ...documentData,
      organizationId: organization.id,
    },
    update: {
      ...documentData,
    },
  });

  return document;
} */

export async function readOrganizationDocument(data: { id: string }) {
  const document = await prisma.organizationDocument.findUnique({
    where: { id: data.id },
  });

  if (!document) throw "Documento não encontrado.";

  return await getPreSignedURL({ key: `orgdocuments/${document.key}` });
}
