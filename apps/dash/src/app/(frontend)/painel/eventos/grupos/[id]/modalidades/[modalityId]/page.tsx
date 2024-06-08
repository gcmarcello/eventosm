import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { notFound } from "next/navigation";
import { CategoriesTable } from "./components/CategoriesTable";
import { CategoryPageProvider } from "../../../../_shared/components/categories/context/CategoryPageProvider";
import { prisma } from "prisma/prisma";

export default async function ModalityPage({
  params,
}: {
  params: { modalityId: string; id: string };
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);
  const modality = await prisma.eventModality.findUnique({
    where: { eventGroupId: params.id, id: params.modalityId },
    include: { modalityCategory: { include: { CategoryDocument: true } } },
  });
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
  });
  if (!modality || !eventGroup) return notFound();

  return (
    <CategoryPageProvider modality={modality} eventGroup={eventGroup}>
      <CategoriesTable categories={modality.modalityCategory} />
    </CategoryPageProvider>
  );
}
