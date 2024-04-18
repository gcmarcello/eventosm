import { UserSession } from "@/middleware/functions/userSession.middleware";
import {
  UpsertOrganizationDto,
  ReadOrganizationDto,
  UpdateOrganizationStyleDto,
  UpsertOrganizationDocumentDto,
} from "./dto";
import { prisma } from "prisma/prisma";
import { generateColorJson } from "../colors/service";
import { normalizePhone } from "odinkit";
import { Organization, OrganizationDocumentStatus } from "@prisma/client";
import { getPreSignedURL } from "../uploads/service";

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
        primaryColor: "indigo_600",
        secondaryColor: "slate_200",
        tertiaryColor: "zinc_700",
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
      owner: { connect: { id: request.userSession.id } },
      options: {
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
}

export async function updateOrganizationStyle(
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
}

export async function readOrganizations(request: ReadOrganizationDto) {
  return await prisma.organization.findMany({
    where: request.where,
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

export async function upsertOrganizationDocument(
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
}

export async function readOrganizationDocument(data: { id: string }) {
  const document = await prisma.organizationDocument.findUnique({
    where: { id: data.id },
  });

  if (!document) throw "Documento não encontrado.";

  return await getPreSignedURL({ key: `orgdocuments/${document.key}` });
}
