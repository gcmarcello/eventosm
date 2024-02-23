import { Strong, Text } from "odinkit";
import { useFormContext } from "odinkit/client";

export default function ConfirmDetailsSection() {
  const form = useFormContext();
  return (
    <>
      <Text>
        <Strong>Confirme seus Dados</Strong>
      </Text>
      <Text>Quase lá! Confirme seus dados para finalizar o cadastro. </Text>

      <div className="divide-y divide-zinc-700">
        <div className="my-4">
          <Text>
            <Strong>Contato</Strong>
          </Text>
          <Text className="my-1">{form.getValues("fullName")}</Text>
          <Text className="my-1">{form.getValues("email")}</Text>
          <Text className="my-1">{form.getValues("phone")}</Text>
          <Text className="my-1">{form.getValues("document.value")}</Text>
        </div>

        <div className="py-4">
          <Text>
            <Strong>Endereço</Strong>
          </Text>
          <Text className="my-1">
            {form.getValues("info.address")}, {form.getValues("info.number")}
          </Text>
          <Text className="my-1">{form.getValues("info.complement")}</Text>
          <Text className="my-1">
            {form.getValues("info.cityId")}, {form.getValues("info.stateId")}
          </Text>
          <Text className="my-1">CEP: {form.getValues("info.zipCode")}</Text>
        </div>
        <Text className="py-4">
          {form.getValues("eventRedirect") && (
            <>
              <span>Você será redirecionado para a inscrição do </span>
              <span className="text-violet-500 underline">
                {form.getValues("eventRedirect.name")}
              </span>
            </>
          )}
        </Text>
      </div>
    </>
  );
}
