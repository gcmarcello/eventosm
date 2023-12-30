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
import { Text } from "../../_shared/components/Text";

export default function GeneralDetailsSection() {
  return (
    <Fieldset>
      <Legend>Informações Gerais</Legend>
      <Text>Dados utilizados para o cadastro pessoal.</Text>
      <FieldGroup className="divide-y divide-zinc-700">
        <div>
          <Field className="space-y-3">
            <Label>Nome Completo</Label>
            <Input name="fullName" />
            <ErrorMessage>Nome Inválido</ErrorMessage>
          </Field>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Field className="col-span-full my-2 space-y-3 lg:col-span-1">
              <Label>Celular</Label>
              <Input name="phone" placeholder="(99) 99999-9999" />
              <ErrorMessage>Telefone Inválido</ErrorMessage>
            </Field>
            <Field className="col-span-full my-2 space-y-3 lg:col-span-1">
              <Label>Email</Label>
              <Input name="email" />
              {/* <ErrorMessage>Email Inválido</ErrorMessage> */}
            </Field>
          </div>

          <Field className="my-2 space-y-3">
            <Label>Documento</Label>
            <Input name="document" />
            {/* <ErrorMessage>Documento Inválido</ErrorMessage> */}
            <Description>Aceitamos CPF, Passaporte ou RNE</Description>
          </Field>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Field className="my-2 space-y-3">
              <Label>Senha</Label>
              <Input name="password" />
              {/* <ErrorMessage>Documento Inválido</ErrorMessage> */}
            </Field>

            <Field className="my-2 space-y-3">
              <Label>Confirmar Senha</Label>
              <Input name="password" />
              {/* <ErrorMessage>Documento Inválido</ErrorMessage> */}
            </Field>
          </div>
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
