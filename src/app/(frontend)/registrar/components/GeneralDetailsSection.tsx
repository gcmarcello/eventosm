"use client";
import { signupDto } from "@/app/api/auth/dto";
import { Text } from "../../../../packages/odinkit/components/Text";
import { useFormContext } from "react-hook-form";
import {
  createField,
  FieldGroup,
  ErrorMessage,
  Legend,
  Description,
  Fieldset,
  Input,
  Label,
  Switch,
} from "odinkit";

const Field = createField({ zodObject: signupDto, enableAsterisk: true });

export default function GeneralDetailsSection() {
  const { getValues, setValue, watch, resetField } = useFormContext();

  return (
    <Fieldset>
      <Legend>Informações Gerais</Legend>
      <Text>Dados utilizados para o cadastro pessoal.</Text>
      <FieldGroup className="divide-y divide-zinc-700">
        <div>
          <Field name="step1.fullName" className="space-y-3">
            <Label>Nome Completo</Label>
            <Input />
            <ErrorMessage />
          </Field>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-0 lg:gap-4">
            <Field
              name="step1.phone"
              className="col-span-full my-2 space-y-3 lg:col-span-1"
            >
              <Label>Celular</Label>
              <Input
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
              name="step1.email"
              className="col-span-full my-2 space-y-3 lg:col-span-1"
            >
              <Label>Email</Label>
              <Input />
              <ErrorMessage />
            </Field>
          </div>
          <div>
            <Field name="step1.document.value" className="my-2 space-y-3">
              <Label>
                Documento{" "}
                {watch("step1.document.foreigner") ? "(Passaporte ou RNE)" : "(CPF)"}
              </Label>
              <Input
                mask={() => {
                  if (getValues("step1.document.foreigner")) return null;
                  return "999.999.999-99";
                }}
              />
              <ErrorMessage />
            </Field>
            <Field name="step1.document.foreigner">
              <Switch
                onChange={() => {
                  setValue(
                    "step1.document.foreigner",
                    !getValues("step1.document.foreigner")
                  );
                  resetField("step1.document.value");
                }}
              >
                {({ checked }) => (
                  <Description>
                    {checked ? (
                      <>
                        <span className="underline">Clique aqui</span> para usar seu CPF.
                      </>
                    ) : (
                      <>
                        Estrangeiro? <span className="underline">clique aqui!</span>
                      </>
                    )}
                  </Description>
                )}
              </Switch>
            </Field>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Field name="step1.passwords.password" className="my-2 space-y-3">
              <Label>Senha</Label>
              <Input type="password" />
              <ErrorMessage />
            </Field>

            <Field name="step1.passwords.passwordConfirm" className="my-2 space-y-3">
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
