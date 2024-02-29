"use client";
import {
  CreateMultipleRegistrationsDto,
  ExcelDataSchema,
  createMultipleRegistrationsDto,
  excelDataSchema,
} from "@/app/api/registrations/dto";
import { Transition } from "@headlessui/react";
import {
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentArrowUpIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  EventModality,
  EventRegistrationBatch,
  Organization,
} from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import {
  BottomNavigation,
  ButtonSpinner,
  For,
  List,
  SubmitButton,
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
  Button,
  Description,
  ErrorMessage,
  FileDropArea,
  FileInput,
  Form,
  ImageList,
  Input,
  Label,
  Legend,
  MultistepForm,
  Select,
  Switch,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import {
  EventGroupWithEvents,
  EventGroupWithInfo,
  EventModalityWithCategories,
} from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { read, utils } from "xlsx";
import { z } from "odinkit";
import { filterCategories } from "../../../../utils/categories";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { createMultipleRegistrations } from "@/app/api/registrations/action";
import Link from "next/link";
import { ParticipantsForm } from "./ParticipantsForm";
import { EventForm } from "./EventForm";
import { ConfirmationForm } from "./ConfirmationForm";
import { rest } from "lodash";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

dayjs.extend(customParseFormat);

export default function TeamTournamentRegistration({
  eventGroup,
  batch,
  userSession,
  organization,
}: {
  userSession: UserSession;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatch;
  organization: Organization;
}) {
  const [inputMode, setInputMode] = useState<"manual" | "file" | null>(null);
  const searchParams = useSearchParams();
  const emptyTeamMember = {
    user: {
      fullName: "",
      email: "",
      phone: "",
      document: "",
      birthDate: "",
      zipCode: "",
      gender: "",
    },
    registration: {
      modalityId:
        eventGroup.EventModality.length > 1
          ? ""
          : eventGroup.EventModality[0]!.id,
      categoryId: "",
      addon: {
        id:
          eventGroup.EventAddon?.find((addon) => !addon.price)?.id || undefined,
        option: undefined,
      },
    },
  };

  const addEmptyTeamMember = () => {
    fieldArray.append(emptyTeamMember);
  };

  const form = useForm({
    schema: createMultipleRegistrationsDto,
    mode: "onChange",
    defaultValues: {
      eventGroupId: eventGroup.id,
      teamMembers: [],
      createTeam: true,
      teamName: "",
      batchId: searchParams.get("batchId") || undefined,
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const { fields, append } = fieldArray;

  function requiredFieldsForParticipant() {
    const array = fields.flatMap((_, index) => [
      `teamMembers.${index}.user.fullName`,
      `teamMembers.${index}.user.email`,
      `teamMembers.${index}.user.phone`,
      `teamMembers.${index}.user.document`,
      `teamMembers.${index}.user.birthDate`,
      `teamMembers.${index}.user.zipCode`,
      `teamMembers.${index}.user.gender`,
    ]);
    if (form.watch("createTeam")) return [...array, "teamName"];
    return array;
  }

  function requiredFieldsForEvent() {
    const registrationFields = fields.flatMap((_, index) => [
      `teamMembers.${index}.registration.modalityId`,
      `teamMembers.${index}.registration.categoryId`,
    ]);

    const addonFields = fields.flatMap((_, index) => {
      const addon = eventGroup.EventAddon?.find(
        (addon) =>
          addon.id === form.watch(`teamMembers.${index}.registration.addon.id`)
      );
      if ((addon?.options as string[])?.length) {
        return [
          `teamMembers.${index}.registration.addon.id`,
          `teamMembers.${index}.registration.addon.option`,
        ];
      } else {
        return [];
      }
    });
    return [...registrationFields, ...addonFields];
  }

  const { data, trigger, isMutating } = useAction({
    action: createMultipleRegistrations,
    redirect: true,
    requestParser: (data) => {
      const parsedteamMembers = data.teamMembers.map((member) => ({
        ...member,
        user: {
          ...member.user,
          document: member.user.document?.replace(/[^a-zA-Z0-9]/g, ""),
          phone: member.user.phone.replace(/[^a-zA-Z0-9]/g, ""),
        },
      }));
      data.files = [];
      return { ...data, teamMembers: parsedteamMembers };
    },
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

  return (
    <>
      <div className="pb-20">
        <div className="mx-4 mt-6 rounded-md border border-slate-200 p-4 lg:mx-16 lg:mt-10 xl:mx-20">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              {inputMode && (
                <div
                  className="mb-2 flex cursor-pointer items-center gap-1 text-sm font-semibold text-emerald-600"
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
            order={["participants", "event", "confirmation"]}
            steps={{
              participants: {
                fields: requiredFieldsForParticipant() as any,
                form: (
                  <ParticipantsForm
                    batch={batch}
                    eventGroup={eventGroup}
                    organization={organization}
                    fieldArray={fieldArray}
                    inputMode={inputMode}
                    setInputMode={setInputMode}
                    addEmptyTeamMember={addEmptyTeamMember}
                  />
                ),
              },
              event: {
                fields: requiredFieldsForEvent() as any,
                form: (
                  <EventForm eventGroup={eventGroup} fieldArray={fieldArray} />
                ),
              },
              confirmation: {
                fields: [],
                form: (
                  <ConfirmationForm
                    eventGroup={eventGroup}
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
                    {hasNextStep && (
                      <>
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
                      {hasNextStep && (
                        <>
                          <Button
                            type="button"
                            onClick={() => {
                              walk(1);
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
