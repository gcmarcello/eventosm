import { parseEventStatus } from "@/app/(frontend)/painel/_shared/utils/eventStatus";
import { readEventGroups, updateEventStatus } from "@/app/api/events/action";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ExtractSuccessResponse } from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  showToast,
  useAction,
} from "odinkit/client";

export function EventPublishing({
  eventGroup,
}: {
  eventGroup: ExtractSuccessResponse<typeof readEventGroups>[0];
}) {
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
        message: error,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  return (
    <Dropdown>
      <DropdownButton
        color={
          eventGroup.status === "draft"
            ? "amber"
            : eventGroup.status === "published"
              ? "green"
              : "white"
        }
      >
        {parseEventStatus(eventGroup.status)}
        <ChevronDownIcon className="size-4" />
      </DropdownButton>
      <DropdownMenu className="z-30">
        <DropdownItem
          onClick={() =>
            triggerEventStatus({
              groupId: eventGroup.id,
              status: eventGroup.status === "draft" ? "published" : "draft",
            })
          }
        >
          {eventGroup.status === "draft" ? "Publicar" : "Despublicar"}
        </DropdownItem>

        <DropdownSeparator />
        <DropdownItem>
          <span className={"text-red-600"}>Cancelar</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
