import { SignupDto } from "@/app/api/auth/dto";
import {
  FieldGroup,
  ErrorMessage,
  Fieldset,
  Legend,
  createField,
  Label,
} from "../../_shared/components/Form/Form";
import { Input } from "../../_shared/components/Form/Input";
import { Select } from "../../_shared/components/Form/Select";
import { Text } from "../../_shared/components/Text";
import { useAction } from "../../_shared/hooks/useAction";
import { readAddressFromZipCode } from "@/app/api/geo/action";
import { showToast } from "../../_shared/components/Toast";
import { useFormContext } from "react-hook-form";

const Field = createField<SignupDto>();

export default function PersonalDetailSections() {
  const form = useFormContext();
  const { trigger: findCep, isMutating: loadingCep } = useAction({
    action: readAddressFromZipCode,
    onSuccess: (data) => {
      form.resetField("step2.info.number");
      form.resetField("step2.info.complement");
      form.setValue("step2.info.address", data.data.address);
      form.setValue("step2.info.cityId", data.data.city.name);
      form.setValue("step2.info.stateId", data.data.state.name);
      form.trigger();
    },
    onError: (error) => {
      console.log(error);
      showToast({ message: "Erro inesperado", variant: "error", title: "Erro" });
    },
  });

  return (
    <Fieldset>
      <Legend>Informações Pessoais</Legend>
      <Text>
        Coletamos esses dados para personalizar sua experiência ao se inscrever em nossos
        eventos.
      </Text>
      <FieldGroup className="space-y-4 divide-y divide-zinc-700">
        <div className="grid-cols-5 justify-center gap-4 lg:grid">
          <div className="col-span-3">
            <Field name="step2.info.birthDate" className="my-2 ">
              <Label>Data de Nascimento</Label>
              <Input mask={"99/99/9999"} placeholder="DD/MM/AAAA" />
              <ErrorMessage />
            </Field>
          </div>
          <div className="col-span-2">
            <Field name="step2.info.gender" className="my-2 ">
              <Label>Sexo</Label>
              <Select defaultValue={""}>
                <option value="" disabled>
                  Selecione
                </option>
                <option value="female">Feminino</option>
                <option value="male">Masculino</option>
              </Select>
              <ErrorMessage />
            </Field>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-5 justify-center gap-4">
            <div className="col-span-5">
              <Field
                disabled={loadingCep}
                name="step2.info.zipCode"
                className="my-2 space-y-3"
              >
                <Label>CEP</Label>
                <Input
                  mask={"99999-999"}
                  loading={loadingCep}
                  onChange={(e) => {
                    if (e.target.value.length === 9) {
                      findCep({ zipCode: e.target.value });
                    }
                  }}
                  placeholder="99999-999"
                />

                <ErrorMessage />
              </Field>
            </div>
          </div>
          <div className="col-span-5">
            <Field
              disabled={loadingCep}
              name="step2.info.address"
              className="my-2 space-y-3"
            >
              <Label>Endereço</Label>
              <Input placeholder="Rua X." />
              <ErrorMessage />
            </Field>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <Field
                disabled={loadingCep}
                name="step2.info.cityId"
                className="my-2 space-y-2"
              >
                <Label>Cidade</Label>
                <Input placeholder="Rua X." />
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
            <div className="col-span-2">
              <Field
                disabled={loadingCep}
                name="step2.info.stateId"
                className="my-2 space-y-3"
              >
                <Label>Estado</Label>
                <Select defaultValue={""}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="female">SP</option>
                </Select>
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <Field
                disabled={loadingCep}
                name="step2.info.number"
                className="my-2 space-y-3"
              >
                <Label>Número</Label>
                <Input placeholder="Rua X." />
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
            <div className="col-span-2">
              <Field
                disabled={loadingCep}
                name="step2.info.complement"
                className="my-2 space-y-3"
              >
                <Label>Complemento</Label>
                <Input placeholder="Rua X." />
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
          </div>
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
