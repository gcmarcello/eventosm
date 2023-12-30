"use client";

import { Fragment, useState } from "react";
import { BottomNavigation } from "../_shared/components/BottomNavigation";
import { Button } from "../_shared/components/Button";
import { Container } from "../_shared/components/Containers";
import GeneralDetailsSection from "./components/GeneralDetailsSection";
import { Transition } from "@headlessui/react";
import PersonalDetailSections from "./components/PersonalDetailsSection";
import clsx from "clsx";
import Footer from "../_shared/components/Footer";

export default function RegistrarPage() {
  const [step, setStep] = useState(0);
  const steps = [GeneralDetailsSection, PersonalDetailSections, () => <div>Step 3</div>];

  function StepController() {
    return (
      <>
        {step > 0 && (
          <Button color="white" onClick={() => handleStepChange("prev")}>
            <div>Anterior</div>
          </Button>
        )}
        <Button onClick={() => handleStepChange("next")}>
          <div>Próximo</div>
        </Button>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-full lg:col-span-1 lg:col-start-2">
        <Container className="mx-4 mb-20 mt-4 lg:col-start-2 lg:mb-10">
          <form action="/orders" method="POST" className=" px-4 py-4 lg:pb-4">
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
                "hidden pt-3 lg:flex",
                step > 0 ? " justify-between" : "justify-end"
              )}
            >
              <StepController />
            </div>
          </form>
        </Container>
        <div className="block lg:hidden">
          <BottomNavigation>
            <div
              className={clsx("flex p-2", step > 0 ? " justify-between" : "justify-end")}
            >
              <StepController />
            </div>
          </BottomNavigation>
        </div>
      </div>
    </div>
  );
}
