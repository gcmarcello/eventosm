import { UpsertEventDto } from "@/app/api/events/dto";

import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Label,
  Select,
  Textarea,
} from "odinkit/client";

export default function SportInfo({ Field }: { Field: any }) {
  return (
    <Fieldset className=" rounded-lg bg-opacity-50 px-4 pb-4 lg:pb-4">
      <FieldGroup className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field className="col-span-2 lg:col-span-1" name="rules">
          <Label>Regulamento do Evento</Label>
          <Textarea placeholder="Regras do evento, aparecerão na página principal e durante a inscrição." />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="rules">
          <Label>Detalhes do Evento</Label>
          <Textarea placeholder="Detalhes do evento" />
          <ErrorMessage />
        </Field>
      </FieldGroup>
    </Fieldset>
  );
}
