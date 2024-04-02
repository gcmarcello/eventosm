"use client";
import { updateOrganization } from "@/app/api/orgs/action";
import { upsertOrganizationDto } from "@/app/api/orgs/dto";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
import { SubmitButton, Text, formatPhone } from "odinkit";
import {
  FieldGroup,
  ErrorMessage,
  Legend,
  useFormContext,
  Fieldset,
  Label,
  Input,
  Description,
  useForm,
  useAction,
  showToast,
  Form,
} from "odinkit/client";
import { useMemo } from "react";

export default function GeneralInfoSection({
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
  const Field = useMemo(() => form.createField(), []);

  return (
    <Form
      hform={form}
      onSubmit={(data) => {
        updateTrigger(data);
      }}
      className="space-y-3 pb-20 lg:pb-10"
    >
      <Fieldset className=" grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4">
        <FieldGroup className="col-span-2">
          <Legend className="col-span-2 lg:col-span-1">Detalhes Gerais</Legend>
          <Text className="col-span-2 lg:col-span-1">
            Informações principais da organização.
          </Text>
        </FieldGroup>
        <Field className="col-span-2 lg:col-span-1" name="name">
          <Label>Nome da Organização</Label>
          <Input />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1 " name="document">
          <Label>CNPJ</Label>
          <Input mask={"99.999.999/9999-99"} />
          <Text className="flex gap-1">
            <InformationCircleIcon className="h-5 w-5" /> O CNPJ é opcional
          </Text>
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="email">
          <Label>Email da Organização</Label>
          <Input />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="phone">
          <Label>Telefone da Organização</Label>
          <Input
            mask={(fieldValue: string) => {
              if (fieldValue.length > 14) {
                return "(99) 99999-9999";
              } else {
                return "(99) 9999-9999";
              }
            }}
          />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="slug">
          <Label>Link do perfil</Label>
          <Input />
          <Description className="flex gap-1">
            Letras minúsculas, números e hífens.
          </Description>
          <Text className="text-wrap italic">
            {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/org/
            {form.watch("slug") || "exemplo"}
          </Text>
          <ErrorMessage />
        </Field>
      </Fieldset>

      <SubmitButton>Salvar</SubmitButton>
    </Form>
  );
}
