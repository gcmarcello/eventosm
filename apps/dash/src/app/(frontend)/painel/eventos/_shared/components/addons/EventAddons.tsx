"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { EventAddon } from "@prisma/client";
import { Table } from "odinkit";
import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "odinkit/client";
import { useState } from "react";
import { EventGroupWithEvents } from "prisma/types/Events";
import { formatPrice } from "@/app/(frontend)/org/[orgSlug]/inscricoes/utils/price";
import { usePanel } from "../../../../_shared/components/PanelStore";
import AddonModal from "./AddonModal";

export default function EventAddons({
  addons,
  eventGroup,
  eventId,
}: {
  addons: EventAddon[];
  eventGroup?: EventGroupWithEvents;
  eventId?: string;
}) {
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<EventAddon | null>(null);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  function handleAddonModal(addon: EventAddon | null) {
    setSelectedAddon(addon);
    setIsAddonModalOpen(true);
  }

  return (
    <>
      <AddonModal
        isOpen={isAddonModalOpen}
        setIsOpen={setIsAddonModalOpen}
        eventGroupId={eventGroup?.id}
        eventId={eventId}
        addon={selectedAddon}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => handleAddonModal(null)}
        >
          Novo Kit
        </Button>
      </div>
      <Table
        striped
        data={addons}
        columns={(columnHelper) => [
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("price", {
            id: "price",
            header: "Preço",

            cell: (info) => formatPrice(info.getValue()),
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: false,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-700" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      handleAddonModal(
                        addons.find((addon) => addon.id === info.getValue()) ||
                          null
                      );
                    }}
                  >
                    Editar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      />
    </>
  );
}
