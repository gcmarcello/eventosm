import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Table } from "odinkit";
import NewsTable from "./components/NewsTable";
import { Button } from "odinkit/client";
import { DashboardLayout } from "../_shared/components/DashboardLayout";

export default async function NewsPage() {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) redirect("/painel");
  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  if (!organization) redirect("/painel");

  const news = await prisma.news.findMany({
    where: { organizationId: organization.id },
  });

  return (
    <DashboardLayout>
      <div>
        <div className="mb-3 flex justify-end">
          <Button
            color={organization.options.colors.primaryColor.tw.color}
            href="/painel/noticias/nova"
          >
            Nova notícia
          </Button>
        </div>
        <NewsTable news={news} />
      </div>
    </DashboardLayout>
  );
}
