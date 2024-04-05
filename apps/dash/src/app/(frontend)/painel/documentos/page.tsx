import { cookies } from "next/headers";
import DocumentsTable from "./components/DocumentsTable";
import { notFound } from "next/navigation";
import OrgDocumentModal from "./components/OrgDocumentModal";

export default async function DocumentsPage() {
  const organizationId = cookies().get("activeOrg")?.value;
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });
  if (!organizationId || !organization) return notFound();

  const documents = await prisma.organizationDocument.findMany({
    where: { organizationId },
  });

  return (
    <>
      <DocumentsTable documents={documents} organization={organization} />
    </>
  );
}
