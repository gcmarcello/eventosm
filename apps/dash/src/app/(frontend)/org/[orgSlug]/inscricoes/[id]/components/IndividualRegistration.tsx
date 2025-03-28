"use client";
import { Transition } from "@headlessui/react";
import {
  EventRegistrationBatch,
  Organization,
  Team,
  UserInfo,
} from "@prisma/client";
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
  ErrorMessage,
} from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import {
  EventGroupWithEvents,
  EventGroupWithInfo,
  EventWithInfo,
} from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { eventGroupCreateRegistrationDto } from "@/app/api/registrations/eventGroups/eventGroup.dto";
import { useSearchParams } from "next/navigation";
import { filterCategories } from "../../utils/categories";
import { calculatePrice } from "../../utils/price";
import { eventCreateRegistrationDto } from "@/app/api/registrations/events/event.dto";
import { createEventIndividualRegistration } from "@/app/api/registrations/events/event.action";
import { hexToRgb } from "@/utils/colors";

export default function IndividualRegistration({
  event,
  teams,
  batch,
  userSession,
  userInfo,
  organization,
}: {
  teams?: Team[];
  userSession: UserSession;
  event: EventWithInfo;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  userInfo: UserInfo;
  organization: Organization;
}) {
  const [showRules, setShowRules] = useState(false);
  const searchParams = useSearchParams();
  const form = useForm({
    id: "IndividualRegistrationForm",
    schema: eventCreateRegistrationDto,
    defaultValues: {
      eventId: event.id,
      batchId: searchParams.get("batch") || undefined,
    },
  });

  const { data, isMutating, trigger } = useAction({
    action: createEventIndividualRegistration,
    redirect: true,
    onSuccess: (data) =>
      showToast({
        message: "Inscrição realizada com sucesso!",
        title: "Sucesso",
        variant: "success",
      }),
    onError: (error) => {
      console.log(error);
      showToast({ message: error.message, title: "Erro", variant: "error" });
    },
  });

  useEffect(() => {
    if (event.EventModality.length === 1 && event.EventModality[0]?.id) {
      form.setValue("registration.modalityId", event.EventModality[0].id);
    }
    const freeAddon = event.EventAddon?.find((addon) => !addon.price);
    if (freeAddon) {
      form.setValue("registration.addon.id", freeAddon.id);
    }
  }, [event]);

  const Field = useMemo(() => form.createField(), []);

  const categories = useMemo(
    () =>
      filterCategories(
        event.EventModality.flatMap((mod) => mod.modalityCategory),
        userInfo
      ),
    [event]
  );

  useEffect(() => {
    if (categories.length === 1)
      form.setValue("registration.categoryId", categories[0]?.id);
  }, [categories]);

  useEffect(() => {
    form.resetField("registration.categoryId", { defaultValue: "" });
  }, [form.watch("registration.modalityId")]);

  return (
    <>
      <Dialog open={showRules} onClose={setShowRules}>
        <DialogTitle onClose={() => setShowRules(false)} className="">
          Regulamento {event.name}
        </DialogTitle>
        <DialogBody>
          <div
            dangerouslySetInnerHTML={{
              __html: event.rules ?? "Regulamento não disponível.",
            }}
          />
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowRules(false)}>Voltar</Button>
        </DialogActions>
      </Dialog>

      <div className="mx-4 mb-20 mt-3 rounded-md border border-slate-200  px-2 pb-3 lg:mx-96  lg:mb-0 lg:mt-10">
        <div className="flex items-center justify-between gap-3 p-2 ">
          <div>
            <div className="mt-4 text-xl font-medium lg:mt-0">
              {" "}
              {event.name}
            </div>
            <Text>Inscrição para o evento.</Text>
            {batch.name && <Text>Lote {batch.name}</Text>}
          </div>
          <div className="relative h-20 w-32 ">
            <Image
              className="rounded-md"
              fill={true}
              src={event.imageUrl || ""}
              alt="imagem do campeonato"
            />
          </div>
        </div>
        <div className="px-2">
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
                      {event.EventModality.length > 1 ? (
                        <Field name="registration.modalityId">
                          <Label>Selecionar Modalidade</Label>
                          <Select
                            data={event.EventModality}
                            valueKey="id"
                            displayValueKey="name"
                          />
                        </Field>
                      ) : (
                        <Text className="mb-3">
                          Modalidade Única -{" "}
                          {
                            event.EventModality.find(
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
                            event.EventModality.find(
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
                      {teams?.length ? (
                        <Field name="teamId">
                          <Label>Se inscrever com equipe</Label>
                          <Select
                            data={teams}
                            valueKey="id"
                            displayValueKey="name"
                          />
                          <Description>
                            Você pode escolher sua equipe depois, mas não poderá
                            alterar uma vez escolhida.
                          </Description>
                        </Field>
                      ) : null}
                    </FieldGroup>
                  </Fieldset>
                ),
              },
              addon: {
                fields:
                  (
                    event.EventAddon?.find(
                      (addon) =>
                        form.watch("registration.addon")?.id === addon.id
                    )?.options as string[]
                  )?.length > 0
                    ? ["registration.addon.option"]
                    : [],
                conditions: [event.EventAddon && event.EventAddon?.length > 0],
                form: (
                  <Fieldset>
                    <FieldGroup className="col-span-2 lg:col-span-1 lg:ps-4">
                      <Field
                        enableAsterisk={false}
                        name="registration.addon.id"
                      >
                        <Label>Escolha seu Kit</Label>
                        <Description>
                          Selecione seu kit para o evento.
                        </Description>
                        <RadioGroup
                          className={
                            "wrap flex max-w-[100vw] flex-col justify-between space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0"
                          }
                        >
                          <For each={event.EventAddon || []}>
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
                                        style={{
                                          backgroundColor: checked
                                            ? organization.options.colors
                                                .primaryColor.hex + "60"
                                            : "",
                                        }}
                                        className={clsx(
                                          "flex min-h-32 min-w-32 grow  cursor-pointer flex-col rounded-md border border-slate-200 bg-opacity-25 p-4 shadow-md duration-200 hover:bg-slate-400 hover:bg-opacity-25 lg:flex-row lg:divide-x"
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
                                          {addon.description && (
                                            <Text>{addon.description}</Text>
                                          )}
                                          {checked &&
                                          (addon.options as string[])
                                            ?.length ? (
                                            <Field name="registration.addon.option">
                                              <Select
                                                data={options}
                                                displayValueKey="name"
                                              />
                                            </Field>
                                          ) : null}
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
                    <Fieldset className={"my-2 border-b border-slate-100 pb-2"}>
                      <FieldGroup>
                        <Field enableAsterisk={false} name="acceptedTerms">
                          <Checkbox
                            className={"lg:size-8"}
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
                          <ErrorMessage />
                          <Description>
                            Aceitar o regulamento é obrigatório.
                          </Description>
                        </Field>
                      </FieldGroup>
                    </Fieldset>
                    <dl className="divide-y divide-gray-100">
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                        <dt className=" font-medium leading-6 text-gray-900">
                          Modalidade
                        </dt>
                        <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {
                            event.EventModality.find(
                              (m) =>
                                m.id === form.watch("registration.modalityId")
                            )?.name
                          }
                        </dd>
                      </div>
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
                          {categories.find(
                            (category) =>
                              category.id ===
                              form.watch("registration.categoryId")
                          )?.gender === "male"
                            ? "Masculino"
                            : categories.find(
                                  (category) =>
                                    category.id ===
                                    form.watch("registration.categoryId")
                                )?.gender === "female"
                              ? "Feminino"
                              : "Unissex"}
                        </dd>
                      </div>
                      {event.EventAddon?.length
                        ? event.EventAddon?.length > 0 && (
                            <div className=" py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                              <dt className=" font-medium leading-6 text-gray-900">
                                {event.EventAddon?.find(
                                  (addon) =>
                                    addon.id ===
                                    form.watch("registration.addon.id")
                                )?.name
                                  ? event.EventAddon?.find(
                                      (addon) =>
                                        addon.id ===
                                        form.watch("registration.addon.id")
                                    )?.name
                                  : "Nenhum"}
                              </dt>
                              {(form.watch("registration.addon")?.option ||
                                event.EventAddon?.find(
                                  (addon) => !addon.price
                                )) && (
                                <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                  {form.watch("registration.addon")?.option ??
                                    "Opção única"}
                                </dd>
                              )}
                            </div>
                          )
                        : null}

                      <div className=" py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                        <dt className=" font-medium leading-6 text-gray-900">
                          Preço
                        </dt>
                        <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {calculatePrice({
                            addonPrice:
                              event.EventAddon?.find(
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
                  <div className={clsx("space-y-2 lg:mb-4")}>
                    <For each={order}>
                      {(step) => {
                        if (step === order[currentStep])
                          return steps[step].form;
                        return <></>;
                      }}
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
