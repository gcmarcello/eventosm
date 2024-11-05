import EventModalities from "../../_shared/components/modalities/EventModalities";
import { readEvents } from "@/app/api/events/service";
import { notFound } from "next/navigation";
import { ModalityPageProvider } from "../../_shared/components/modalities/context/ModalityPageProvider";
import prisma from "prisma/prisma";

export default async function EventModalitiesPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { _count: { select: { EventRegistration: true } } },
  });

  if (!event) return notFound();

  const modalities = await prisma.eventModality.findMany({
    where: { event: { id: event.id } },
    include: {
      modalityCategory: {
        include: {
          _count: {
            select: { EventRegistration: { where: { status: "active" } } },
          },
        },
      },
      _count: {
        select: { EventRegistration: { where: { status: "active" } } },
      },
    },
  });

  return (
    <ModalityPageProvider event={event} modalities={modalities}>
      <EventModalities />
    </ModalityPageProvider>
  );
}
