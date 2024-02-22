import { Badge, Table, date } from "odinkit";
import { EventGroupWithEvents } from "prisma/types/Events";
import SubeventModal from "./NewSubeventModal";
import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Form,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { upsertEventDto } from "@/app/api/events/dto";
import { upsertEvent } from "@/app/api/events/action";
import { usePanel } from "@/app/(frontend)/painel/_shared/components/PanelStore";
import dayjs from "dayjs";
import { Cog6ToothIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { z } from "zod";
import { uploadFiles } from "@/app/api/uploads/action";
import Image from "next/image";

export default function SubeventsPage({
  eventGroup,
  eventId,
}: {
  eventGroup: EventGroupWithEvents;
  eventId?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  const form = useForm({
    schema: upsertEventDto
      .omit({ imageUrl: true })
      .merge(z.object({ image: z.array(z.any()) })),
    mode: "onChange",
    defaultValues: {
      eventGroupId: eventGroup.id,
      name: `${eventGroup.name} - #${eventGroup.Event.length + 1} Etapa`,
      id: eventId,
      dateStart: "",
      dateEnd: "",
      location: "",
      rules: eventGroup?.rules || "",
      description: eventGroup?.description || "",
    },
  });

  const { data, trigger, isMutating } = useAction({
    action: upsertEvent,
    onSuccess: () => {
      setIsModalOpen(false);
    },
    onError: (error) => {
      showToast({
        message: error,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  function handleEditModalOpening({ subeventId }: { subeventId: string }) {
    const subEvent = eventGroup.Event.find((event) => event.id === subeventId);
    if (!subEvent) {
      return;
    }
    form.setValue(
      "dateEnd",
      dayjs(subEvent.dateEnd).utc().format("DD/MM/YYYY")
    );
    form.setValue(
      "dateStart",
      dayjs(subEvent.dateStart).utc().format("DD/MM/YYYY")
    );
    form.setValue("location", subEvent.location || "");
    form.setValue("name", subEvent.name || "");
    form.setValue("id", subEvent.id);
    setIsModalOpen(true);
  }

  return (
    <>
      <Form
        id="SubeventForm"
        hform={form}
        onSubmit={async (data) => {
          const { image, ...rest } = data;

          const uploadedFiles = await uploadFiles(
            [{ name: "image", file: image ? image[0] : [] }],
            "/events/"
          );

          trigger({ ...rest, imageUrl: uploadedFiles?.image?.url });
        }}
      >
        <SubeventModal
          modalState={{ isModalOpen, setIsModalOpen }}
          subevent={eventGroup.Event.find(
            (event) => event.id === form.getValues("id")
          )}
        />
      </Form>
      <div className="flex justify-end">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => setIsModalOpen(true)}
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
            cell: (info) => date(info.getValue(), "DD/MM/YYYY"),
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
            cell: (info) => {
              switch (info.getValue()) {
                case "draft":
                  return <Badge color="amber">Pendente</Badge>;
                case "published":
                  return <Badge color="green">Publicado</Badge>;
              }
            },
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() =>
                      handleEditModalOpening({ subeventId: info.getValue() })
                    }
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
