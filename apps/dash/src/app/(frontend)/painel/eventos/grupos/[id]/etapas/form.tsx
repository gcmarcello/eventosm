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
import { useState } from "react";
import SubeventModal from "./NewSubeventModal";
import { readEventGroups, upsertEvent } from "@/app/api/events/action";
import Image from "next/image";
import { Event, EventGroup } from "@prisma/client";

const schema = upsertEventDto
  .omit({ imageUrl: true })
  .merge(z.object({ image: z.array(z.any()).optional() }));

type Schema = z.infer<typeof schema>;

export function EtapasForm({
  eventGroup,
  eventId,
}: {
  eventGroup: EventGroup & { Event: Event[] };
  eventId?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  const form = useForm({
    schema,
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
    prepare: async (data: Schema) => {
      const { image, ...rest } = data;

      if (!image)
        return {
          ...rest,
          imageUrl: eventGroup.imageUrl ?? undefined,
        };

      const uploadedFiles = await uploadFiles(
        [{ name: "image", file: image ? image[0] : [] }],
        "/events/"
      );

      return { ...rest, imageUrl: uploadedFiles?.image?.url };
    },
    onSuccess: () => {
      setIsModalOpen(false);
      showToast({
        message: "Etapa salva com sucesso!",
        title: "Sucesso!",
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

  function handleEditModalOpening({ subeventId }: { subeventId?: string }) {
    if (!subeventId) {
      form.resetField("dateEnd");
    form.resetField("dateStart");
    form.resetField("location");
    form.setValue("name", `#${eventGroup.Event.length + 1} Etapa`);
    form.resetField("id");
    setIsModalOpen(true);
    }
    const subEvent = eventGroup.Event.find((event) => event.id === subeventId);
    if (!subEvent) return;
    form.setValue("dateEnd", date(subEvent.dateEnd, "DD/MM/YYYY", true));
    form.setValue("dateStart", date(subEvent.dateStart, "DD/MM/YYYY", true));
    form.setValue("location", subEvent.location || "");
    form.setValue("name", subEvent.name || "");
    form.setValue("id", subEvent.id);
    setIsModalOpen(true);
  }

  return (
    <>
      <Form hform={form} onSubmit={trigger}>
        <SubeventModal
          modalState={{ isModalOpen, setIsModalOpen }}
          subevent={eventGroup.Event.find(
            (event) => event.id === form.getValues("id")
          )}
          isLoading={isMutating}
        />
      </Form>
      <div className="flex justify-end">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => handleEditModalOpening({})}
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
              })[info.getValue() as "draft" | "published"],
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
