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
import { z } from "zod";
import GeneralInfoSection from "./GeneralInfoSection";
import PersonalizationSection from "./PersonalizationSection";
import { Organization } from "@prisma/client";
import ImagesSection from "./ImagesSection";

const schema = upsertOrganizationDto.omit({ images: true }).merge(
  z.object({
    images: z
      .object({
        bg: z.array(z.any()).optional(),
        hero: z.array(z.any()).optional(),
        logo: z.array(z.any()).optional(),
      })
      .optional(),
  })
);

type Schema = z.infer<typeof schema>;

export default function UpdateOrgForm({
  organization,
}: {
  organization: Organization;
}) {
  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const form = useForm({
    mode: "onChange",
    schema,
    defaultValues: {
      name: organization.name,
      document: organization.document,
      email: organization.email,
      phone: formatPhone(organization.phone || ""),
      slug: organization.slug,
      abbreviation: organization.abbreviation,
      primaryColor: organization.options?.colors.primaryColor.id,
      secondaryColor: organization.options?.colors.secondaryColor.id,
      tertiaryColor: organization.options?.colors.tertiaryColor.id,
    },
  });

  const { trigger: updateTrigger, isMutating: isLoading } = useAction({
    action: updateOrganization,
    prepare: async (data: Schema) => {
      if (!data.images)
        return {
          ...data,
          images: organization.options?.images,
        };
      const { bg, hero, logo } = data.images;
      const formData = new FormData();
      if (bg) formData.append("bg", bg[0]);
      if (hero) formData.append("hero", hero[0]);
      if (logo) formData.append("logo", logo[0]);

      const fileUrl = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          throw error;
        });

      return {
        ...data,
        images: {
          bg: fileUrl.bg?.url || organization.options?.images?.bg,
          hero: fileUrl.hero?.url || organization.options?.images?.hero,
          logo: fileUrl.logo?.url || organization.options?.images?.logo,
        },
      };
    },
    redirect: true,
    onError: (error) =>
      showToast({ message: error, variant: "error", title: "Erro!" }),
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
