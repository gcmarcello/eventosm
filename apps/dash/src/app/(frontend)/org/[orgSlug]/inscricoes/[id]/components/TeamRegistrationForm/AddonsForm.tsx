import {
  CreateMultipleRegistrationsDto,
  ExcelDataSchema,
  excelDataSchema,
} from "@/app/api/registrations/dto";
import { readTeams } from "@/app/api/teams/action";
import { chooseTextColor } from "@/utils/colors";
import {
  DocumentArrowUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { EventRegistrationBatch, Organization } from "@prisma/client";
import {
  Alertbox,
  For,
  List,
  LoadingSpinner,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableMock,
  TableRow,
  Text,
  formatCEP,
  formatCPF,
  formatPhone,
  normalize,
  option,
  sheetToJson,
} from "odinkit";
import {
  FileInput,
  showToast,
  FileDropArea,
  useFormContext,
  Input,
  Select,
  Label,
  Description,
  Switch,
  ErrorMessage,
  Button,
  useAction,
  Dropdown,
  DropdownButton,
  DropdownHeading,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
} from "odinkit/client";
import {
  EventGroupWithEvents,
  EventGroupWithInfo,
  EventWithInfo,
} from "prisma/types/Events";
import { Suspense, useEffect, useMemo, useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
import { TeamWithUsers } from "prisma/types/Teams";
import { fetchUserInfo } from "../../../utils/userInfo";
import { EventCreateMultipleRegistrationsDto } from "@/app/api/registrations/events/event.dto";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(parseCustomFormat);

export function AddonsForm({
  event,
  organization,
  fieldArray,
  teams,
}: {
  organization: Organization;
  event: EventWithInfo;
  teams: TeamWithUsers[];
  fieldArray: UseFieldArrayReturn<
    EventCreateMultipleRegistrationsDto,
    "teamMembers",
    "id"
  >;
}) {
  const form = useFormContext<EventCreateMultipleRegistrationsDto>();

  const Field = useMemo(() => form.createField(), []);

  function autoAssignAddons(addonId: string, option?: string) {
    fieldArray.fields.forEach((field, index) => {
      form.setValue(`teamMembers.${index}.addon.id`, addonId);
      if (option) form.setValue(`teamMembers.${index}.addon.option`, option);
    });
  }

  return (
    <>
      {event.EventAddon?.length ? (
        <>
          <div className="mx-4 mb-4 flex flex-col items-center justify-end gap-3 lg:flex-row lg:justify-center lg:gap-10">
            <div className="max-w-[500px]">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor:
                      organization.options.colors.primaryColor.hex,
                  }}
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white"
                >
                  3
                </div>
                <div className="flex flex-col">
                  <Text className="font-semibold">Kits</Text>
                  <Text>
                    Alguns kits possuem opções, selecione as opções desejadas
                    para cada atleta.
                  </Text>
                </div>
              </div>
              <Dropdown>
                <DropdownButton className={"mt-4"}>
                  Atribuir Kits Automaticamente
                  <ChevronDownIcon className="size-5" />
                </DropdownButton>
                <DropdownMenu>
                  <For each={event.EventAddon}>
                    {(addon) => (
                      <DropdownSection aria-label={addon.name}>
                        <DropdownHeading>{addon.name}</DropdownHeading>
                        <For each={addon.options as string[]}>
                          {(option) => (
                            <DropdownItem
                              onClick={() =>
                                autoAssignAddons(addon.id, option as string)
                              }
                            >
                              {option as string}
                            </DropdownItem>
                          )}
                        </For>
                      </DropdownSection>
                    )}
                  </For>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="hidden max-w-[500px] lg:block">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor:
                      organization.options.colors.primaryColor.hex,
                  }}
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full  font-bold text-white"
                >
                  4
                </div>
                <div className="flex flex-col">
                  <Text className="font-semibold">Confirmar</Text>
                  <Text>
                    Avance para confirmar os dados e realizar as inscrições.
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <TableMock>
            <TableHead>
              <TableRow>
                <TableHeader>Nome Completo</TableHeader>
                <TableHeader>Kit</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <For each={fieldArray.fields}>
                {(field, index) => {
                  const userInfo = fetchUserInfo(field.userId!, teams, form);
                  if (!userInfo) return <p>Carregando...</p>;
                  if (!form.getValues(`teamMembers.${index}.selected`))
                    return <></>;
                  return (
                    <>
                      <TableRow>
                        <TableCell>
                          <Text>{userInfo?.fullName}</Text>
                        </TableCell>

                        <TableCell className="min-w-[180px]">
                          <Field name={`teamMembers.${index}.addon.id`}>
                            <Select
                              disabled={
                                !(
                                  !!form.watch(
                                    `teamMembers.${index}.modalityId`
                                  ) &&
                                  !!form.watch(
                                    `teamMembers.${index}.categoryId`
                                  )
                                )
                              }
                              data={event.EventAddon || []}
                              valueKey="id"
                              displayValueKey="name"
                            />
                          </Field>
                          {form.watch(`teamMembers.${index}.addon.id`) &&
                          event.EventAddon?.find(
                            (addon) =>
                              addon.id ===
                              form.watch(`teamMembers.${index}.addon.id`)
                          )?.options ? (
                            <Field name={`teamMembers.${index}.addon.option`}>
                              <Select
                                disabled={
                                  !form.watch(`teamMembers.${index}.addon.id`)
                                }
                                data={
                                  (
                                    event.EventAddon?.find(
                                      (addon) =>
                                        addon.id ===
                                        form.watch(
                                          `teamMembers.${index}.addon.id`
                                        )
                                    )?.options as string[]
                                  )?.map((o) => ({
                                    id: o,
                                    name: o,
                                  })) || []
                                }
                                valueKey="id"
                                displayValueKey="name"
                              />
                            </Field>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                }}
              </For>
            </TableBody>
          </TableMock>
        </>
      ) : null}
    </>
  );
}
