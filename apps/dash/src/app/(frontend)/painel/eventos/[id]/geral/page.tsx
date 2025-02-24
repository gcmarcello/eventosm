import { Event } from "@prisma/client";
import EventGeneralInfo from "../components/EventGeneralInfo";
import { EventWithRegistrationCount } from "prisma/types/Events";
import { notFound } from "next/navigation";
import prisma from "prisma/prisma";

export default async function UpdateEventPage({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { EventRegistration: true } },
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
    },
  });
  if (!event) return notFound();
  const modalities = await prisma.eventModality.findMany({
    where: { eventId: event.id },
    include: {modalityCategory: true}
  })
  return <EventGeneralInfo event={event} modalities={modalities} />;
}
