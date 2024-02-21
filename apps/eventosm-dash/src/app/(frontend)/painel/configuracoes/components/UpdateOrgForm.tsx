"use client";

import { updateOrganization } from "@/app/api/orgs/action";
import {
  UpsertOrganizationDto,
  upsertOrganizationDto,
} from "@/app/api/orgs/dto";

import { OrganizationWithOptions } from "prisma/types/Organization";
import clsx from "clsx";
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
import { BottomNavigation, Step, Steps, Text } from "odinkit";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import FileImagePreview from "node_modules/odinkit/src/components/Form/File/FileImagePreview";
import { z } from "zod";
import GeneralInfoSection from "./GeneralInfoSection";
import PersonalizationSection from "./PersonalizationSection";

export default function UpdateOrgForm({
  organization,
}: {
  organization: OrganizationWithOptions;
}) {
  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const form = useForm({
    mode: "onChange",
    schema: upsertOrganizationDto.omit({ images: true }).merge(
      z.object({
        images: z
          .object({
            bg: z.array(z.any()).optional(),
            hero: z.array(z.any()).optional(),
            logo: z.array(z.any()).optional(),
          })
          .optional(),
      })
    ),
    defaultValues: {
      name: organization.name,
      document: organization.document,
      email: organization.email,
      phone: organization.phone || undefined,
      slug: organization.slug,
      abbreviation: organization.options?.abbreviation,
      primaryColor: organization.options?.colors.primaryColor || "#fff",
      secondaryColor: organization.options?.colors.secondaryColor || "#fff",
      tertiaryColor: organization.options?.colors.tertiaryColor || "#fff",
    },
  });

  const { trigger: updateTrigger, isMutating: isLoading } = useAction({
    action: updateOrganization,
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

  const {
    colors: { primaryColor },
  } = usePanel();

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
    { title: "Imagens", content: <div>Imagens</div> },
  ];

  const panel = usePanel();

  return (
    <Form
      hform={form}
      onSubmit={async (data) => {
        if (!data.images)
          return updateTrigger({
            ...data,
            images: organization.options?.images,
          });
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

        updateTrigger({
          ...data,
          images: {
            bg: fileUrl.bg?.url || organization.options?.images?.bg,
            hero: fileUrl.hero?.url || organization.options?.images?.hero,
            logo: fileUrl.logo?.url || organization.options?.images?.logo,
          },
        });
      }}
      className="space-y-3 pb-10"
    >
      <Steps
        stepRefs={stepRefs}
        topRef={topRef}
        steps={steps}
        color={primaryColor}
      />
      <div className="flex justify-end">
        <Button type="submit" color={primaryColor}>
          Salvar
        </Button>
      </div>
      <BottomNavigation className="flex justify-end p-2 lg:hidden">
        <Button type="submit" color={primaryColor}>
          Salvar
        </Button>
      </BottomNavigation>
    </Form>
  );
}
