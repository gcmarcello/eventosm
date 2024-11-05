import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import DocumentModal from "./components/DocumentModal";
import { For, Table } from "odinkit";
import { DocumentLink } from "./components/DocumentLink";
import { DocumentsTable } from "./components/DocumentsTable";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";
import { readOrganizations } from "@/app/api/orgs/service";
import { notFound } from "next/navigation";
import prisma from "prisma/prisma";

export default async function DocumentsPage(params: { orgSlug: string }) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);

  const userDocuments = await prisma.userDocument.findMany({
    where: { userId: userSession.id },
  });

  const organization = (
    await readOrganizations({ where: { slug: params.orgSlug } })
  )[0];

  if (!organization) notFound();

  return (
    <>
      <OrgPageContainer footer={false} organization={organization}>
        <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Meus Documentos
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 lg:mb-4">
              Aqui você pode ver e gerenciar seus atestados, documentos e laudos
              médicos.
            </p>
          </div>
          <div>
            <DocumentModal />
          </div>
        </div>
        <DocumentsTable userDocuments={userDocuments} />
      </OrgPageContainer>
    </>
  );
}
