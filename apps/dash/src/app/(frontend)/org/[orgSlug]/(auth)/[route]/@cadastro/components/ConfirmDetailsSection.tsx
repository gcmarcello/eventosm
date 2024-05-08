import { SignupDto } from "@/app/api/auth/dto";
import { Organization } from "@prisma/client";
import { Strong, Text } from "odinkit";
import {
  Checkbox,
  Description,
  ErrorMessage,
  Label,
  showToast,
  useFormContext,
} from "odinkit/client";
import { useMemo } from "react";

export default function ConfirmDetailsSection({
  organization,
}: {
  organization: Organization;
}) {
  const form = useFormContext<SignupDto>();
  const Field = useMemo(() => form.createField(), []);
  return (
    <>
      <Text>
        <Strong>Confirme seus Dados</Strong>
      </Text>
      <Text>Quase lá! Confirme seus dados para finalizar o cadastro. </Text>

      <div className="divide-y">
        <div className="my-4">
          <Text>
            <Strong>Informações de Cadastro</Strong>
          </Text>
          <Text className="my-1 text-xs">{form.getValues("fullName")}</Text>
          <Text className="my-1 text-xs">
            {form.getValues("email").toLocaleLowerCase()}
          </Text>
          <Text className="my-1 text-xs">{form.getValues("phone")}</Text>
          <Text className="my-1 text-xs">
            CPF/Documento: {form.getValues("document") as string}
          </Text>
          <Text className="my-1 text-xs">
            Data de Nascimento: {form.getValues("info.birthDate") as string}
          </Text>
        </div>

        <div className="py-4">
          <Text>
            <Strong>Endereço</Strong>
          </Text>
          <Text className="my-1 text-xs">
            {form.getValues("info.address")}, {form.getValues("info.number")}
          </Text>
          <Text className="my-1 text-xs">
            {form.getValues("info.complement")}
          </Text>
          <Text className="my-1 text-xs">
            {form.getValues("info.cityId")}, {form.getValues("info.stateId")}
          </Text>
          <Text className="my-1 text-xs">
            CEP: {form.getValues("info.zipCode")}
          </Text>
        </div>
        <div>
          {/* <Text className="py-4">
            {form.getValues("eventRedirect.name") && (
              <>
                <span>Você será redirecionado para a inscrição do </span>
                <span className="text-violet-500 underline">
                  {form.getValues("eventRedirect.name")}
                </span>
              </>
            )}
          </Text> */}
          <Field name="acceptTerms" className={"py-4"}>
            <Checkbox
              color={organization.options.colors.primaryColor.tw.color}
            />
            <Label className={"ms-3"}>
              Eu entendo que isto não é uma inscrição.
            </Label>
            <ErrorMessage />
            <Description>
              Este é apenas um cadastro. Inscrições são realizadas
              separadamente, evento a evento.
            </Description>
          </Field>
        </div>
      </div>
    </>
  );
}
