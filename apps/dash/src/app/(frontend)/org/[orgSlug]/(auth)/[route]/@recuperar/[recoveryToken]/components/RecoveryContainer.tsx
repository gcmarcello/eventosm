"use client";

import { useOrg } from "@/app/(frontend)/org/[orgSlug]/components/OrgStore";
import { createNewPassword } from "@/app/api/auth/recovery/action";
import { createNewPasswordDto } from "@/app/api/auth/recovery/dto";
import { Organization } from "@prisma/client";
import { SubmitButton } from "odinkit";
import {
  Button,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo } from "react";

export function CreateNewPasswordForm({
  token,
  organization,
}: {
  token: string;
  organization: Organization;
}) {
  const form = useForm({
    schema: createNewPasswordDto,
    defaultValues: {
      token,
    },
  });

  const { data, trigger, isMutating } = useAction({
    action: createNewPassword,
    redirect: true,
    onSuccess: () =>
      showToast({
        title: "Sucesso",
        variant: "success",
        message: "Senha alterada com sucesso!",
      }),
    onError: (error) =>
      showToast({
        title: "Erro",
        variant: "error",
        message: error,
      }),
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <div className="mb-4">
        <div className="mt-8 flex items-baseline gap-3">
          <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Recuperar Conta
          </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Você será automaticamente redirecionado para o seu perfil.
        </p>
      </div>
      <Form
        hform={form}
        onSubmit={(data) => trigger(data)}
        className="space-y-6"
      >
        <Fieldset>
          <FieldGroup>
            <Field name="password">
              <Label>Nova Senha</Label>
              <Input type="password" />
            </Field>
            <Field name="confirmPassword">
              <Label>Confirmar Nova Senha</Label>
              <Input type="password" />
              <ErrorMessage />
            </Field>

            <SubmitButton
              className={"w-full"}
              color={organization.options.colors.primaryColor.tw.color}
            >
              Enviar
            </SubmitButton>
          </FieldGroup>
        </Fieldset>
      </Form>
    </>
  );
}
