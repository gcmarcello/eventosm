"use server";

import { Event } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import { Link, date } from "odinkit";
import clsx from "clsx";

export default async function EventResultCard({
  event,
  className,
}: {
  event?: Event;
  className?: string;
}) {
  if (!event) throw new Error("Event or EventGroup not found");
  return (
    <div
      className={clsx(
        "divide-y divide-gray-200 rounded-lg bg-white text-start shadow-md duration-500 lg:max-w-64 lg:hover:scale-105",
        className
      )}
    >
      <Link href={`/resultados/${event.id}`}>
        <img
          className="hidden h-auto w-full rounded-t lg:block"
          src={event.imageUrl || ""}
          alt=""
        />
        <div className="px-4">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {event.name}
          </h3>
          <dl className="mb-2 mt-1 flex flex-grow flex-col justify-end">
            <dd className="mb-2 flex-grow text-xs text-gray-500">
              {event.location} - {date(event.dateStart, "DD/MM/YYYY")}
            </dd>
          </dl>
        </div>
      </Link>
    </div>
  );
}
