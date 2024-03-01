import { CreateMultipleRegistrationsDto } from "@/app/api/registrations/dto";
import { ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { forEach } from "lodash";
import {
  For,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableMock,
  TableRow,
  Text,
} from "odinkit";
import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownHeading,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Select,
  useFormContext,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";
import { filterCategories } from "../../../../utils/categories";
import {
  EventGroupWithEvents,
  EventGroupWithInfo,
  EventModalityWithCategories,
} from "prisma/types/Events";
import { UseFieldArrayReturn } from "react-hook-form";
import { deleteUser } from "@/app/api/users/repository";

export function EventForm({
  fieldArray,
  eventGroup,
}: {
  eventGroup: EventGroupWithInfo;
  fieldArray: UseFieldArrayReturn<
    CreateMultipleRegistrationsDto,
    "teamMembers",
    "id"
  >;
}) {
  const { fields, append } = fieldArray;

  const [modalities, setModalities] = useState<EventModalityWithCategories[]>(
    []
  );

  const form = useFormContext<CreateMultipleRegistrationsDto>();

  const Field = useMemo(() => form.createField(), []);

  function autoAssignCategories() {
    forEach(fields, (field, index) => {
      const birthDate = form.getValues(`teamMembers.${index}.user.birthDate`);
      const gender = form.getValues(`teamMembers.${index}.user.gender`);
      const modalityId = form.getValues(
        `teamMembers.${index}.registration.modalityId`
      );
      form.setValue(
        `teamMembers.${index}.registration.categoryId`,
        filterCategories(
          eventGroup.EventModality.find(
            (mod) =>
              mod.id ===
              form.watch(`teamMembers.${index}.registration.modalityId`)
          )?.modalityCategory || [],
          {
            birthDate: dayjs(
              form.watch(`teamMembers.${index}.user.birthDate`),
              "DD/MM/YYYY"
            ).toDate(),
            gender: form.watch(`teamMembers.${index}.user.gender`),
          }
        )[0]?.id || ""
      );
    });
  }

  function autoAssignModalities() {
    forEach(fields, (field, index) => {
      form.setValue(
        `teamMembers.${index}.registration.modalityId`,
        eventGroup.EventModality[0]!.id
      );
      form.resetField(`teamMembers.${index}.registration.categoryId`);
    });
  }

  function autoAssignAddons(addonId: string, option?: string) {
    forEach(fields, (field, index) => {
      form.setValue(`teamMembers.${index}.registration.addon.id`, addonId);
      if (option)
        form.setValue(`teamMembers.${index}.registration.addon.option`, option);
    });
  }

  useEffect(() => {
    setModalities(eventGroup.EventModality);
  }, [eventGroup.EventModality]);

  return (
    <>
      <div className="mx-4 mb-4 flex flex-col items-center justify-end gap-3 lg:flex-row lg:justify-center lg:gap-10">
        <div className="max-w-[500px]">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
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
            onClick={() => autoAssignModalities()}
          >
            Atribuir Modalidades Automaticamente
          </Button>
        </div>

        <ArrowRightIcon className="hidden size-16 text-zinc-500 lg:block" />

        <div className="max-w-[500px]">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
              2
            </div>
            <div className="flex flex-col">
              <Text className="font-semibold">Categorias</Text>
              <Text>
                Algumas modalidades podem não possuir uma categoria para a idade
                e sexo do atleta.
              </Text>
            </div>
          </div>
          <Button
            className={"mt-4"}
            disabled={form
              .watch("teamMembers")
              .some((member) => !member.registration.modalityId)}
            onClick={() => autoAssignCategories()}
          >
            Atribuir Categorias Automaticamente
          </Button>
        </div>
        {eventGroup.EventAddon?.length ? (
          <>
            <ArrowRightIcon className="hidden size-16 text-zinc-500 lg:block" />

            <div className="max-w-[500px]">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
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
                  <For each={eventGroup.EventAddon}>
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
          </>
        ) : null}
      </div>
      <TableMock>
        <TableHead>
          <TableRow>
            <TableHeader>Nome Completo</TableHeader>
            <TableHeader>Modalidade</TableHeader>
            <TableHeader>Categoria</TableHeader>
            {eventGroup.EventAddon?.length ? (
              <TableHeader>Kit</TableHeader>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          <For each={fields}>
            {(field, index) => (
              <>
                <TableRow>
                  <TableCell>
                    <Text>
                      {form.getValues(`teamMembers.${index}.user.fullName`)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {modalities.length > 1 ? (
                      <Field
                        name={`teamMembers.${index}.registration.modalityId`}
                      >
                        <Select
                          data={eventGroup.EventModality}
                          valueKey="id"
                          displayValueKey="name"
                        />
                      </Field>
                    ) : (
                      <Text>Modalidade Única - {modalities[0]?.name}</Text>
                    )}
                  </TableCell>
                  <TableCell className="min-w-[250px]">
                    <Field
                      name={`teamMembers.${index}.registration.categoryId`}
                    >
                      <Select
                        disabled={
                          !form.watch(
                            `teamMembers.${index}.registration.modalityId`
                          )
                        }
                        data={filterCategories(
                          eventGroup.EventModality.find(
                            (mod) =>
                              mod.id ===
                              form.watch(
                                `teamMembers.${index}.registration.modalityId`
                              )
                          )?.modalityCategory || [],
                          {
                            birthDate: dayjs(
                              form.watch(`teamMembers.${index}.user.birthDate`),
                              "DD/MM/YYYY"
                            ).toDate(),
                            gender: form.watch(
                              `teamMembers.${index}.user.gender`
                            ),
                          }
                        )}
                        valueKey="id"
                        displayValueKey="name"
                      />
                    </Field>
                  </TableCell>
                  {eventGroup.EventAddon?.length ? (
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
                  ) : null}
                </TableRow>
              </>
            )}
          </For>
        </TableBody>
      </TableMock>
    </>
  );
}
