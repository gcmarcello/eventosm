import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { notFound } from "next/navigation";
import { CategoriesTable } from "./components/CategoriesTable";
import prisma from "prisma/prisma";
import { CategoryPageProvider } from "../../../_shared/components/categories/context/CategoryPageProvider";

export default async function ModalityPage({
  params,
}: {
  params: { modalityId: string; id: string };
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);
  const modality = await prisma.eventModality.findUnique({
    where: { eventId: params.id, id: params.modalityId },
    include: { modalityCategory: { include: { CategoryDocument: true } } },
  });
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });
  if (!modality || !event) return notFound();

  return (
    <CategoryPageProvider modality={modality} event={event}>
      <CategoriesTable categories={modality.modalityCategory} />
    </CategoryPageProvider>
  );
}
