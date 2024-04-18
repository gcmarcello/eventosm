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
import { Steps, BottomNavigation, SubmitButton } from "odinkit";

import { z } from "odinkit";
import { uploadFiles } from "@/app/api/uploads/action";
import { usePanel } from "../../../_shared/components/PanelStore";
import EventInfo from "./EventInfo";
import SportInfo from "./SportInfo";
import { Organization } from "@prisma/client";

export default function NewEventForm({
  organization,
}: {
  organization: Organization;
}) {
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

  const { data, isMutating, trigger } = useAction({
    action: upsertEvent,
    onSuccess: () => {
      showToast({
        message: "Evento criado com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro",
        variant: "error",
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
    <Form
      hform={form}
      onSubmit={async (data) => {
        const { image, ...rest } = data;

        const uploadedFiles = await uploadFiles(
          [{ name: "image", file: image ? image[0] : [] }],
          "events/"
        );

        await trigger({ ...rest, imageUrl: uploadedFiles?.image?.url });
      }}
    >
      <div className="pb-20 lg:pb-4">
        <Steps
          color={organization.options.colors.primaryColor.hex}
          steps={steps}
          stepRefs={stepRefs}
          topRef={topRef}
        />

        <div className="hidden lg:block">
          <hr />
          <div className="mt-3 flex justify-between">
            <SubmitButton>Enviar</SubmitButton>
          </div>
        </div>
      </div>
      <BottomNavigation className="flex justify-between p-3 lg:hidden">
        <SubmitButton>Enviar</SubmitButton>
      </BottomNavigation>
    </Form>
  );
}
