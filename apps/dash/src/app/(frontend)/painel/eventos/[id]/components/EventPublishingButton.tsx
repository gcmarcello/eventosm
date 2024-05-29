"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  useAction,
  showToast,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from "odinkit/client";
import { EventGroupWithEvents } from "prisma/types/Events";
import { parseEventStatus } from "../../../_shared/utils/eventStatus";
import { Event } from "@prisma/client";
import { updateEventStatus } from "@/app/api/events/status/action";

export function EventPublishingButton({ event }: { event: Event }) {
  const { data: eventStatus, trigger: triggerEventStatus } = useAction({
    action: updateEventStatus,
    onSuccess: (res) => {
      showToast({
        message: res.message || "Sucesso",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  return (
    <Dropdown>
      <DropdownButton
        color={
          event.status === "draft"
            ? "amber"
            : event.status === "published"
              ? "green"
              : "white"
        }
      >
        {parseEventStatus(event.status)}
        <ChevronDownIcon className="size-4" />
      </DropdownButton>
      <DropdownMenu className="z-30">
        <DropdownItem
          onClick={() =>
            triggerEventStatus({
              eventId: event.id,
              status: event.status === "draft" ? "published" : "draft",
            })
          }
        >
          {event.status === "draft" ? "Publicar" : "Despublicar"}
        </DropdownItem>

        <DropdownDivider />
        <DropdownItem>
          <span className={"text-red-600"}>Cancelar</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
