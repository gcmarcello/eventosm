"use client";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import Image from "next/image";
import { Badge, Link, date } from "odinkit";

import {
  EventGroupRegistration,
  EventGroupRegistrationWithInfo,
} from "prisma/types/Registrations";
import { useState } from "react";

export default function EventGroupRegistrationCard({
  registration,
  handleModalOpen,
}: {
  handleModalOpen: (registration: EventGroupRegistrationWithInfo) => void;
  registration: EventGroupRegistrationWithInfo;
}) {
  return (
    <div className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-start shadow-md duration-500 md:col-span-1 ">
      <div className="grid min-h-[100px] grow grid-cols-4">
        <div className="col-span-2">
          <div className="relative h-full w-full">
            <Image
              className="rounded-t"
              fill={true}
              src={registration.eventGroup?.imageUrl || ""}
              alt=""
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div className="col-span-2 flex  flex-col px-4">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {registration.eventGroup?.name}
          </h3>
          <dl className="mb-2 mt-1 flex flex-grow flex-col justify-end">
            <dt className="sr-only">Etapas</dt>
            <dd className="flex-grow text-xs text-gray-500">
              {registration.eventGroup?.Event?.length} etapa
              {registration.eventGroup?.Event?.length === 1 ? "" : "s"}
            </dd>
            <dt className="sr-only">Type</dt>
            <dd className="mt-3">
              <Badge color={"orange"}>
                {registration.eventGroup?.eventGroupType === "championship"
                  ? "Campeonato"
                  : "Série de Eventos"}
              </Badge>
            </dd>
          </dl>
        </div>
      </div>
      <div>
        <div className="-mt-px flex">
          <div
            onClick={() => handleModalOpen(registration)}
            className="relative -mr-px  inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg rounded-l-none border border-transparent py-4 text-sm font-semibold text-gray-900 duration-200 hover:bg-gray-100"
          >
            <InformationCircleIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Informações
          </div>
        </div>
      </div>
    </div>
  );
}
