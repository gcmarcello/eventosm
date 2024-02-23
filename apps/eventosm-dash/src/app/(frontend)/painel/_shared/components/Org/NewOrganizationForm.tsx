"use client";

import { createOrganization } from "@/app/api/orgs/action";
import {
  UpsertOrganizationDto,
  upsertOrganizationDto,
} from "@/app/api/orgs/dto";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Text, formatPhone } from "odinkit";
import {
  Button,
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Legend,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";

import { UserWithoutPassword } from "prisma/types/User";
import { useMemo } from "react";

export default function NewOrganizationForm({
  user,
}: {
  user: UserWithoutPassword;
}) {
  const form = useForm<UpsertOrganizationDto>({
    mode: "onChange",
    schema: upsertOrganizationDto,
    defaultValues: {
      document: "",
      email: user?.email || "",
      name: "",
      phone: user?.phone ? formatPhone(user?.phone) : "",
    },
  });

  const Field = useMemo(() => form.createField(), []);

  const { trigger: newOrgTrigger, isMutating: isLoading } = useAction({
    action: createOrganization,
    redirect: true,
    onSuccess: () =>
      showToast({
        message: "Organização criada com sucesso.",
        variant: "success",
        title: "Sucesso!",
      }),
    onError: (error) => {
      showToast({ message: error, variant: "error", title: "Erro" });
      /* form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      }); */
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="col-span-full lg:col-span-2 lg:col-start-2">
        <Container className="mx-4 mb-20 mt-4 lg:col-start-2 lg:mb-10">
          <Form
            hform={form}
            onSubmit={(data) => newOrgTrigger(data)}
            className=" px-4 py-4 lg:pb-4"
          >
            <Fieldset>
              <Legend>Criar Organização</Legend>
              <Text>
                Apenas informações básicas, você pode adicionar detalhes mais
                tarde.
              </Text>
              <FieldGroup className={"space-y-4"}>
                <Field name="name">
                  <Label>Nome da Organização</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="document">
                  <Label>CNPJ</Label>
                  <Input mask={"99.999.999/9999-99"} />
                  <Text className="flex gap-1">
                    <InformationCircleIcon className="h-5 w-5" /> O CNPJ é
                    opcional
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
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              color="indigo"
              className="mt-6 w-full"
              loading={isLoading}
            >
              Criar Organização
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}
