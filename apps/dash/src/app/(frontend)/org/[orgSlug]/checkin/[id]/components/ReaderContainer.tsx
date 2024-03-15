"use client";
import { subeventEventGroupCheckinDto } from "@/app/api/checkins/dto";
import { chooseTextColor } from "@/utils/colors";
import {
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { Event, Organization } from "@prisma/client";
import { For, SubmitButton, Text, Title } from "odinkit";
import {
  Button,
  Description,
  ErrorMessage,
  Form,
  Input,
  Label,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { Suspense, useMemo, useState } from "react";

import { QrReader } from "react-qr-reader";
import { NoSsrReader } from "./NoSSRReader";
import {
  eventGroupSubeventCheckin,
  readEventGroupRegistrationCheckin,
} from "@/app/api/checkins/action";
import clsx from "clsx";

export default function ReaderContainer({
  event,
  organization,
  deviceType,
}: {
  event: Event;
  organization: Organization;
  deviceType: string;
}) {
  const form = useForm({
    schema: subeventEventGroupCheckinDto,
    defaultValues: { subeventId: event.id },
  });

  const { data, trigger, isMutating, reset } = useAction({
    action: readEventGroupRegistrationCheckin,
    onSuccess: (data) => console.log(data),
    onError: (error) =>
      showToast({ message: error, variant: "error", title: "Erro!" }),
  });

  const {
    data: checkinData,
    trigger: checkinTrigger,
    isMutating: checkinIsMutating,
    reset: checkinReset,
  } = useAction({
    action: eventGroupSubeventCheckin,
    onSuccess: (data) => {
      reset();
      checkinReset();
      showToast({
        message: "Check-in realizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) =>
      showToast({ message: error, variant: "error", title: "Erro!" }),
  });

  function handleQrCodeReader(registrationId: string) {
    trigger({ ...form.getValues(), registrationId });
  }

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <div className="flex h-[calc(100dvh-96px)] flex-col items-stretch justify-stretch ">
        <div
          className="flex h-16 w-full items-center px-2 py-1"
          style={{
            backgroundColor: organization.options.colors.secondaryColor.hex,
          }}
        >
          <Title
            style={{
              color: organization.options.colors.primaryColor.hex,
            }}
            className=" w-full text-slate-100"
          >
            Check-in - {event.name}
          </Title>
        </div>
        {data && (
          <div className="flex h-[calc(100dvh-96px-4rem)] flex-col items-stretch bg-zinc-100 py-4">
            <div className="grow">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Inscrição encontrada!
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Detalhes da Inscrição
                </p>
              </div>
              <div className="mt-4 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Nome do Atleta
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {data.existingRegistration.user.fullName}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Modalidade - Categoria
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {data.existingRegistration.modality?.name} -{" "}
                      {data.existingRegistration.category.name}
                    </dd>
                  </div>
                  {data.existingRegistration.addon && (
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Kit
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {data.existingRegistration.addon?.name} -{" "}
                        {data.existingRegistration.addonOption}
                      </dd>
                    </div>
                  )}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Check-in das Etapas
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <div className="flex justify-evenly">
                        <For each={data.existingUserEventGroupCheckins}>
                          {(checkin) => (
                            <CheckCircleIcon
                              className={clsx(
                                "size-8",
                                checkin.EventCheckIn.length
                                  ? "text-green-500"
                                  : ""
                              )}
                            />
                          )}
                        </For>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex justify-between gap-3 px-2">
              <Button
                plain
                onClick={() => reset()}
                disabled={checkinIsMutating}
              >
                Cancelar
              </Button>
              <Button
                color={organization.options.colors.primaryColor.tw.color}
                onClick={() =>
                  checkinTrigger({
                    subeventId: event.id,
                    registrationId: data.existingRegistration.id,
                  })
                }
                disabled={checkinIsMutating}
              >
                Check-in
              </Button>
            </div>
          </div>
        )}
        {!data && (
          <>
            {deviceType === "mobile" ? (
              <div
                className="flex w-dvw justify-center"
                style={{
                  backgroundColor:
                    organization.options.colors.secondaryColor.hex,
                }}
              >
                {" "}
                <NoSsrReader trigger={handleQrCodeReader} />
              </div>
            ) : null}

            <Form
              className="flex w-full grow flex-col gap-3 bg-slate-100 px-3 py-4"
              hform={form}
              onSubmit={(data) => {
                trigger(data);
                form.reset();
              }}
            >
              <Field name="document">
                <Description className={"flex gap-2"}>
                  <QrCodeIcon className="size-10" /> Problemas com o QR Code?
                  <br /> Digite o CPF do atleta abaixo.
                </Description>
                <Input mask={"999.999.999-99"} inputMode="numeric" />
              </Field>
              <SubmitButton
                color={organization.options.colors.primaryColor.tw.color}
                className={"w-full"}
              >
                <MagnifyingGlassIcon className="size-5" /> Procurar Inscrição
              </SubmitButton>
            </Form>
          </>
        )}
      </div>
    </>
  );
}
