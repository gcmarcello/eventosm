import { Organization } from "@prisma/client";
import { UpsertNewsDto } from "./dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";

export async function upsertNews(
  data: UpsertNewsDto & { organization: Organization; userSession: UserSession }
) {
  const { organization, userSession, ...newsData } = data;

  const existentSlug = await prisma.news.findUnique({
    where: {
      slug_organizationId: {
        slug: data.slug,
        organizationId: data.organization.id,
      },
    },
  });

  if (existentSlug && existentSlug.id !== data.id) {
    throw "Já existe uma notícia com esse link";
  }

  const id = data.id || crypto.randomUUID();

  return await prisma.news.upsert({
    where: { id },
    create: {
      ...newsData,
      Organization: { connect: { id: data.organization.id } },
    },
    update: newsData,
  });
}
