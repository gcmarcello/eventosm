import { cookies } from "next/headers";
import { NewsForm } from "../components/NewsForm";
import { redirect } from "next/navigation";
import prisma from "prisma/prisma";

export default async function UpsertNewsPage({
  params,
}: {
  params: { id: string };
}) {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) redirect("/painel");

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
    include: { OrgCustomDomain: true },
  });
  if (!organization) redirect("/painel");

  const news = await prisma.news.findUnique({
    where: { organizationId: organization.id, id: params.id },
  });

  if (!news) redirect("/painel/noticias");

  return <NewsForm news={news} organization={organization} />;
}
