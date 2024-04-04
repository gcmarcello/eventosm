"use client";

import { updateOrganization } from "@/app/api/orgs/action";
import { upsertOrganizationDto } from "@/app/api/orgs/dto";

import { usePanel } from "../../_shared/components/PanelStore";
import { useMemo, useRef } from "react";
import {
  Button,
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  Legend,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import {
  BottomNavigation,
  ButtonSpinner,
  Step,
  Steps,
  SubmitButton,
  Text,
  formatPhone,
} from "odinkit";
import { z } from "odinkit";
import GeneralInfoSection from "./GeneralInfoSection";
import PersonalizationSection from "./PersonalizationSection";
import { Organization } from "@prisma/client";
import ImagesSection from "./ImagesSection";

export default function UpdateOrgForm({
  organization,
}: {
  organization: Organization;
}) {
  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const form = useForm({
    mode: "onChange",
    schema: upsertOrganizationDto,
    defaultValues: {
      name: organization.name,
      document: organization.document,
      email: organization.email,
      phone: formatPhone(organization.phone || ""),
      slug: organization.slug,
      abbreviation: organization.abbreviation,
    },
  });

  const { trigger: updateTrigger, isMutating: isLoading } = useAction({
    action: updateOrganization,

    redirect: true,
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
    onSuccess: (data) =>
      showToast({
        message: "Organização atualizada com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
  });

  const steps: Step[] = [
    {
      title: "Informações Gerais",
      content: <GeneralInfoSection />,
      description: "Informações principais da organização.",
    },
    {
      title: "Personalização",
      content: <PersonalizationSection organization={organization} />,
    },
    {
      title: "Imagens",
      content: <ImagesSection organization={organization} />,
    },
  ];

  return (
    <Form
      hform={form}
      onSubmit={(data) => {
        updateTrigger(data);
      }}
      className="space-y-3 pb-20 lg:pb-10"
    >
      <Steps
        stepRefs={stepRefs}
        topRef={topRef}
        steps={steps}
        color={organization.options.colors.primaryColor?.hex}
      />
      <div className="hidden justify-end lg:flex">
        <SubmitButton
          color={organization.options.colors.primaryColor?.tw.color}
        >
          Salvar
        </SubmitButton>
      </div>
      <BottomNavigation className="flex justify-end p-2 lg:hidden">
        <SubmitButton
          color={organization.options.colors.primaryColor?.tw.color}
        >
          Salvar
        </SubmitButton>
      </BottomNavigation>
    </Form>
  );
}
