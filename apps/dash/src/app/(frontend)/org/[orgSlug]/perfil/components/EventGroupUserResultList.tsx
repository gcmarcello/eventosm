import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Event, EventResult } from "@prisma/client";
import { For } from "odinkit";
import { millisecondsToTime } from "@/utils/results";
import { Date } from "odinkit/client";

export default function EventGroupUserResultList({
  results,
}: {
  results: (EventResult & { Event: Event })[];
}) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      <For each={results}>
        {(result) => (
          <li className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={result.Event.imageUrl ?? ""}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {result.Event.name}
                </p>
                <p className="text-sm leading-6 text-gray-900">
                  {result.score
                    ? millisecondsToTime(result.score)
                    : "Sem resultado"}
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  <Date date={result.Event.dateStart} format="DD/MM/YYYY" />
                </p>
              </div>
            </div>
            {/* <div className="flex shrink-0 items-center gap-x-6">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{result.role}</p>
                {result.lastSeen ? (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last seen{" "}
                    <time dateTime={result.lastSeenDateTime}>
                      {result.lastSeen}
                    </time>
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
                )}
              </div>
            </div> */}
          </li>
        )}
      </For>
    </ul>
  );
}
