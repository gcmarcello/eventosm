"use client";

import { useEffect, useState } from "react";
import GeneralDetailsSection from "./components/GeneralDetailsSection";

import PersonalDetailSections from "./components/PersonalDetailsSection";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupDto, signupDto } from "@/app/api/auth/dto";
import { fakerPT_BR } from "@faker-js/faker";
import { cpfMock } from "@/utils/mock/cpfMock";
import { verifyStep } from "./utils/steps";
import dayjs from "dayjs";
import ConfirmDetailsSection from "./components/ConfirmDetailsSection";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/api/auth/action";
import { BottomNavigation } from "../_shared/components/BottomNavigation";
import { Container } from "odinkit/components/Containers";
import { showToast } from "odinkit/components/Toast";
import { useAction } from "odinkit/hooks/useAction";
import { Button } from "odinkit/components/Button";
import { Form } from "odinkit/components/Form/Form";
import { Transition } from "@headlessui/react";
import { useMocker } from "odinkit/components/Mocker";

export default function RegistrarPage() {
  const [step, setStep] = useState(0);
  const searchParams = useSearchParams();

  const form = useForm<SignupDto>({
    resolver: zodResolver(signupDto),
    mode: "onChange",
    defaultValues: {
      step1: {
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
      },
      step2: {
        info: {
          address: "",
          birthDate: "",
          cityId: "",
          stateId: "",
          complement: "",
          gender: "",
          number: "",
          zipCode: "",
        },
      },
      eventRedirect: { id: "3333", name: "Cubatense de Pedestrianismo 2024" },
    },
  });

  const mocker = useMocker({
    form,
    data: () => ({
      "step1.fullName": fakerPT_BR.person.fullName(),
      "step1.email": fakerPT_BR.internet.email(),
      "step1.phone": fakerPT_BR.phone.number(),
      "step1.document.value": cpfMock(),
      "step1.passwords.password": "123456",
      "step1.passwords.passwordConfirm": "123456",
      "step2.info.birthDate": dayjs(fakerPT_BR.date.birthdate()).format("DD/MM/YYYY"),
      "step2.info.gender": "male",
      "step2.info.zipCode": fakerPT_BR.location.zipCode(),
      "step2.info.address": fakerPT_BR.location.streetAddress(),
      "step2.info.cityId": "3548500",
      "step2.info.stateId": "35",
      "step2.info.number": fakerPT_BR.location.buildingNumber(),
      "step2.info.complement": fakerPT_BR.location.secondaryAddress(),
    }),
  });

  const steps = [GeneralDetailsSection, PersonalDetailSections, ConfirmDetailsSection];

  useEffect(() => {
    searchParams.get("event") &&
      form.setValue("eventRedirect", {
        id: "3333",
        name: "Evento de Teste",
      });
  }, [searchParams]);

  function StepController() {
    return (
      <>
        {step > 0 && (
          <Button color="white" onClick={() => handleStepChange("prev")}>
            <div>Anterior</div>
          </Button>
        )}
        <div className="text-sm font-medium text-gray-500">EventoSM ©</div>
        {step !== steps.length - 1 ? (
          <Button
            disabled={!verifyStep(step, form, signupDto)}
            onClick={() => handleStepChange("next")}
          >
            <div>Próximo</div>
          </Button>
        ) : (
          <Button type="submit" disabled={!form.formState.isValid} color="lime">
            <div>Cadastrar</div>
          </Button>
        )}
      </>
    );
  }

  function handleStepChange(direction: "next" | "prev") {
    if (direction === "next" && step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
    if (direction === "prev" && step > 0) {
      setStep((prev) => prev - 1);
    }
  }

  const { trigger: signUpAction, isMutating: isLoading } = useAction({
    action: signup as any,
    redirect: true,
    onError: (error) => {
      console.log(error);
      showToast({ message: "Erro inesperado", variant: "error", title: "Erro" });
      /* form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      }); */
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="col-span-full lg:col-span-2 lg:col-start-2">
        <Container className="mx-4 mb-20 mt-4 lg:col-start-2 lg:mb-10">
          <Form
            hform={form}
            onSubmit={(data) => signUpAction(data)}
            className="px-4 py-4 lg:pb-4"
          >
            {steps.map((Step, index) => (
              <Transition
                show={step === index}
                key={`step-${index}`}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Step />
              </Transition>
            ))}

            <div
              className={clsx(
                "hidden items-center pt-3 lg:flex",
                step > 0 ? " justify-between" : "justify-end gap-2"
              )}
            >
              <StepController />
            </div>
            <div className="block lg:hidden">
              <BottomNavigation>
                <div
                  className={clsx(
                    "flex items-center gap-2 p-2",
                    step > 0 ? " justify-between" : "justify-end"
                  )}
                >
                  <StepController />
                </div>
              </BottomNavigation>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
}
