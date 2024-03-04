"use client";
import { Transition } from "@headlessui/react";
import { EventRegistrationBatch, Organization, UserInfo } from "@prisma/client";
import clsx from "clsx";
import { Radio as HeadlessRadio } from "@headlessui/react";
import Image from "next/image";
import {
  BottomNavigation,
  ButtonSpinner,
  For,
  SubmitButton,
  Text,
  scrollToElement,
  toProperCase,
} from "odinkit";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  Checkbox,
  Description,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Select,
  useForm,
  AlertBody,
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  MultistepForm,
  useAction,
  RadioGroup,
  RadioField,
  Radio,
  showToast,
} from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { calculatePrice } from "../../../utils/price";
import { filterCategories } from "../../../utils/categories";
import { eventGroupCreateRegistrationDto } from "@/app/api/registrations/eventGroups/eventGroup.dto";
import { createEventGroupIndividualRegistration } from "@/app/api/registrations/action";

export default function IndividualTournamentRegistration({
  eventGroup,
  batch,
  userSession,
  userInfo,
  organization,
}: {
  userSession: UserSession;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  userInfo: UserInfo;
  organization: Organization;
}) {
  const [showRules, setShowRules] = useState(false);
  const form = useForm({
    id: "TournamentIndividualRegistrationForm",
    schema: eventGroupCreateRegistrationDto,
    defaultValues: {
      eventGroupId: eventGroup.id,
    },
  });

  const { data, isMutating, trigger } = useAction({
    action: createEventGroupIndividualRegistration,
    redirect: true,
    onSuccess: (data) =>
      showToast({
        message: "Inscrição realizada com sucesso!",
        title: "Sucesso",
        variant: "success",
      }),
    onError: (error) => {
      console.log(error);
      showToast({ message: error, title: "Erro", variant: "error" });
    },
  });

  useEffect(() => {
    if (
      eventGroup.EventModality.length === 1 &&
      eventGroup.EventModality[0]?.id
    ) {
      form.setValue("registration.modalityId", eventGroup.EventModality[0].id);
    }
  }, [eventGroup]);

  const Field = useMemo(() => form.createField(), []);

  const categories = useMemo(
    () =>
      filterCategories(
        eventGroup.EventModality.flatMap((mod) => mod.modalityCategory),
        userInfo
      ),
    [eventGroup]
  );

  return (
    <>
      <Dialog open={showRules} onClose={setShowRules}>
        <DialogTitle onClose={() => setShowRules(false)} className="">
          Regulamento {eventGroup.name}
        </DialogTitle>
        <DialogBody>
          <div
            dangerouslySetInnerHTML={{
              __html: eventGroup.rules ?? "Regulamento não disponível.",
            }}
          />
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowRules(false)}>Voltar</Button>
        </DialogActions>
      </Dialog>

      <div className="mx-4 mt-3 rounded-md border border-slate-200 px-2 lg:mx-96  lg:mt-10">
        <div className="mb-6 flex items-center justify-between gap-3 ">
          <div>
            <div className="mt-4 text-xl font-medium lg:mt-0">
              {" "}
              {eventGroup.name}
            </div>
            <Text>
              Inscrição para todas as etapas ({eventGroup.Event.length}
              ).
            </Text>
          </div>
          <div className="relative h-20 w-32 ">
            <Image
              className="rounded-md"
              fill={true}
              src={eventGroup.imageUrl || ""}
              alt="imagem do campeonato"
            />
          </div>
        </div>
        <div className="p-2">
          <MultistepForm
            hform={form}
            onSubmit={(data) => trigger(data)}
            order={["general", "addon", "confirmation"]}
            steps={{
              general: {
                fields: ["registration.modalityId", "registration.categoryId"],
                form: (
                  <Fieldset className={"grid grid-cols-2 lg:divide-x"}>
                    <FieldGroup className="col-span-2 lg:col-span-2 lg:pe-4">
                      {eventGroup.EventModality.length > 1 ? (
                        <Field name="registration.modalityId">
                          <Label>Selecionar Modalidade</Label>
                          <Select
                            data={eventGroup.EventModality}
                            valueKey="id"
                            displayValueKey="name"
                          />
                        </Field>
                      ) : (
                        <Text className="mb-3">
                          Modalidade Única -{" "}
                          {
                            eventGroup.EventModality.find(
                              (mod) =>
                                mod.id ===
                                form.getValues("registration.modalityId")
                            )?.name
                          }
                        </Text>
                      )}
                      <Field name="registration.categoryId">
                        <Label>Selecionar Categoria</Label>
                        <Select
                          disabled={
                            form.watch("registration.modalityId") === undefined
                          }
                          data={filterCategories(
                            eventGroup.EventModality.find(
                              (mod) =>
                                mod.id === form.watch("registration.modalityId")
                            )?.modalityCategory || [],
                            {
                              birthDate: userInfo.birthDate,
                              gender: userInfo.gender,
                            }
                          )}
                          valueKey="id"
                          displayValueKey="name"
                        />
                        <Description>
                          {form.watch("registration.modalityId") === undefined
                            ? "Escolha uma modalidade para liberar as categorias"
                            : "As categorias exibidas são apenas as disponíveis para você."}
                        </Description>
                      </Field>
                    </FieldGroup>
                  </Fieldset>
                ),
              },
              addon: {
                fields: [],
                conditions: [
                  eventGroup.EventAddon && eventGroup.EventAddon?.length > 0,
                ],
                form: (
                  <Fieldset>
                    <FieldGroup className="col-span-2 lg:col-span-1 lg:ps-4">
                      <Field
                        enableAsterisk={false}
                        name="registration.addon.id"
                      >
                        <Label>Escolha seu Kit</Label>
                        <Description>
                          Clique no kit desejado para escolher o tamanho.
                        </Description>
                        <RadioGroup
                          className={
                            "wrap flex max-w-[100vw] flex-col justify-between space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0"
                          }
                        >
                          <For each={eventGroup.EventAddon || []}>
                            {(addon) => {
                              const options =
                                (addon.options as (string | number)[])?.map(
                                  (option) => ({ name: option, id: option })
                                ) || [];

                              return (
                                <RadioField className="grow" custom={true}>
                                  <HeadlessRadio value={addon.id}>
                                    {({ checked }) => (
                                      <div
                                        className={clsx(
                                          "flex min-h-32 min-w-32 grow  cursor-pointer flex-col rounded-md border border-slate-200 bg-opacity-25 p-4 shadow-md duration-200 hover:bg-slate-400 hover:bg-opacity-25 lg:flex-row lg:divide-x",
                                          checked
                                            ? "bg-slate-400"
                                            : "bg-transparent"
                                        )}
                                      >
                                        {addon.image && (
                                          <div className="relative h-28 w-28 ">
                                            <Image
                                              className="pe-4"
                                              alt="kit image"
                                              fill={true}
                                              src={addon.image}
                                            />
                                          </div>
                                        )}
                                        <div className="ps-4">
                                          <div className="font-medium">
                                            {addon.name}
                                          </div>
                                          <Text>
                                            Camiseta, sacochila e viseira.
                                          </Text>
                                          {checked && (
                                            <Field name="registration.addon.option">
                                              <Select
                                                data={options}
                                                displayValueKey="name"
                                              />
                                            </Field>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </HeadlessRadio>
                                </RadioField>
                              );
                            }}
                          </For>
                        </RadioGroup>
                      </Field>
                    </FieldGroup>
                  </Fieldset>
                ),
              },
              confirmation: {
                fields: ["acceptedTerms"],
                form: (
                  <>
                    <dl className="mb-4 divide-y divide-gray-100">
                      {/* <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                      <dt className=" font-medium leading-6 text-gray-900">
                        Nome
                      </dt>
                      <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {userSession.fullName}
                      </dd>
                    </div> */}
                      <div className=" py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                        <dt className=" font-medium leading-6 text-gray-900">
                          Categoria
                        </dt>
                        <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {
                            categories.find(
                              (category) =>
                                category.id ===
                                form.watch("registration.categoryId")
                            )?.name
                          }{" "}
                          -{" "}
                          {toProperCase(
                            categories.find(
                              (category) =>
                                category.id ===
                                form.watch("registration.categoryId")
                            )?.gender || ""
                          )}
                        </dd>
                      </div>
                      {eventGroup.EventAddon?.length
                        ? eventGroup.EventAddon?.length > 0 && (
                            <div className=" py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                              <dt className=" font-medium leading-6 text-gray-900">
                                {eventGroup.EventAddon?.find(
                                  (addon) =>
                                    addon.id ===
                                    form.watch("registration.addon.id")
                                )?.name
                                  ? eventGroup.EventAddon?.find(
                                      (addon) =>
                                        addon.id ===
                                        form.watch("registration.addon.id")
                                    )?.name
                                  : "Nenhum"}
                              </dt>
                              {(form.watch("registration.addon")?.option ||
                                eventGroup.EventAddon?.find(
                                  (addon) => !addon.price
                                )) && (
                                <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                  {form.watch("registration.addon")?.option ? (
                                    form.watch("registration.addon")?.option
                                  ) : eventGroup.EventAddon?.find(
                                      (addon) => !addon.price
                                    ) ? (
                                    <div className="font-medium text-red-600">
                                      Volte para escolher uma opção gratuita!
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </dd>
                              )}
                            </div>
                          )
                        : null}

                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                        <dt className=" font-medium leading-6 text-gray-900">
                          Etapas
                        </dt>
                        <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {eventGroup.Event.length}
                        </dd>
                      </div>
                      <div className=" py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                        <dt className=" font-medium leading-6 text-gray-900">
                          Preço
                        </dt>
                        <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {calculatePrice({
                            addonPrice:
                              eventGroup.EventAddon?.find(
                                (addon) =>
                                  addon.id ===
                                  form.watch("registration.addon.id")
                              )?.price || 0,
                            categoryPrice: batch.categoryControl
                              ? batch.CategoryBatch.find(
                                  (cat) =>
                                    cat.categoryId ===
                                    form.watch("registration.categoryId")
                                )?.price || 0
                              : batch.price,
                          })}
                        </dd>
                      </div>
                    </dl>
                    <Fieldset>
                      <FieldGroup>
                        <Field enableAsterisk={false} name="acceptedTerms">
                          <Checkbox
                            color={
                              organization.options.colors.primaryColor.tw.color
                            }
                          />
                          <Label className={"ms-3"}>Eu aceito o </Label>
                          <span
                            className="cursor-pointer select-none text-base/6 font-medium text-zinc-950 underline data-[disabled]:opacity-50 sm:text-sm/6"
                            onClick={() => setShowRules((prev) => !prev)}
                          >
                            regulamento.
                          </span>
                          <Description>
                            Aceitar o regulamento é obrigatório.
                          </Description>
                        </Field>
                      </FieldGroup>
                    </Fieldset>
                  </>
                ),
              },
            }}
          >
            {({
              currentStep,
              hasNextStep,
              hasPrevStep,
              order,
              steps,
              isCurrentStepValid,
              walk,
            }) => {
              return (
                <>
                  <div className={clsx("space-y-2 pb-2 lg:mb-4")}>
                    <For each={order}>
                      {(step) => (
                        <Transition
                          show={step === order[currentStep]}
                          enter="ease-out duration-200"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-0 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          {steps[step].form}
                        </Transition>
                      )}
                    </For>
                  </div>
                  <div className="hidden flex-row-reverse justify-between lg:flex">
                    {hasNextStep && (
                      <Button
                        type="button"
                        color={
                          organization.options.colors.primaryColor.tw.color
                        }
                        onClick={() => {
                          walk(1);
                        }}
                        disabled={!isCurrentStepValid}
                      >
                        Próximo
                      </Button>
                    )}
                    {!hasNextStep && (
                      <SubmitButton
                        color={
                          organization.options.colors.primaryColor.tw.color
                        }
                      >
                        Inscrever
                      </SubmitButton>
                    )}
                    {hasPrevStep && (
                      <Button
                        type="button"
                        plain={true}
                        onClick={() => {
                          walk(-1);
                        }}
                      >
                        Voltar
                      </Button>
                    )}
                  </div>
                  <BottomNavigation className="block p-2 lg:hidden">
                    <div className="flex flex-row-reverse justify-between">
                      {!hasNextStep && (
                        <SubmitButton
                          color={
                            organization.options.colors.primaryColor.tw.color
                          }
                        >
                          Inscrever
                        </SubmitButton>
                      )}
                      {hasNextStep && (
                        <Button
                          type="button"
                          onClick={() => {
                            walk(1);
                          }}
                          disabled={!isCurrentStepValid}
                        >
                          Próximo
                        </Button>
                      )}
                      {hasPrevStep && (
                        <Button
                          type="button"
                          onClick={() => {
                            walk(-1);
                          }}
                        >
                          Voltar
                        </Button>
                      )}
                    </div>
                  </BottomNavigation>
                </>
              );
            }}
          </MultistepForm>
        </div>
      </div>
    </>
  );
}
