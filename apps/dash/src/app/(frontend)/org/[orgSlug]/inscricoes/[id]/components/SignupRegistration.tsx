"use client";
import { Transition } from "@headlessui/react";
import { Organization, State, Team } from "@prisma/client";
import clsx from "clsx";
import { BottomNavigation, For, SubmitButton } from "odinkit";
import {
  Button,
  Checkbox,
  Description,
  FieldGroup,
  Fieldset,
  Label,
  useForm,
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  MultistepForm,
  useAction,
  showToast,
  ErrorMessage,
} from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventWithInfo } from "prisma/types/Events";
import { useMemo, useState } from "react";
import { calculatePrice } from "../../utils/price";
import { SportDetails } from "./shared/SportDetails";
import dayjs from "dayjs";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
import { AddonInfo } from "./shared/AddonInfo";
import EventRegistrationHeader from "./shared/EventRegistrationHeader";
import GeneralDetailsSection from "../../../(auth)/[route]/@cadastro/components/GeneralDetailsSection";
import PersonalDetailSection from "../../../(auth)/[route]/@cadastro/components/PersonalDetailsSection";
import SessionScreen from "./shared/SessionScreen";
import DocumentSection from "../../../(auth)/[route]/@cadastro/components/DocumentSection";
import { createEventSignupRegistration } from "@/app/api/registrations/events/event.action";
import { signupRegistrationDto } from "@/app/api/registrations/events/event.dto";
import { useParams, useSearchParams } from "next/navigation";
dayjs.extend(parseCustomFormat);

export default function SignupRegistration({
  event,
  teams,
  batch,
  organization,
  states,
}: {
  event: EventWithInfo;
  teams?: Team[];
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  organization: Organization;
  states: State[];
}) {
  const [showRules, setShowRules] = useState(false);
  const [showSessionScreen, setShowSessionScreen] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const form = useForm({
    id: "IndividualRegistrationForm",
    mode: "onChange",
    schema: signupRegistrationDto,
    defaultValues: {
      batchId: searchParams.get("batch") ?? undefined,
      eventId: event.id,
      organizationId: organization.id,
      registration: {
        modalityId:
          event.EventModality.length === 1 && event.EventModality[0]?.id
            ? event.EventModality[0].id
            : undefined,
        addon: {
          id: event.EventAddon?.find((addon) => !addon.price)
            ? event.EventAddon?.find((addon) => !addon.price)?.id
            : undefined,
        },
      },
      acceptTerms: true,
    },
  });

  const { trigger } = useAction({
    action: createEventSignupRegistration,
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

  const Field = useMemo(() => form.createField(), []);

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
        {showSessionScreen ? (
          <SessionScreen
            event={event}
            setShowSessionScreen={setShowSessionScreen}
          />
        ) : (
          <>
            <EventRegistrationHeader event={event} batch={batch} />
            <div className="px-2">
              <MultistepForm
                hform={form}
                onSubmit={(data) => trigger(data)}
                order={["document", "user", "general", "addon", "confirmation"]}
                steps={{
                  document: {
                    form: <DocumentSection organization={organization} />,
                    fields: [
                      form.getValues("foreigner")
                        ? "foreignDocument"
                        : "document",
                    ],
                  },
                  user: {
                    fields: ["acceptTerms", "fullName", "email", "phone"],
                    form: (
                      <>
                        <GeneralDetailsSection />
                        <PersonalDetailSection states={states} />
                      </>
                    ),
                  },
                  general: {
                    fields: [
                      "registration.modalityId",
                      "registration.categoryId",
                    ],
                    form: (
                      <>
                        <SportDetails
                          event={event}
                          teams={teams}
                          userInfo={{
                            birthDate: dayjs(
                              form.watch("info.birthDate"),
                              "DD/MM/YYYY"
                            ).toDate(),
                            gender: form.watch("info.gender"),
                          }}
                        />
                      </>
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
                    conditions: [
                      event.EventAddon && event.EventAddon?.length > 0,
                    ],
                    form: (
                      <AddonInfo event={event} organization={organization} />
                    ),
                  },
                  confirmation: {
                    fields: ["acceptedTerms"],
                    form: (
                      <>
                        <Fieldset
                          className={"my-2 border-b border-slate-100 pb-2"}
                        >
                          <FieldGroup>
                            <Field enableAsterisk={false} name="acceptedTerms">
                              <Checkbox
                                className={"lg:size-8"}
                                color={
                                  organization.options.colors.primaryColor.tw
                                    .color
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
                                    m.id ===
                                    form.watch("registration.modalityId")
                                )?.name
                              }
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
                                      {form.watch("registration.addon")
                                        ?.option ?? "Opção única"}
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
                                organization.options.colors.primaryColor.tw
                                  .color
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
          </>
        )}
      </div>
    </>
  );
}
