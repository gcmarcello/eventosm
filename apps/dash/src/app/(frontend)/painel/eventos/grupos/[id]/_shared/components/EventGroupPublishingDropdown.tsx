import { EventGroup, EventModality, EventStatus } from "@prisma/client";
import { Alertbox, For, Text } from "odinkit";
import {
  EventGroupWithEvents,
  EventGroupWithInfo,
  EventModalityWithCategories,
} from "prisma/types/Events";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { EventPublishingButton } from "./EventPublishingButton";
import {
  ButtonProps,
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSection,
  showToast,
  useAction,
} from "odinkit/client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useMemo } from "react";
import { updateEventGroupStatus } from "@/app/api/events/status/action";

type EventStatuses = keyof typeof EventStatus;

export default function EventGroupPublishingDropdown({
  eventGroup,
}: {
  eventGroup: EventGroupWithInfo;
}) {
  const buttonProps: {
    [key in EventStatuses]: {
      color: ButtonProps["color"];
      label: string;
      status: EventStatuses;
    };
  } = useMemo(
    () => ({
      published: {
        color: "green",
        label: "Publicado",
        status: "published",
      },
      draft: {
        color: "amber",
        label: "Rascunho",
        status: "draft",
      },
      archived: {
        color: "gray",
        label: "Arquivado",
        status: "archived",
      },
      cancelled: {
        color: "red",
        label: "Cancelado",
        status: "cancelled",
      },
      review: {
        color: "blue",
        label: "Em revisão",
        status: "review",
      },
      finished: {
        color: "white",
        label: "Finalizado",
        status: "finished",
      },
    }),
    []
  );

  const { trigger } = useAction({
    action: updateEventGroupStatus,
    onSuccess: () => {
      showToast({
        message: "Status atualizado com sucesso.",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        variant: "error",
      });
    },
  });

  return (
    <Dropdown>
      <DropdownButton color={buttonProps[eventGroup.status]?.color}>
        {buttonProps[eventGroup.status]?.label}
        <ChevronDownIcon className="size-5" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownSection>
          <DropdownItem disabled={true}>
            <DropdownLabel>
              {buttonProps[eventGroup.status]?.label}
            </DropdownLabel>
            <DropdownDescription>Esse é o atual status.</DropdownDescription>
          </DropdownItem>
        </DropdownSection>
        <DropdownDivider />
        <DropdownSection>
          <For
            each={Array.from(Object.entries(buttonProps)).filter(
              (entry) => entry[0] !== eventGroup.status
            )}
          >
            {(entry) => (
              <>
                <DropdownItem
                  onClick={() =>
                    trigger({
                      status: buttonProps[entry[1].status].status,
                      eventGroupId: eventGroup.id,
                    })
                  }
                >
                  <DropdownLabel>{entry[1].label}</DropdownLabel>
                </DropdownItem>
              </>
            )}
          </For>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
