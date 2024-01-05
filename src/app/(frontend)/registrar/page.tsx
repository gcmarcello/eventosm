"use client";

import { useEffect, useState } from "react";
import { BottomNavigation } from "../_shared/components/BottomNavigation";
import { Button } from "../_shared/components/Button";
import { Container } from "../_shared/components/Containers";
import GeneralDetailsSection from "./components/GeneralDetailsSection";
import { Transition } from "@headlessui/react";
import PersonalDetailSections from "./components/PersonalDetailsSection";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupDto, signupDto } from "@/app/api/auth/dto";
import { Form, createField } from "../_shared/components/Form/Form";
import { BottomRightMocker, TopLeftMocker } from "../_shared/components/Mocker";
import { fakerPT_BR } from "@faker-js/faker";
import { cpfMock } from "@/utils/mock/cpfMock";
import { verifyStep } from "./utils/steps";
import dayjs from "dayjs";
import ConfirmDetailsSection from "./components/ConfirmDetailsSection";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/api/auth/action";
import { useAction } from "../_shared/hooks/useAction";
import { showToast } from "../_shared/components/Toast";
import { readAddressFromZipCode } from "@/app/api/geo/service";
import { Text } from "../_shared/components/Text";

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

  function mockData() {
    const password = fakerPT_BR.internet.password();
    const data = {
      name: fakerPT_BR.person.fullName(),
      email: fakerPT_BR.internet.email(),
      phone: fakerPT_BR.phone.number(),
      document: cpfMock(),
      password: password,
      passwordConfirm: password,
      birthDate: dayjs(fakerPT_BR.date.birthdate()).format("DD/MM/YYYY"),
      gender: "male",
      zipCode: fakerPT_BR.location.zipCode(),
      address: fakerPT_BR.location.streetAddress(),
      cityId: "b1209a53-d316-45c7-86ce-8345a8a8b4e2",
      stateId: "0d52ea34-7b15-4d07-9820-25a16cf7f299",
      number: fakerPT_BR.location.buildingNumber(),
      complement: fakerPT_BR.location.secondaryAddress(),
    };
    form.setValue("step1.fullName", data.name);
    form.setValue("step1.email", data.email);
    form.setValue("step1.phone", data.phone);
    form.setValue("step1.document.value", data.document);
    form.setValue("step1.document.foreigner", false);
    form.setValue("step1.passwords.password", data.password);
    form.setValue("step1.passwords.passwordConfirm", data.passwordConfirm);
    form.setValue("step2.info.birthDate", data.birthDate);
    form.setValue("step2.info.gender", data.gender);
    form.setValue("step2.info.zipCode", data.zipCode);
    form.setValue("step2.info.address", data.address);
    form.setValue("step2.info.cityId", data.cityId);
    form.setValue("step2.info.stateId", data.stateId);
    form.setValue("step2.info.number", data.number);
    form.setValue("step2.info.complement", data.complement);
    console.log(form.getValues());
    form.trigger();
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
      <TopLeftMocker mockData={mockData} />
    </div>
  );
}
