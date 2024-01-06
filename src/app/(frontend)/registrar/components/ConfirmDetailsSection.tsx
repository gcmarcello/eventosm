import { Strong, Text } from "odinkit/components/Text";
import { useFormContext } from "react-hook-form";

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
          <Text className="my-1">{form.getValues("step1.fullName")}</Text>
          <Text className="my-1">{form.getValues("step1.email")}</Text>
          <Text className="my-1">{form.getValues("step1.phone")}</Text>
          <Text className="my-1">{form.getValues("step1.document.value")}</Text>
        </div>

        <div className="py-4">
          <Text>
            <Strong>Endereço</Strong>
          </Text>
          <Text className="my-1">
            {form.getValues("step2.info.address")}, {form.getValues("step2.info.number")}
          </Text>
          <Text className="my-1">{form.getValues("step2.info.complement")}</Text>
          <Text className="my-1">
            {form.getValues("step2.info.cityId")}, {form.getValues("step2.info.stateId")}
          </Text>
          <Text className="my-1">CEP: {form.getValues("step2.info.zipCode")}</Text>
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
