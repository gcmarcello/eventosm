"use client";

import {
  readEventFulltext,
  readEventGroupFulltext,
} from "@/app/api/events/action";
import { UpsertGalleryDto } from "@/app/api/galleries/dto";
import { upsertGallery } from "@/app/api/galleries/action";
import { uploadFiles } from "@/app/api/uploads/action";
import {
  Event,
  EventGroup,
  Gallery,
  Organization,
  OrganizationDocumentStatus,
} from "@prisma/client";
import { Text } from "odinkit";
import {
  Button,
  Combobox,
  Description,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  ImageList,
  Input,
  Label,
  showToast,
  useAction,
  useFormContext,
} from "odinkit/client";
import { useMemo, useState } from "react";

type FormDataType = Omit<UpsertGalleryDto, "mediaUrls"> & { medias: any[] };

export function GalleryForm({
  organization,
  gallery,
}: {
  organization: Organization;
  gallery?: Gallery & {
    Event?: Event | null;
    EventGroup?: EventGroup | null;
  };
}) {
  const form = useFormContext<FormDataType>();

  const [disableComboboxes, setDisableComboboxes] = useState(
    gallery?.eventGroupId || gallery?.eventId ? true : false
  );
  const [connectMode, setConnectMode] = useState<"eventId" | "eventGroupId">(
    "eventId"
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | EventGroup | null>(
    gallery ? gallery.Event || gallery.EventGroup || null : null
  );

  const { data: fulltextEvents, trigger: fulltextSearchEvents } = useAction({
    action: readEventFulltext,
  });

  const { data: fulltextEventGroups, trigger: fulltextSearchEventGroups } =
    useAction({
      action: readEventGroupFulltext,
    });

  const Field = useMemo(() => form.createField(), [connectMode]);

  function changeConnectionType(mode: "eventId" | "eventGroupId") {
    setConnectMode(mode);
    form.setValue("eventGroupId", null);
    form.setValue("eventId", null);
  }

  return (
    <>
      <Fieldset className="lg:pb-4">
        <FieldGroup className="space-y-2">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Field name="name">
              <Label>Nome</Label>
              <Input />
            </Field>
            <div className="flex-col items-end gap-2 lg:flex-row">
              <Field name={connectMode}>
                <Label>
                  {connectMode === "eventId"
                    ? "Evento Relacionado"
                    : "Campeonato Relacionado"}
                </Label>

                <div className="flex items-center gap-3">
                  <div className="flex-grow">
                    <Combobox
                      data={
                        connectMode === "eventId"
                          ? fulltextEvents
                          : fulltextEventGroups
                      }
                      disabled={disableComboboxes}
                      displayValueKey="name"
                      setData={(query) => {
                        if (query) {
                          (connectMode === "eventId"
                            ? fulltextSearchEvents
                            : fulltextSearchEventGroups)({
                            where: {
                              organizationId: organization.id,
                              name: query,
                            },
                          });
                        }
                      }}
                      onChange={(item) => {
                        if (!item) return;
                        setSelectedEvent(item ?? null);
                      }}
                    >
                      {(item: any) => <div>{item.name}</div>}
                    </Combobox>
                    <Description
                      onClick={() => {
                        if (connectMode === "eventId") {
                          changeConnectionType("eventGroupId");
                        } else {
                          changeConnectionType("eventId");
                        }
                      }}
                    >
                      Procure por um{" "}
                      <span className="cursor-pointer underline">
                        {connectMode === "eventId" ? "campeonato" : "evento"}
                      </span>
                      .
                    </Description>
                  </div>
                </div>
              </Field>
            </div>
          </div>

          <Field name="medias">
            <Label>Fotos</Label>
            <Description>Você poderá adicionar mais fotos depois.</Description>
            <FileInput
              fileTypes={["png", "jpg", "jpeg"]}
              maxFiles={100}
              maxSize={1}
              onError={(error) => {
                if (typeof error === "string") {
                  showToast({
                    message: error,
                    title: "Erro",
                    variant: "error",
                  });
                }
              }}
            >
              <FileDropArea
                render={
                  form.watch("medias")?.length ? (
                    <>
                      <Text>
                        <span className="font-semibold">Arquivos:</span>{" "}
                        {form.watch("medias")?.length} -{" "}
                        {(
                          form
                            .watch("medias")
                            .reduce((acc, file) => acc + file.size, 0) /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                        <span
                          onClick={() => {
                            form.resetField("medias");
                          }}
                          className="ms-1 cursor-pointer font-semibold text-emerald-600"
                        >
                          Trocar
                        </span>
                      </Text>
                    </>
                  ) : null
                }
              />
              <ImageList />
            </FileInput>
          </Field>
        </FieldGroup>
      </Fieldset>
    </>
  );
}
