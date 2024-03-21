"use client";
import { usePanel } from "@/app/(frontend)/painel/_shared/components/PanelStore";
import { upsertEventDto } from "@/app/api/events/dto";
import { uploadFiles } from "@/app/api/uploads/action";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { Table, Badge, ExtractSuccessResponse, date, z } from "odinkit";
import {
  useAction,
  showToast,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  useForm,
  Form,
  Button,
} from "odinkit/client";
import { useEffect, useState } from "react";
import SubeventModal from "./components/SubeventModal";
import { readEventGroups, upsertEvent } from "@/app/api/events/action";
import Image from "next/image";
import { Event, EventGroup } from "@prisma/client";
import { OrganizationWithDomain } from "prisma/types/Organization";

export function EtapasForm({
  eventGroup,
  eventId,
  organization,
}: {
  eventGroup: EventGroup & { Event: Event[] };
  eventId?: string;
  organization: OrganizationWithDomain;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubevent, setSelectedSubevent] = useState<Event | undefined>();
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  function handleEditModalOpening(subevent?: Event) {
    setSelectedSubevent(subevent);
    setIsModalOpen(true);
  }

  useEffect(() => {
    if (selectedSubevent) {
      setIsModalOpen(true);
    }
  }, [selectedSubevent]);

  return (
    <>
      {selectedSubevent && (
        <SubeventModal
          modalState={{ isModalOpen, setIsModalOpen }}
          subevent={selectedSubevent}
          eventGroup={eventGroup}
          organization={organization}
        />
      )}
      <div className="flex justify-end">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => handleEditModalOpening()}
        >
          Nova Etapa
        </Button>
      </div>
      <Table
        data={eventGroup.Event}
        columns={(columnHelper) => [
          columnHelper.accessor("imageUrl", {
            id: "imageUrl",
            header: "",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              info.getValue() && (
                <Image
                  src={info.getValue()}
                  className="rounded-md"
                  alt="imagem da etapa"
                  height={64}
                  width={64}
                />
              ),
          }),
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("dateStart", {
            id: "dateStart",
            header: "Início",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => date(info.getValue(), "DD/MM/YYYY", true),
          }),
          columnHelper.accessor("location", {
            id: "location",
            header: "Local",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              ({
                draft: <Badge color="amber">Pendente</Badge>,
                published: <Badge color="green">Publicado</Badge>,
                review: <Badge color="blue">Revisão</Badge>,
              })[info.getValue() as "draft" | "published" | "review"],
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleEditModalOpening(info.row.original)}
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
