import {
  CreateMultipleRegistrationsDto,
  ExcelDataSchema,
  excelDataSchema,
} from "@/app/api/registrations/dto";
import { readTeams } from "@/app/api/teams/action";
import { chooseTextColor } from "@/utils/colors";
import {
  ChevronDownIcon,
  DocumentArrowUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { EventRegistrationBatch, Organization } from "@prisma/client";
import {
  Alertbox,
  For,
  Link,
  List,
  LoadingSpinner,
  Table,
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
  Checkbox,
} from "odinkit/client";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { filterCategories } from "../../../../utils/categories";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/solid";
import { forEach } from "lodash";
import clsx from "clsx";
import { TeamWithUsers } from "prisma/types/Teams";
import { fetchUserInfo } from "../../../../utils/userInfo";
import { EventGroupCreateMultipleRegistrationsDto } from "@/app/api/registrations/eventGroups/eventGroup.dto";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(parseCustomFormat);

export function ParticipantsForm({
  teams,
  fieldArray,
  eventGroup,
  organization,
}: {
  teams: TeamWithUsers[];
  organization: Organization;
  eventGroup: EventGroupWithInfo;
  fieldArray: UseFieldArrayReturn<
    EventGroupCreateMultipleRegistrationsDto,
    "teamMembers",
    "id"
  >;
  setInputMode: (mode: "file" | "manual" | null) => void;
  inputMode: null | "file" | "manual";
}) {
  const { fields, insert } = fieldArray;
  const [parsedTeamData, setParsedTeamData] = useState(null);

  const form = useFormContext<CreateMultipleRegistrationsDto>();

  const Field = useMemo(() => form.createField(), []);

  function parseTeamData(teamId: string) {
    const parsedTeamData = teams
      ?.find((team) => team.id === teamId)
      ?.User.map((u) => ({
        userId: u.id,
        modalityId:
          eventGroup.EventModality.length > 1
            ? ""
            : eventGroup.EventModality[0]!.id,
        categoryId: "",
        addon: {
          id:
            eventGroup.EventAddon?.find((addon) => !addon.price)?.id ||
            undefined,
          option: undefined,
        },
        selected: true,
      }));

    if (parsedTeamData) form.setValue("teamMembers", parsedTeamData);
  }

  function autoAssignModalities() {
    fields.forEach((field, index) => {
      form.setValue(
        `teamMembers.${index}.modalityId`,
        eventGroup.EventModality[0]!.id
      );
      form.resetField(`teamMembers.${index}.categoryId`);
    });
  }

  function autoAssignCategories() {
    fields.forEach((field, index) => {
      if (form.getValues(`teamMembers.${index}.selected`)) {
        const userInfo = fetchUserInfo(field.userId!, teams, form);
        const birthDate = userInfo?.info.birthDate;
        const gender = userInfo?.info.gender!;
        const modalityId = form.getValues(`teamMembers.${index}.modalityId`);
        form.setValue(
          `teamMembers.${index}.categoryId`,
          filterCategories(
            eventGroup.EventModality.find((mod) => mod.id === modalityId)
              ?.modalityCategory || [],
            {
              birthDate: dayjs(birthDate).toDate(),
              gender,
            }
          )[0]?.id || ""
        );
      }
    });
  }

  return (
    <>
      {form.watch("teamMembers").length ? (
        <div className="mx-4 mb-4 flex flex-col items-center justify-end gap-3 lg:flex-row lg:justify-center lg:gap-10">
          <div className="max-w-[500px]">
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: organization.options.colors.primaryColor.hex,
                }}
                className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full  font-bold text-white"
              >
                1
              </div>
              <div className="flex flex-col">
                <Text className="font-semibold">Modalidades</Text>
                <Text>
                  Atribua modalidades a cada um dos atletas. Todos os inscritos
                  precisam ter uma modalidade cadastrada.
                </Text>
              </div>
            </div>

            <Button
              disabled={eventGroup.EventModality.length < 2}
              className={"mt-4"}
              onClick={() => {
                autoAssignModalities();
              }}
            >
              Atribuir Modalidades Automaticamente
            </Button>
          </div>

          <ArrowRightIcon className="hidden size-16 text-zinc-500 lg:block" />

          <div className="max-w-[500px]">
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: organization.options.colors.primaryColor.hex,
                }}
                className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full  font-bold text-white"
              >
                2
              </div>
              <div className="flex flex-col">
                <Text className="font-semibold">Categorias</Text>
                <Text>
                  Algumas modalidades podem não possuir uma categoria para a
                  idade e sexo do atleta.
                </Text>
              </div>
            </div>
            <Button
              className={"mt-4"}
              disabled={form
                .watch("teamMembers")
                .some((member) => !member.modalityId)}
              onClick={() => {
                autoAssignCategories();
              }}
            >
              Atribuir Categorias Automaticamente
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          <>
            <div className="col-span-4 mt-4 lg:col-span-2 lg:col-start-2 ">
              <Text className="flex items-center gap-2">
                <ComputerDesktopIcon className="size-32 lg:size-8" />
                Devido ao alto número de informações na tela, recomendamos que
                inscrições em lote sejam feitas através de um computador.
              </Text>
              {teams?.length ? (
                <div className="my-4">
                  <Field name="teamId">
                    <Label>Escolher Equipe</Label>
                    <Select
                      data={teams?.map((team) => ({
                        id: team.id,
                        name: team.name,
                      }))}
                      onChange={(e) => parseTeamData((e as any)?.target?.value)}
                      displayValueKey="name"
                    />
                  </Field>
                </div>
              ) : (
                <div className="my-2">
                  <Text>
                    Você ainda não cadastrou nenhuma equipe.{" "}
                    <Link
                      href="/perfil/equipes"
                      style={{
                        color: organization.options.colors.primaryColor.hex,
                      }}
                      className="font-medium"
                    >
                      Clique aqui
                    </Link>{" "}
                    para criar uma.
                  </Text>
                </div>
              )}
            </div>
          </>
        </div>
      )}

      {form.watch("teamId") ? (
        <>
          <TableMock>
            <TableHead>
              <TableRow>
                <TableHeader>Nome Completo</TableHeader>
                <TableHeader>Modalidade</TableHeader>
                <TableHeader>Categoria</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <For each={fields}>
                {(field, index) => {
                  const userInfo = fetchUserInfo(field.userId!, teams, form);
                  return (
                    <>
                      <TableRow
                        className={clsx(
                          !form.watch(`teamMembers.${index}.selected`) &&
                            "bg-slate-100"
                        )}
                      >
                        <TableCell>
                          <Field
                            className={"flex items-center gap-2"}
                            enableAsterisk={false}
                            name={`teamMembers.${index}.selected`}
                          >
                            <Checkbox
                              onChange={(e) => {
                                if (!e) {
                                  if (eventGroup.EventModality.length > 1)
                                    form.resetField(
                                      `teamMembers.${index}.modalityId`
                                    );
                                  form.resetField(
                                    `teamMembers.${index}.categoryId`
                                  );
                                }
                              }}
                              className={"lg:size-8"}
                              color={
                                organization.options.colors.primaryColor.tw
                                  .color
                              }
                            />
                            <Label className={"ms-2"}>
                              {userInfo?.fullName}
                            </Label>
                          </Field>
                        </TableCell>

                        <TableCell>
                          {eventGroup.EventModality.length > 1 ? (
                            <Field name={`teamMembers.${index}.modalityId`}>
                              <Select
                                disabled={
                                  !form.watch(`teamMembers.${index}.selected`)
                                }
                                data={eventGroup.EventModality}
                                valueKey="id"
                                displayValueKey="name"
                              />
                            </Field>
                          ) : (
                            <Text>
                              Modalidade Única -{" "}
                              {eventGroup.EventModality[0]?.name}
                            </Text>
                          )}
                        </TableCell>
                        <TableCell className="min-w-[250px]">
                          <Field name={`teamMembers.${index}.categoryId`}>
                            <Select
                              disabled={
                                !form.watch(`teamMembers.${index}.selected`)
                              }
                              data={filterCategories(
                                eventGroup.EventModality.find(
                                  (mod) =>
                                    mod.id ===
                                    form.watch(
                                      `teamMembers.${index}.modalityId`
                                    )
                                )?.modalityCategory || [],
                                {
                                  birthDate: dayjs(
                                    userInfo?.info.birthDate
                                  ).toDate(),
                                  gender: userInfo?.info.gender!,
                                }
                              )}
                              valueKey="id"
                              displayValueKey="name"
                            />
                          </Field>
                        </TableCell>
                        {/* {eventGroup.EventAddon?.length ? (
                        <TableCell className="min-w-[180px]">
                          <Field
                            name={`teamMembers.${index}.registration.addon.id`}
                          >
                            <Select
                              disabled={
                                !(
                                  !!form.watch(
                                    `teamMembers.${index}.registration.modalityId`
                                  ) &&
                                  !!form.watch(
                                    `teamMembers.${index}.registration.categoryId`
                                  )
                                )
                              }
                              data={eventGroup.EventAddon || []}
                              valueKey="id"
                              displayValueKey="name"
                            />
                          </Field>
                          {form.watch(
                            `teamMembers.${index}.registration.addon.id`
                          ) &&
                          eventGroup.EventAddon?.find(
                            (addon) =>
                              addon.id ===
                              form.watch(
                                `teamMembers.${index}.registration.addon.id`
                              )
                          )?.options ? (
                            <Field
                              name={`teamMembers.${index}.registration.addon.option`}
                            >
                              <Select
                                disabled={
                                  !form.watch(
                                    `teamMembers.${index}.registration.addon.id`
                                  )
                                }
                                data={
                                  (
                                    eventGroup.EventAddon?.find(
                                      (addon) =>
                                        addon.id ===
                                        form.watch(
                                          `teamMembers.${index}.registration.addon.id`
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
                      ) : null} */}
                      </TableRow>
                    </>
                  );
                }}
              </For>
            </TableBody>
          </TableMock>
        </>
      ) : null}
      <Text className="mt-3">
        <Link
          href="/perfil/equipes"
          style={{
            color: organization.options.colors.primaryColor.hex,
          }}
          className="font-medium"
        >
          Clique aqui
        </Link>{" "}
        para editar ou criar uma nova equipe.
      </Text>
    </>
  );
}
