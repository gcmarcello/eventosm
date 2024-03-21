import { SignupDto, signupDto } from "@/app/api/auth/dto";
import { readAddressFromZipCode } from "@/app/api/geo/action";
import { State } from "@prisma/client";
import { Text } from "odinkit";

import {
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
  showToast,
  useAction,
  useFormContext,
} from "odinkit/client";
import { useMemo, useState } from "react";

export default function PersonalDetailSections({
  states,
}: {
  states: State[];
}) {
  const form = useFormContext<SignupDto>();
  const Field = useMemo(() => form.createField(), []);
  const [addressMode, setAddressMode] = useState<"edit" | "show" | null>(null);

  const {
    trigger: findCep,
    isMutating: loadingCep,
    data: viaCEPInfo,
    reset,
  } = useAction({
    action: readAddressFromZipCode,
    onSuccess: ({ data }) => {
      form.resetField("info.number");
      form.resetField("info.complement");
      if (!data || !data.city.id || !data.state.id) throw "CEP Inválido!";
      form.setValue("info.address", data.address);
      form.setValue("info.cityId", data.city.id);
      form.setValue("info.stateId", data.state.id);
      form.trigger();
      setAddressMode("show");
      setTimeout(() => {
        scrollTo({ top: 10000, behavior: "smooth" });
      }, 500);
    },
    onError: (error) => {
      form.resetField("info.address");
      form.resetField("info.cityId");
      form.resetField("info.stateId");
      reset();
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro",
      });
    },
  });

  return (
    <Fieldset>
      <Legend>Informações Pessoais</Legend>
      <Text>
        Coletamos esses dados para personalizar sua experiência ao se inscrever
        em nossos eventos.
      </Text>
      <FieldGroup className="">
        <div className="grid-cols-5 justify-center gap-4 lg:grid">
          <div className="col-span-3">
            <Field name="info.birthDate" className="my-2 ">
              <Label>Data de Nascimento</Label>
              <Input
                inputMode="numeric"
                mask={"99/99/9999"}
                placeholder="DD/MM/AAAA"
              />
              <ErrorMessage />
            </Field>
          </div>
          <div className="col-span-2">
            <Field name="info.gender" className="my-2 ">
              <Label>Sexo</Label>
              <Select
                displayValueKey="name"
                data={[
                  { id: "female", name: "Feminino" },
                  { id: "male", name: "Masculino" },
                ]}
              ></Select>
              <ErrorMessage />
            </Field>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-5 justify-center gap-4">
            <div className="col-span-5">
              <Field
                disabled={loadingCep}
                name="info.zipCode"
                className="my-2 space-y-3"
              >
                <Label>CEP</Label>
                <Input
                  inputMode="numeric"
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
          {addressMode === "edit" && (
            <>
              <div className="col-span-5">
                <Field
                  disabled={loadingCep}
                  name="info.address"
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
                    name="info.cityId"
                    className="my-2 space-y-2"
                  >
                    <Label>Cidade</Label>
                    <Input placeholder="Rua X." />
                    <ErrorMessage>CEP Inválido</ErrorMessage>
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field
                    disabled={loadingCep}
                    name="info.stateId"
                    className="my-2 space-y-3"
                  >
                    <Label>Estado</Label>
                    <Select
                      data={states}
                      displayValueKey="uf"
                      defaultValue={""}
                    />
                    <ErrorMessage>CEP Inválido</ErrorMessage>
                  </Field>
                </div>
              </div>
            </>
          )}

          {addressMode === "show" && viaCEPInfo.city && (
            <dl className="mb-1 divide-y divide-gray-100">
              <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                <dt className=" font-medium leading-6 text-gray-900">
                  Endereço
                </dt>
                <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {form.getValues("info.address")}
                </dd>
              </div>
              <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:py-4">
                <dt className=" font-medium leading-6 text-gray-900">Cidade</dt>
                <dd className="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {viaCEPInfo.city.name} - {viaCEPInfo.state.name}
                </dd>
              </div>
            </dl>
          )}
          {addressMode && (
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3">
                <Field
                  disabled={loadingCep}
                  name="info.number"
                  className="my-2 space-y-3"
                >
                  <Label>Número</Label>
                  <Input placeholder="Rua X." />
                  <ErrorMessage>CEP Inválido</ErrorMessage>
                </Field>
              </div>
              <div className="col-span-2">
                <Field
                  disabled={loadingCep}
                  name="info.complement"
                  className="my-2 space-y-3"
                >
                  <Label>Complemento</Label>
                  <Input placeholder="Rua X." />
                  <ErrorMessage>CEP Inválido</ErrorMessage>
                </Field>
              </div>
            </div>
          )}
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
