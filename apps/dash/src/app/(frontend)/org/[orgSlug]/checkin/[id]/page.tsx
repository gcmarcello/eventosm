import { useState } from "react";
import ReaderContainer from "./components/ReaderContainer";
import clsx from "clsx";
import { redirect } from "next/dist/server/api-utils";
import { notFound } from "next/navigation";
import { isUUID } from "odinkit";
import { headers } from "next/headers";

export default async function CheckinPage({
  params,
}: {
  params: { id: string; orgSlug: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
    },
  });

  if (!isUUID(params.id)) return notFound();
  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!organization || !event) {
    return notFound();
  }

  return (
    <div className={clsx("bg-cover lg:h-[calc(100dvh-85px)]")}>
      <ReaderContainer
        event={event}
        organization={organization}
        deviceType={headers().get("deviceType") || ""}
      />
    </div>
  );
}
