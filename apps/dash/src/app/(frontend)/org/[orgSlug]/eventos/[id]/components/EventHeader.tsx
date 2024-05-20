import { Event } from "@prisma/client";
import { Badge } from "odinkit";
import { useContext } from "react";
import { EventPageContext } from "../context/EventPage.ctx";

export function EventHeader() {
  const { event } = useContext(EventPageContext);
  return (
    <div className=" flex w-full items-center justify-between gap-2 text-base font-semibold text-gray-800 lg:w-auto lg:text-2xl">
      <>{event.name} </>
      <Badge color="purple" className="my-auto">
        Evento
      </Badge>
    </div>
  );
}
