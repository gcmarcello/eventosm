"use client";

import { updateOrganization } from "@/app/api/orgs/action";
import { upsertOrganizationDto } from "@/app/api/orgs/dto";

import { Form, showToast, useAction, useForm } from "odinkit/client";
import { BottomNavigation, SubmitButton, formatPhone } from "odinkit";

import { Organization } from "@prisma/client";

export default function UpdateOrgForm({
  organization,
}: {
  organization: Organization;
}) {
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

  return (
    <Form
      hform={form}
      onSubmit={(data) => {
        updateTrigger(data);
      }}
      className="space-y-3 pb-20 lg:pb-10"
    >
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
