"use client";

import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { EventRegistrationBatch, Organization } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import { Alertbox, BottomNavigation, For, SubmitButton, Text } from "odinkit";
import {
  Button,
  MultistepForm,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { EventGroupWithInfo } from "prisma/types/Events";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { ParticipantsForm } from "./ParticipantsForm";
import { ConfirmationForm } from "./ConfirmationForm";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { TeamWithUsers } from "prisma/types/Teams";
import { AddonsForm } from "./AddonsForm";
import { eventGroupCreateMultipleRegistrationsDto } from "@/app/api/registrations/eventGroups/eventGroup.dto";
import { createEventGroupMultipleRegistrations } from "@/app/api/registrations/action";

dayjs.extend(customParseFormat);

export default function TeamTournamentRegistration({
  eventGroup,
  batch,
  organization,
  teams,
}: {
  userSession: UserSession;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatch;
  organization: Organization;
  teams: TeamWithUsers[];
}) {
  const [inputMode, setInputMode] = useState<"manual" | "file" | null>(null);
  const searchParams = useSearchParams();
  const emptyTeamMember = {
    userId: "",
    modalityId:
      eventGroup.EventModality.length > 1
        ? ""
        : eventGroup.EventModality[0]!.id,
    categoryId: "",
    addon: {
      id: eventGroup.EventAddon?.find((addon) => !addon.price)?.id || undefined,
      option: undefined,
    },
    selected: true,
  };

  const addEmptyTeamMember = () => {
    fieldArray.append(emptyTeamMember);
  };

  const form = useForm({
    schema: eventGroupCreateMultipleRegistrationsDto,
    mode: "onChange",
    defaultValues: {
      eventGroupId: eventGroup.id,
      teamMembers: [],
      teamId: "",
      batchId: searchParams.get("batch") || undefined,
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const { fields, append } = fieldArray;

  const { data, trigger, isMutating } = useAction({
    action: createEventGroupMultipleRegistrations,
    redirect: true,
    onSuccess: () => {
      showToast({
        message: "Inscrição realizada com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error,
        title: "Erro",
        variant: "error",
      });
    },
  });

  function requiredParticipantFields() {
    const registrationFields = fields.flatMap((_, index) => {
      if (form.watch(`teamMembers.${index}.selected`)) {
        return [
          `teamMembers.${index}.userId`,
          `teamMembers.${index}.modalityId`,
          `teamMembers.${index}.categoryId`,
        ];
      }
    });

    registrationFields.push("teamId");

    return registrationFields;
  }

  function requiredAddonFields() {
    const registrationFields = fields.flatMap((_, index) => {
      if (form.watch(`teamMembers.${index}.addon.id`)) {
        return [`teamMembers.${index}.addon.option`];
      }
    });

    return registrationFields;
  }

  return (
    <>
      <div className="pb-20">
        <div className="mx-4 mt-6 rounded-md border border-slate-200 p-4 lg:mx-16 lg:mt-10 xl:mx-20">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              {inputMode && (
                <div
                  style={{
                    color: organization.options.colors.primaryColor.hex,
                  }}
                  className="mb-2 flex cursor-pointer items-center gap-1 text-sm font-semibold "
                  onClick={() => {
                    form.resetField("teamMembers");
                    setInputMode(null);
                  }}
                >
                  <ArrowLeftCircleIcon className="h-6 w-6 cursor-pointer " />{" "}
                  Voltar
                </div>
              )}
              <div className="mt-4 text-xl font-medium lg:mt-0">
                {eventGroup.name}
              </div>
              <Text>
                Inscrição em equipe para todas as etapas (
                {eventGroup.Event.length}
                ).
              </Text>
            </div>
            <div className="relative h-20 w-32 ">
              {eventGroup.imageUrl && (
                <Image
                  className="rounded-md"
                  fill={true}
                  src={eventGroup.imageUrl}
                  alt="imagem do campeonato"
                />
              )}
            </div>
          </div>
          <MultistepForm
            hform={form}
            order={["participants", "addons", "confirmation"]}
            steps={{
              participants: {
                fields: requiredParticipantFields() as any,
                form: (
                  <ParticipantsForm
                    teams={teams}
                    eventGroup={eventGroup}
                    organization={organization}
                    fieldArray={fieldArray}
                    inputMode={inputMode}
                    setInputMode={setInputMode}
                  />
                ),
              },
              addons: {
                fields: requiredAddonFields() as any,
                form: (
                  <AddonsForm
                    organization={organization}
                    eventGroup={eventGroup}
                    fieldArray={fieldArray}
                    teams={teams}
                  />
                ),
              },
              confirmation: {
                fields: [],
                form: (
                  <ConfirmationForm
                    teams={teams}
                    eventGroup={eventGroup}
                    organization={organization}
                    fieldArray={fieldArray}
                  />
                ),
              },
            }}
            onSubmit={(data) => trigger(data)}
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
                    {hasNextStep &&
                    form.watch("teamId") &&
                    form.watch("teamMembers").filter((tm) => tm.selected)
                      .length ? (
                      <>
                        <Button
                          type="button"
                          color={
                            organization.options.colors.primaryColor.tw.color
                          }
                          onClick={() => {
                            walk(1);
                            scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={
                            !isCurrentStepValid ||
                            !form.watch("teamMembers").length
                          }
                        >
                          Próximo
                        </Button>
                      </>
                    ) : null}
                    {currentStep === 0 && inputMode === "manual" && (
                      <Button onClick={() => addEmptyTeamMember()}>
                        <PlusIcon className="h-6 w-6" /> Participante
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
                  <BottomNavigation
                    className={clsx(
                      "block p-2",
                      inputMode ? "lg:block" : "lg:hidden"
                    )}
                  >
                    <div className="flex flex-row-reverse justify-between">
                      {hasNextStep && (
                        <>
                          <Button
                            type="button"
                            className={"my-auto"}
                            onClick={() => {
                              walk(1);
                              scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={!isCurrentStepValid}
                          >
                            Próximo
                          </Button>
                        </>
                      )}

                      {currentStep === 0 && inputMode === "manual" && (
                        <Button onClick={() => addEmptyTeamMember()}>
                          <PlusIcon className="h-6 w-6" /> Participante
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
