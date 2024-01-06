"use client";

import { UpsertOrganizationDto, upsertOrganizationDto } from "@/app/api/orgs/dto";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "odinkit/components/Button";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Legend,
  createField,
} from "odinkit/components/Form/Form";
import { ColorInput, Input } from "odinkit/components/Form/Input";
import { Text } from "odinkit/components/Text";

import { OrganizationWithOptions } from "prisma/types/Organization";
import { useForm } from "react-hook-form";

const Field = createField({ zodObject: upsertOrganizationDto, enableAsterisk: true });

export default function UpdateOrgForm({
  organization,
}: {
  organization: OrganizationWithOptions;
}) {
  const form = useForm<UpsertOrganizationDto>({
    mode: "onChange",
    resolver: zodResolver(upsertOrganizationDto),
    defaultValues: {
      name: organization.name,
      document: organization.document,
      email: organization.email,
      phone: organization.phone || undefined,
      slug: organization.slug,
    },
  });

  return (
    <Form hform={form} onSubmit={(data) => console.log(data)} className="space-y-3 pb-10">
      <div className="flex items-center justify-between px-1">
        <Text className="font-semibold">Configurações</Text>
        <Button
          disabled={!form.formState.isValid}
          type="submit"
          color="lime"
          className="my-2"
        >
          <span className="px-4">Salvar</span>
        </Button>
      </div>
      <Fieldset className=" rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4 dark:border-zinc-700 dark:bg-zinc-900">
        <Legend>Detalhes Gerais</Legend>
        <Text>Informações principais da organização.</Text>
        <FieldGroup className="grid grid-cols-2 gap-x-4 gap-y-4">
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
        </FieldGroup>
      </Fieldset>
      <Fieldset className=" rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4 dark:border-zinc-700 dark:bg-zinc-900">
        <Legend>Outras Configurações</Legend>
        <Text>Informações secundárias.</Text>
        <FieldGroup className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Field className="col-span-2 lg:col-span-1" name="options.abbreviation">
            <Label>Abreviação</Label>
            <Input placeholder="Ex: ESM para EventoSM" />
            <ErrorMessage />
            <Description className="flex gap-1">
              Usada em telas pequenas e locais diversos.
            </Description>
          </Field>
          <Field className="col-span-2 lg:col-span-1 " name="document">
            <Label>CNPJ</Label>
            <Input mask={"99.999.999/9999-99"} />
            <Text className="flex gap-1">
              <InformationCircleIcon className="h-5 w-5" /> O CNPJ é opcional
            </Text>
            <ErrorMessage />
          </Field>
          <Field className="col-span-1" name="options.primaryColor">
            <Label>Cor Principal</Label>
            <ColorInput />
            <ErrorMessage />
          </Field>
          <Field className="col-span-1" name="options.secondaryColor">
            <Label>Cor Secundária</Label>
            <ColorInput />
            <ErrorMessage />
          </Field>
        </FieldGroup>
      </Fieldset>
    </Form>
  );
}
