import {
  FieldGroup,
  ErrorMessage,
  Fieldset,
  Legend,
  Field,
  Label,
  Description,
} from "../../_shared/components/Fieldset";
import { Input } from "../../_shared/components/Input";
import { Link } from "../../_shared/components/Link";
import { Select } from "../../_shared/components/Select";
import { Text } from "../../_shared/components/Text";

export default function PersonalDetailSections() {
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
            <Field className="my-2 ">
              <Label>Celular</Label>
              <Input name="phone" placeholder="(99) 99999-9999" />
              <ErrorMessage>Sobrenome Inválido</ErrorMessage>
            </Field>
          </div>
          <div className="col-span-2">
            <Field className="my-2 ">
              <Label>Sexo</Label>
              <Select defaultValue={""} name="gender">
                <option value="" disabled>
                  Selecione
                </option>
                <option value="female">Feminino</option>
                <option value="male">Masculino</option>
              </Select>
              {/* <ErrorMessage>Email Inválido</ErrorMessage> */}
            </Field>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-5 justify-center gap-4">
            <div className="col-span-5">
              <Field className="my-2 space-y-3">
                <Label>CEP</Label>
                <Input name="phone" placeholder="99999-999" />

                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>

            <div className="col-span-5 -my-5 mb-4">
              <Field>
                <Description>
                  Não sabe seu CEP?{" "}
                  <Link href="#" className="underline">
                    Clique aqui
                  </Link>
                </Description>
              </Field>
            </div>
          </div>
          <div className="col-span-5">
            <Field className="my-2 space-y-3">
              <Label>Endereço</Label>
              <Input name="address" placeholder="Rua X." />
              {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
            </Field>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <Field className="my-2 space-y-2">
                <Label>Cidade</Label>
                <Input name="address" placeholder="Rua X." />
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
            <div className="col-span-2">
              <Field className="my-2 space-y-3">
                <Label>Estado</Label>
                <Select defaultValue={""} name="state">
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
              <Field className="my-2 space-y-3">
                <Label>Número</Label>
                <Input name="address" placeholder="Rua X." />
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
            <div className="col-span-2">
              <Field className="my-2 space-y-3">
                <Label>Complemento</Label>
                <Input name="complement" placeholder="Rua X." />
                {/* <ErrorMessage>CEP Inválido</ErrorMessage> */}
              </Field>
            </div>
          </div>
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
