"use client";
import { useForm } from "react-hook-form";
import { Container } from "../../_shared/components/Containers";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Legend,
  createField,
} from "../../_shared/components/Form/Form";
import { Text } from "../../_shared/components/Text";
import { createOrganizationDto } from "@/app/api/orgs/dto";
import { Input } from "../../_shared/components/Form/Input";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";

const Field = createField({ zodObject: createOrganizationDto, enableAsterisk: true });

export default function NewOrganizationPage() {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(createOrganizationDto),
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="col-span-full lg:col-span-2 lg:col-start-2">
        <Container className="mx-4 mb-20 mt-4 lg:col-start-2 lg:mb-10">
          <Form
            hform={form}
            onSubmit={(data) => console.log(data)}
            className="px-4 py-4 lg:pb-4"
          >
            <Fieldset>
              <Legend>Criar Organização</Legend>
              <Text>
                Apenas informações básicas, você pode adicionar detalhes mais tarde.
              </Text>
              <FieldGroup>
                <Field name="name">
                  <Label>Nome da Organização</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="document">
                  <Label>CNPJ</Label>
                  <Input mask={"99.999.999/9999-99"} />
                  <Text className="flex gap-1">
                    <InformationCircleIcon className="h-5 w-5" /> O CNPJ é opcional
                  </Text>
                  <ErrorMessage />
                </Field>
                <Field name="email">
                  <Label>Email da Organização</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="phone">
                  <Label>Telefone da Organização</Label>
                  <Input
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
                <Field name="slug">
                  <Label>Link do perfil</Label>
                  <Input />
                  <Description className="flex gap-1">
                    Apenas letras minúsculas, números e hífens.
                  </Description>
                  <ErrorMessage />
                </Field>
              </FieldGroup>
            </Fieldset>
          </Form>
        </Container>
      </div>
    </div>
  );
}
