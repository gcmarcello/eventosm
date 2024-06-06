import { cookies } from "next/headers";
import NewEventForm from "./components/NewEventForm";
import { prisma } from "prisma/prisma";
import { notFound } from "next/navigation";
import { DashboardLayout } from "../../_shared/components/DashboardLayout";
import { PageHeading } from "../../_shared/components/PageHeading";
import { Heading } from "odinkit";

export default async function NewEventPage() {
  const orgId = cookies().get("activeOrg")?.value;
  if (!orgId) return notFound();
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });
  if (!organization) return notFound();
  return (
    <DashboardLayout>
      <PageHeading>
        <Heading>Novo Evento</Heading>
      </PageHeading>
      <NewEventForm organization={organization} />
    </DashboardLayout>
  );
}
