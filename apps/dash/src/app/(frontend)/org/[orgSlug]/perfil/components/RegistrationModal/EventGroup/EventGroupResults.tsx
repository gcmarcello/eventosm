import { Event, EventResult } from "@prisma/client";
import clsx from "clsx";
import { Heading, LoadingSpinner } from "odinkit";
import EventGroupUserResultList from "./EventGroupUserResultList";
import { useAction } from "odinkit/client";
import { readUserEventGroupResults } from "@/app/api/results/action";
import { useEffect } from "react";

export function EventGroupResults({ eventGroupId }: { eventGroupId: string }) {
  const {
    data: eventGroupResultsData,
    trigger: eventGroupResultsTrigger,
    isMutating: eventGroupResultsMutating,
  } = useAction({
    action: readUserEventGroupResults,
  });

  useEffect(() => {
    eventGroupResultsTrigger({ eventGroupId });
  }, []);

  function handlePositionCircleColor(position: number) {
    switch (position) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-500";
      case 3:
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  }

  if (eventGroupResultsMutating)
    return (
      <div className="mt-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );

  return !eventGroupResultsData?.position ||
    !eventGroupResultsData?.results.length ? null : (
    <div className="flex flex-col items-center justify-center space-y-2 py-4 lg:flex-row lg:divide-x">
      <div className="pe-2">
        <div className="text-center">
          <Heading>Posição Geral</Heading>
        </div>
        <div
          className={clsx(
            "mt-2 flex size-32 items-center justify-center rounded-full",
            handlePositionCircleColor(eventGroupResultsData?.position || 4)
          )}
        >
          <div className="flex size-28 items-center justify-center rounded-full bg-white text-4xl font-semibold text-gray-800">
            {eventGroupResultsData?.position}
          </div>
        </div>
      </div>
      <div className="ps-2">
        <Heading>Etapas</Heading>
        <EventGroupUserResultList results={eventGroupResultsData.results} />
      </div>
    </div>
  );
}
