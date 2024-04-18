import { cookies } from "next/headers";
import NewEventForm from "./components/NewEventForm";
import { prisma } from "prisma/prisma";
import { notFound } from "next/navigation";

export default async function NewEventPage() {
  const orgId = cookies().get("activeOrg")?.value;
  if (!orgId) return notFound();
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });
  if (!organization) return notFound();
  return <NewEventForm organization={organization} />;
}
