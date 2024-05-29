"use server";
import {
  ClipboardDocumentListIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { EventGroup } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import Image from "next/image";
import { For, date } from "odinkit";
import {
  EventGroupWithEvents,
  EventGroupWithInfo,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import { useEffect } from "react";
import { Badge, Link } from "odinkit/client";

export default async function EventCard({
  event,
  orgSlug,
}: {
  event?: EventWithRegistrationCount | EventGroupWithInfo;
  orgSlug: string;
}) {
  // @TODO REMOVE BATCH ID FROM TYPE
  if (!event) throw new Error("Event or EventGroup not found");

  const isEventGroup = "Event" in event;

  const availableBatch = event.EventRegistrationBatch?.find(
    (batch) =>
      dayjs().utc().isBetween(dayjs(batch.dateStart), dayjs(batch.dateEnd)) &&
      batch.maxRegistrations > batch._count?.EventRegistration &&
      !batch.protectedBatch
  );
  const futureBatches = event.EventRegistrationBatch?.find((batch) =>
    dayjs().utc().isBefore(dayjs(batch.dateStart))
  );

  return (
    <Link
      href={
        isEventGroup ? `campeonatos/${event.slug}` : `eventos/${event.slug}`
      }
    >
      <div className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-start shadow-md duration-500 md:col-span-1 ">
        <div className="">
          <div className="col-span-2">
            <div className="relative h-full w-full">
              <img
                className="hidden rounded-t md:block"
                src={event.imageUrl || ""}
                alt=""
              />
            </div>
          </div>
          <div className="col-span-3 flex  flex-col px-4">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {event.name}
            </h3>
            <dl className="mb-2 mt-1 flex flex-grow flex-col justify-end">
              {isEventGroup ? (
                <>
                  <dt className="sr-only">Etapas</dt>
                  <dd className="flex-grow text-xs text-gray-500">
                    {event.Event.length} etapas
                  </dd>
                </>
              ) : (
                <dd className="flex-grow text-xs text-gray-500">
                  {event.location} - {date(event.dateStart, "DD/MM/YYYY")}
                </dd>
              )}
              <dt className="sr-only">Type</dt>
              <dd className="mt-3">
                <Badge color={isEventGroup ? "orange" : "purple"}>
                  {isEventGroup
                    ? event.eventGroupType === "championship"
                      ? "Campeonato"
                      : "Série de Eventos"
                    : "Evento"}
                </Badge>
              </dd>
              <dt className="sr-only">Status</dt>
              <dd className="mt-3">
                {(availableBatch || futureBatches) && (
                  <Badge
                    color={
                      availableBatch ? "green" : futureBatches ? "amber" : "red"
                    }
                  >
                    {availableBatch
                      ? "Disponível"
                      : futureBatches
                        ? "Em Breve"
                        : "Indisponível"}
                  </Badge>
                )}
              </dd>
            </dl>
          </div>
        </div>
        <div>
          <div className="-mt-px flex  ">
            {availableBatch ? (
              <div className="relative -mr-px  inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-r-none rounded-bl-lg border border-transparent py-3 text-sm font-semibold text-gray-900 duration-200 hover:bg-gray-100">
                <ClipboardDocumentListIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Inscrições
              </div>
            ) : (
              <div className="relative -mr-px  inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg rounded-l-none border border-transparent py-3 text-sm font-semibold text-gray-900 duration-200 hover:bg-gray-100">
                <InformationCircleIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Informações
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
