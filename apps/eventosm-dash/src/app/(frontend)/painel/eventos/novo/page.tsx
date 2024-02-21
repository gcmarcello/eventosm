"use client";
import { upsertEvent } from "@/app/api/events/action";
import { upsertEventDto } from "@/app/api/events/dto";
import {
  Form,
  showToast,
  useAction,
  useForm,
  useMocker,
  useSteps,
} from "odinkit/client";
import { useEffect, useMemo, useRef } from "react";
import { usePanel } from "../../_shared/components/PanelStore";
import { Steps, BottomNavigation } from "odinkit";
import EventInfo from "./components/EventInfo";
import SportInfo from "./components/SportInfo";
import StepControl from "./components/StepControl";
import { z } from "zod";

export default function NewEventPage() {
  const form = useForm({
    mode: "onChange",
    schema: upsertEventDto
      .omit({ imageUrl: true })
      .merge(z.object({ image: z.array(z.any()) })),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      rules: "",
      slug: "",
    },
  });

  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const {
    colors: { primaryColor },
  } = usePanel();

  const { data, isMutating, trigger } = useAction({
    action: upsertEvent,
    onSuccess: () => {
      showToast({
        message: "Evento criado com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    redirect: true,
  });

  const Field = useMemo(() => form.createField(), []);
  const steps = [
    { title: "Geral", content: <EventInfo Field={Field} /> },
    {
      title: "Esportivo",
      content: <SportInfo Field={Field} />,
    },
  ];

  const step = useSteps({ currentStep: 1, stepCount: steps.length - 1 });

  function blockNextStep() {
    if (step.currentStep === steps.length - 1) {
      return !form.formState.isValid;
    }

    const invalidFields =
      form.getFieldState("name").invalid ||
      form.getFieldState("location").invalid ||
      form.getFieldState("dateStart").invalid ||
      form.getFieldState("dateEnd").invalid ||
      form.getFieldState("slug").invalid;

    if (invalidFields) return true;
    return false;
  }

  const mocker = useMocker({
    form,
    data: () => ({
      name: "Evento de Teste",
      location: "Rua 3",
      dateStart: "01/01/2024",
      dateEnd: "02/01/2024",
      description:
        "Informações gerais do evento, aparecerão em destaque na página.",
      rules:
        "Regras do evento, aparecerão na página principal e durante a inscrição.",
      slug: "exemplo",
    }),
  });

  return (
    <Form hform={form} onSubmit={(data) => trigger(data)}>
      <div className="pb-20 lg:pb-4">
        <Steps
          color={primaryColor}
          steps={steps}
          stepRefs={stepRefs}
          topRef={topRef}
        />
        <div className="hidden lg:block">
          <hr />
          <div className="mt-3 flex justify-between">
            <StepControl
              blockNextStep={blockNextStep()}
              steps={steps}
              stepRefs={stepRefs}
              topRef={topRef}
            />
          </div>
        </div>
      </div>
      <BottomNavigation className="flex justify-between p-3 lg:hidden">
        <StepControl
          blockNextStep={blockNextStep()}
          steps={steps}
          stepRefs={stepRefs}
          topRef={topRef}
        />
      </BottomNavigation>
    </Form>
  );
}
