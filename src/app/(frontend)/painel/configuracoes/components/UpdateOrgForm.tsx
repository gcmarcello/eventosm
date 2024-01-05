"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { Container } from "@/app/(frontend)/_shared/components/Containers";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Legend,
  createField,
} from "@/app/(frontend)/_shared/components/Form/Form";
import { Input } from "@/app/(frontend)/_shared/components/Form/Input";
import { Text } from "@/app/(frontend)/_shared/components/Text";
import { upsertOrganizationDto } from "@/app/api/orgs/dto";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationWithOptions } from "prisma/types/Organization";
import { useForm } from "react-hook-form";

const Field = createField({ zodObject: upsertOrganizationDto, enableAsterisk: true });

export default function UpdateOrgForm({
  organization,
}: {
  organization: OrganizationWithOptions;
}) {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(upsertOrganizationDto),
    defaultValues: {
      name: organization.name,
      document: organization.document,
      email: organization.email,
      phone: organization.phone,
      slug: organization.slug,
    },
  });
  return (
    <div className="rounded-lg border bg-opacity-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <Form
        hform={form}
        onSubmit={(data) => console.log(data)}
        className="px-4 py-4 lg:pb-4"
      >
        <Fieldset>
          <Legend>Editar Organização</Legend>
          <Text>Edite os detalhes da sua organização.</Text>
          <FieldGroup>
            <Field name="name">
              <Label>Nome da Organização</Label>
              <Input />
              <ErrorMessage />
            </Field>
            <Field name="document">
              <Label>CNPJ</Label>
              <Input mask={"99.999.999/9999-99"} />
              <Text className="flex gap-1">
                <InformationCircleIcon className="h-5 w-5" /> O CNPJ é opcional
              </Text>
              <ErrorMessage />
            </Field>
            <Field name="email">
              <Label>Email da Organização</Label>
              <Input />
              <ErrorMessage />
            </Field>
            <Field name="phone">
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
            <Field name="slug">
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
        {/* <Button
          disabled={!form.formState.isValid}
          type="submit"
          color="lime"
          className="mt-6 w-full"
        >
          <span className="px-4">Criar Organização</span>
        </Button> */}
      </Form>
    </div>
  );
}
