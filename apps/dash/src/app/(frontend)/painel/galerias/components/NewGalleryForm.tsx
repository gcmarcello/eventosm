"use client";

import {
  readEventFulltext,
  readEventGroupFulltext,
} from "@/app/api/events/action";
import { upsertGalleryDto } from "@/app/api/galleries/dto";
import { Tab } from "@headlessui/react";
import {
  Event,
  EventGroup,
  Organization,
  OrganizationDocumentStatus,
} from "@prisma/client";
import clsx from "clsx";
import { Badge, FileImagePreview, Text, z } from "odinkit";
import {
  Button,
  Combobox,
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
  useForm,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";

export function GalleryForm({ organization }: { organization: Organization }) {
  const form = useForm({
    schema: upsertGalleryDto
      .omit({ mediaUrls: true })
      .merge(z.object({ mediaUrls: z.array(z.any()).optional() })),
    mode: "onChange",
    defaultValues: {
      eventGroupId: undefined,
      eventId: undefined,
      name: undefined,
      id: undefined,
    },
  });
  const [disableComboboxes, setDisableComboboxes] = useState(false);
  const [connectMode, setConnectMode] = useState<"eventId" | "eventGroupId">(
    "eventId"
  );
  const [selectedEvent, setSelectedEvent] = useState<
    Event | EventGroup | undefined
  >(undefined);

  const { data: fulltextEvents, trigger: fulltextSearchEvents } = useAction({
    action: readEventFulltext,
  });

  const { data: fulltextEventGroups, trigger: fulltextSearchEventGroups } =
    useAction({
      action: readEventGroupFulltext,
    });

  function resetComboboxes() {
    form.setValue(connectMode, undefined);
    setSelectedEvent(undefined);
    setDisableComboboxes(false);
  }

  function handleDisableComboboxes() {
    setTimeout(() => {
      setDisableComboboxes(true);
    }, 200);
  }

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <Form hform={form}>
        <Fieldset>
          <FieldGroup className="space-y-2">
            <Field name="name">
              <Label>Nome</Label>
              <Input />
            </Field>
            <div className="flex-col items-end space-y-5 lg:flex-row">
              <Field className={"flex-grow"} name={connectMode}>
                <div className="flex items-end gap-2">
                  <Label>
                    {connectMode === "eventId"
                      ? "Evento Relacionado"
                      : "Campeonato Relacionado"}
                  </Label>
                  <Button
                    onClick={() => {
                      resetComboboxes();
                      if (connectMode === "eventId") {
                        setConnectMode("eventGroupId");
                      } else {
                        setConnectMode("eventId");
                      }
                    }}
                    plain
                    className={"pb-0 text-xs underline lg:pb-0"}
                  >
                    Conectar{" "}
                    {connectMode === "eventId" ? "Campeonato" : "Evento"}
                  </Button>
                </div>
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
                    setSelectedEvent(item);
                    handleDisableComboboxes();
                  }}
                >
                  {(item) => <div>{item.name}</div>}
                </Combobox>
              </Field>
              {form.watch("eventGroupId") || form.watch("eventId") ? (
                <div className="mb-1">
                  <Button onClick={() => resetComboboxes()}>Limpar</Button>
                  {selectedEvent && (
                    <Badge color={"indigo"}>{selectedEvent.name}</Badge>
                  )}
                </div>
              ) : null}
            </div>

            <Field name="mediaUrls">
              <Label>Fotos</Label>
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
                <ImageList />
                <FileDropArea
                  render={
                    form.watch("mediaUrls")?.length ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivos:</span>{" "}
                          {form.watch("mediaUrls")?.length}{" "}
                          <span
                            onClick={() => {
                              form.resetField("mediaUrls");
                            }}
                            className="cursor-pointer font-semibold text-emerald-600"
                          >
                            Trocar
                          </span>
                        </Text>
                      </>
                    ) : null
                  }
                />
              </FileInput>
            </Field>
          </FieldGroup>
        </Fieldset>
      </Form>
    </>
  );
}
