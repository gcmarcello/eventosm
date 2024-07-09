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
  Link,
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
  useField,
  FileInput,
  FileDropArea,
  Legend,
} from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import React, { useEffect, useMemo, useState } from "react";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { calculatePrice } from "../../../utils/price";
import { filterCategories } from "../../../utils/categories";
import { eventGroupCreateRegistrationDto } from "@/app/api/registrations/eventGroups/eventGroup.dto";
import { useSearchParams } from "next/navigation";
import { createEventGroupIndividualRegistration } from "@/app/api/registrations/eventGroups/eventGroup.action";
import { useFieldArray } from "react-hook-form";
import { determineDocumentName } from "../../../utils/documentName";
import { nestUpload } from "@/app/api/uploads/action";

export default function IndividualTournamentRegistration({
  eventGroup,
  teams,
  batch,
  userSession,
  userInfo,
  organization,
}: {
  teams?: Team[];
  userSession: UserSession;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  userInfo: UserInfo;
  organization: Organization;
}) {
  const [showRules, setShowRules] = useState(false);
  const searchParams = useSearchParams();
  const form = useForm({
    id: "TournamentIndividualRegistrationForm",
    schema: eventGroupCreateRegistrationDto,
    defaultValues: {
      eventGroupId: eventGroup.id,
      batchId: searchParams.get("batch") || undefined,
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
      showToast({ message: error.message, title: "Erro", variant: "error" });
    },
  });

  const categories = useMemo(() => {
    if (batch.categoryControl) {
      const categoryBatch = batch.CategoryBatch;

      return filterCategories(
        eventGroup.EventModality.flatMap((mod) => mod.modalityCategory).filter(
          (cat) =>
            categoryBatch.find(
              (cb) =>
                cb.categoryId === cat.id &&
                cb.maxRegistrations &&
                cb.modalityId === form.watch("registration.modalityId")
            )
        ),
        userInfo
      );
    } else {
      return filterCategories(
        eventGroup.EventModality.flatMap((mod) => mod.modalityCategory).filter(
          (cat) => cat.eventModalityId === form.watch("registration.modalityId")
        ),
        userInfo
      );
    }
  }, [eventGroup, form.watch("registration.modalityId")]);

  const modalities = useMemo(() => eventGroup.EventModality, [eventGroup]);

  useEffect(() => {
    if (
      eventGroup.EventModality.length === 1 &&
      eventGroup.EventModality[0]?.id
    ) {
      form.setValue("registration.modalityId", eventGroup.EventModality[0].id);
    }
  }, [eventGroup, form.watch("registration.modalityId")]);

  const Field = useMemo(() => form.createField(), []);

  useEffect(() => {
    form.resetField("registration.categoryId", { defaultValue: "" });
  }, [form.watch("registration.modalityId")]);

  const categoryDocuments = useMemo(
    () =>
      eventGroup.EventModality.find(
        (mod) => mod.id === form.watch("registration.modalityId")
      )?.modalityCategory.find(
        (cat) => cat.id === form.watch("registration.categoryId")
      )?.CategoryDocument,
    [form.watch("registration.categoryId")]
  );

  useEffect(() => {
    if (categoryDocuments?.length) {
      form.setValue(
        "registration.documents",
        categoryDocuments.map((doc) => ({
          documentId: doc.id,
          file: [],
        }))
      );
    } else {
      form.resetField("registration.documents");
    }
  }, [categoryDocuments]);

  const { fields } = useFieldArray({
    name: "registration.documents",
    control: form.control,
  });

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

      <div className="mx-4 mb-20 mt-3 rounded-md border border-slate-200  px-2 pb-3 lg:mx-36 lg:my-10  xl:mx-96">
        <div className="flex items-center justify-between gap-3 p-2 ">
          <div>
            <div className="mt-4 text-xl font-medium lg:mt-0">
              {" "}
              {eventGroup.name}
            </div>
            <Text>
              Inscrição para todas as etapas ({eventGroup.Event.length}
              ).
            </Text>
            {batch.name && <Text>Lote {batch.name}</Text>}
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
        <div className="px-2">
          <MultistepForm
            hform={form}
            onSubmit={async (data) => {
              const documentArray = [];
              if (!data.registration.documents) {
                return trigger(data);
              }

              for (const document of data.registration.documents) {
                if (document.file) {
                  const response = await nestUpload({
                    files: [
                      {
                        file: document.file[0] as File,
                        name: document.documentId,
                      },
                    ],
                    folder: "registrationDocuments/",
                  });
                  documentArray.push({
                    ...document,
                    file: response[0]!.key,
                  });
                }
              }
              return trigger({
                ...data,
                registration: {
                  ...data.registration,
                  documents: documentArray,
                },
              });
            }}
            order={["general", "addon", "confirmation"]}
            steps={{
              general: {
                fields: ["registration.modalityId", "registration.categoryId"],
                refine: (data) => {
                  if (categoryDocuments?.length) {
                    return !!form
                      .watch("registration.documents")
                      ?.every((doc) => doc.file && doc.file.length > 0);
                  }
                  return true;
                },
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
                        {categories.length ||
                        !form.watch("registration.modalityId") ? (
                          <>
                            <Select
                              disabled={
                                form.watch("registration.modalityId") ===
                                undefined
                              }
                              data={categories}
                              valueKey="id"
                              displayValueKey="name"
                            />
                            <Description>
                              {form.watch("registration.modalityId") ===
                              undefined
                                ? "Escolha uma modalidade para liberar as categorias"
                                : "As categorias exibidas são apenas as disponíveis para você."}
                            </Description>
                          </>
                        ) : (
                          <Text>
                            Não existe nenhuma categoria disponível para você.
                          </Text>
                        )}
                      </Field>
                      {categoryDocuments?.length ? (
                        <Fieldset>
                          <Legend>Documentos Necessários</Legend>
                          <Text>
                            Esta categoria requer o envio de documentos. Se
                            disponível, faça o download do modelo e envie o
                            arquivo preenchido.
                          </Text>
                          <FieldGroup>
                            {fields.map((field, index) => {
                              return (
                                <Field
                                  key={field.id}
                                  name={`registration.documents.${index}.file`}
                                >
                                  <Label>
                                    {categoryDocuments[index] &&
                                      determineDocumentName(
                                        categoryDocuments[index]!
                                      )}
                                  </Label>
                                  {categoryDocuments[index]?.template && (
                                    <>
                                      <Link
                                        target="_blank"
                                        className="ms-1 text-sm  underline"
                                        href={
                                          process.env.NEXT_PUBLIC_BUCKET_URL +
                                          "/templates/" +
                                          categoryDocuments[index]?.template
                                        }
                                      >
                                        (Download do Modelo)
                                      </Link>
                                    </>
                                  )}
                                  <FileInput
                                    fileTypes={[
                                      "png",
                                      "jpg",
                                      "jpeg",
                                      "docx",
                                      "pdf",
                                    ]}
                                    maxFiles={1}
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
                                        form.watch(
                                          `registration.documents.${index}.file`
                                        )?.length &&
                                        form.watch(
                                          `registration.documents.${index}.file`
                                        )?.[0] ? (
                                          <>
                                            <Text>
                                              <span className="font-semibold">
                                                Arquivo:
                                              </span>{" "}
                                              {form.watch(
                                                `registration.documents.${index}.file`
                                              )?.[0]?.name ?? ""}
                                              <span
                                                onClick={() => {
                                                  form.resetField(
                                                    `registration.documents.${index}.file`
                                                  );
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
                                  <ErrorMessage />
                                </Field>
                              );
                            })}
                          </FieldGroup>
                        </Fieldset>
                      ) : null}
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
                          Modalidade
                        </dt>
                        <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {
                            modalities.find(
                              (modality) =>
                                modality.id ===
                                form.watch("registration.modalityId")
                            )?.name
                          }{" "}
                        </dd>
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
