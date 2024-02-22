import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
import FileImagePreview from "node_modules/odinkit/src/components/Form/File/FileImagePreview";
import { Text } from "odinkit";
import {
  ColorInput,
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Input,
  Label,
  Legend,
  showToast,
  useFormContext,
} from "odinkit/client";
import { useMemo } from "react";

export default function PersonalizationSection({
  organization,
}: {
  organization: Organization;
}) {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), []);
  return (
    <Fieldset className=" grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4">
      <FieldGroup className="col-span-2">
        <Legend>Outras Configurações</Legend>
        <Text>Informações secundárias.</Text>
      </FieldGroup>
      <FieldGroup className="space-y-2">
        <Field name="primaryColor">
          <Label>Cor Primária</Label>
          <ColorInput />
          <Description className="flex gap-1">
            Usada na barra do painel e menus da organização.
          </Description>
        </Field>
        <Field name="secondaryColor">
          <Label>Cor Primária</Label>
          <ColorInput />
          <Description className="flex gap-1">
            Usada no rodapé dos menus da organização e botões públicos.
          </Description>
        </Field>
        <Field name="tertiaryColor">
          <Label>Cor Primária</Label>
          <ColorInput />
          <Description className="flex gap-1">
            Usada em botões e outras áreas.
          </Description>
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field className="col-span-2 lg:col-span-1" name="abbreviation">
          <Label>Abreviação</Label>
          <Input placeholder="Ex: ESM para EventoSM" />
          <ErrorMessage />
          <Description className="flex gap-1">
            Usada em telas pequenas e locais diversos.
          </Description>
        </Field>
      </FieldGroup>
    </Fieldset>
  );
}
