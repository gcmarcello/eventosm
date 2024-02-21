"use client";

import { useEffect, useState } from "react";
import GeneralDetailsSection from "./GeneralDetailsSection";

import PersonalDetailSections from "./PersonalDetailsSection";
import clsx from "clsx";

import { signupDto } from "@/app/api/auth/dto";
import { fakerPT_BR } from "@faker-js/faker";
import { cpfMock } from "@/utils/mock/cpfMock";

import dayjs from "dayjs";
import ConfirmDetailsSection from "./ConfirmDetailsSection";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/api/auth/action";
import {
  Button,
  Form,
  MultistepForm,
  showToast,
  useAction,
  useForm,
  useMocker,
} from "odinkit/client";
import { BottomNavigation, ButtonSpinner, Container, For } from "odinkit";
import { Transition } from "@headlessui/react";
import { State } from "@prisma/client";

export default function FormContainer({ states }: { states: State[] }) {
  const searchParams = useSearchParams();

  const form = useForm({
    schema: signupDto,
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      document: {
        foreigner: false,
        value: "",
      },
      passwords: {
        password: "",
        passwordConfirm: "",
      },
      info: {
        address: "",
        birthDate: "",
        cityId: "",
        stateId: "",
        complement: "",
        gender: undefined,
        number: "",
        zipCode: "",
      },
      eventRedirect: { id: "", name: "" },
    },
  });

  const mocker = useMocker({
    form,
    data: () => ({
      fullName: fakerPT_BR.person.fullName(),
      email: fakerPT_BR.internet.email(),
      phone: fakerPT_BR.phone.number(),
      "document.value": cpfMock(),
      "passwords.password": "123456",
      "passwords.passwordConfirm": "123456",
      "info.birthDate": dayjs(fakerPT_BR.date.birthdate()).format("DD/MM/YYYY"),
      "info.gender": "male",
      "info.zipCode": fakerPT_BR.location.zipCode(),
      "info.address": fakerPT_BR.location.streetAddress(),
      "info.cityId": "3548500",
      "info.stateId": "35",
      "info.number": fakerPT_BR.location.buildingNumber(),
      "info.complement": fakerPT_BR.location.secondaryAddress(),
    }),
  });

  const steps = [
    GeneralDetailsSection,
    PersonalDetailSections,
    ConfirmDetailsSection,
  ];

  useEffect(() => {
    searchParams.get("event") &&
      form.setValue("eventRedirect", {
        id: "3333",
        name: "Evento de Teste",
      });
  }, [searchParams]);

  const { trigger: signUpTrigger, isMutating: isLoading } = useAction({
    action: signup,
    redirect: true,
    onError: (error) => {
      showToast({
        message: "Erro inesperado",
        variant: "error",
        title: "Erro",
      });
      /* form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      }); */
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="col-span-4 lg:col-span-2">
        <Container className="mx-4 mb-16 mt-4 lg:col-start-2 lg:mb-10 lg:px-12 lg:pt-10">
          <MultistepForm
            onSubmit={(data) => signUpTrigger(data)}
            hform={form}
            order={["general", "personal", "confirm"]}
            steps={{
              general: { form: <GeneralDetailsSection />, fields: [] },
              personal: {
                form: <PersonalDetailSections states={states} />,
                fields: [],
              },
              confirm: { form: <ConfirmDetailsSection />, fields: [] },
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
                        color="indigo"
                        onClick={() => {
                          walk(1);
                        }}
                        disabled={!isCurrentStepValid}
                      >
                        Próximo
                      </Button>
                    )}
                    {!hasNextStep && (
                      <Button
                        type="submit"
                        color="indigo"
                        disabled={!isCurrentStepValid}
                      >
                        <div className="flex items-center gap-2">
                          Cadastrar
                          {isLoading && <ButtonSpinner />}
                        </div>
                      </Button>
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
                        <Button
                          type="submit"
                          color="indigo"
                          disabled={isLoading || !isCurrentStepValid}
                        >
                          <div className="flex items-center gap-2">
                            Inscrever
                            {isLoading && <ButtonSpinner />}
                          </div>
                        </Button>
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
        </Container>
      </div>
      <div className="hidden h-dvh w-full bg-emerald-500 lg:col-span-2 lg:block"></div>
    </div>
  );
}
