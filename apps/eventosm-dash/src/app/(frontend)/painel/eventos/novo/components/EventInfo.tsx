import {
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Input,
  Label,
  Textarea,
} from "odinkit/client";

export default function EventInfo({ Field }: { Field: any }) {
  return (
    <Fieldset className=" rounded-lg bg-opacity-50 px-4 lg:pb-4">
      <FieldGroup className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field className="col-span-2 lg:col-span-1" name="name">
          <Label>Nome do Evento</Label>
          <Input placeholder="10 KM da Rua 3" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="location">
          <Label>Local</Label>
          <Input placeholder="Rua 3" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="dateStart">
          <Label>Início do Evento</Label>
          <Input mask={"99/99/9999"} placeholder="01/01/2024" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="dateEnd">
          <Label>Término do Evento</Label>
          <Input mask={"99/99/9999"} placeholder="02/01/2024" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="description">
          <Label>Descrição do Evento</Label>
          <Textarea placeholder="Informações gerais do evento, aparecerão em destaque na página." />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="slug">
          <Label>Link do perfil</Label>
          <Input
            placeholder={
              process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1] + "/org/exemplo"
            }
          />

          <ErrorMessage />
        </Field>
      </FieldGroup>
    </Fieldset>
  );
}
