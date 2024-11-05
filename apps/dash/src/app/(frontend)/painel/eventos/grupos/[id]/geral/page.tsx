import { readEventGroups } from "@/app/api/events/service";
import GeralForm from "./form";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { redirect } from "next/navigation";
import prisma from "prisma/prisma";

export default async function GeralPage({
  params,
}: {
  params: { id: string };
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  return (
    <GeralForm
      eventGroup={eventGroup}
      color={request.organization.options.colors.primaryColor}
    />
  );
}
