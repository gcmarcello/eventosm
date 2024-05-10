"use client";
import { Text } from "odinkit";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
  useFormContext,
} from "odinkit/client";
import { Input } from "odinkit/client";
import { Switch } from "@headlessui/react";
import { useMemo } from "react";
import { SignupDto } from "@/app/api/auth/dto";

export default function GeneralDetailsSection() {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), []);
  return (
    <Fieldset>
      <Legend>Informações Gerais</Legend>
      <Text>Dados utilizados para o cadastro pessoal.</Text>
      <FieldGroup>
        <div>
          <Field name="fullName" className="space-y-3">
            <Label>Nome Completo</Label>
            <Input />
            <ErrorMessage />
          </Field>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-0 lg:gap-4">
            <Field
              name="phone"
              className="col-span-full my-2 space-y-3 lg:col-span-1"
            >
              <Label>Celular</Label>
              <Input
                inputMode="tel"
                placeholder="(99) 99999-9999"
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
            <Field
              name="email"
              className="col-span-full my-2 space-y-3 lg:col-span-1"
            >
              <Label>Email</Label>
              <Input />
              <ErrorMessage />
            </Field>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Field name="passwords.password" className="my-2 space-y-3">
              <Label>Senha</Label>
              <Input type="password" />
              <ErrorMessage />
            </Field>

            <Field name="passwords.passwordConfirm" className="my-2 space-y-3">
              <Label>Confirmar Senha</Label>
              <Input type="password" />
              <ErrorMessage />
            </Field>
          </div>
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
