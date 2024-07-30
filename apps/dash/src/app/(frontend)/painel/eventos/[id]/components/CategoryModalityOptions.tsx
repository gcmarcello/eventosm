import { UpsertEventDto } from "@/app/api/events/dto";
import { ModalityCategory } from "@prisma/client";
import { Alertbox } from "odinkit";
import {
  Button,
  FieldGroup,
  Input,
  Label,
  Select,
  useFormContext,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

export default function CategoryModalityOptions({
  catIndex,
  categories,
}: {
  categories: ModalityCategory[];
  catIndex: number;
}) {
  const form = useFormContext<UpsertEventDto>();
  const [selectableCategories, setSelectableCategories] =
    useState<ModalityCategory[]>(categories);
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: `options.rules.modalities.${catIndex}.requiredCategories`,
  });

  const Field = useMemo(() => form.createField(), []);

  function evaluateCategoryAvailability(catId: string) {
    const pickedCategories =
      form
        .watch(`options.rules.modalities.${catIndex}.requiredCategories`)
        ?.flatMap((cat) => cat.id) ?? [];

    return !pickedCategories.includes(catId);
  }

  return (
    <>
      <Button
        onClick={() =>
          append({
            id: "",
            number: 0,
          })
        }
      >
        Adicionar categoria
      </Button>
      {fields.map((field, index) => (
        <FieldGroup key={field.id}>
          <hr className="mt-2 pb-2" />

          <Field
            name={`options.rules.modalities.${catIndex}.requiredCategories.${index}.id`}
          >
            <Label>Categoria</Label>

            <Select
              data={selectableCategories.map((cat) => ({
                ...cat,
                disabled: !evaluateCategoryAvailability(cat.id),
              }))}
              displayValueKey="name"
            />
          </Field>
          <div className="flex items-end justify-between gap-4">
            <Field
              name={`options.rules.modalities.${catIndex}.requiredCategories.${index}.number`}
            >
              <Label>Mínimo de Participantes</Label>
              <Input type="number" />
            </Field>
            <Button
              className={"mb-1 mt-auto grow"}
              onClick={() => remove(index)}
              color="red"
            >
              Remover
            </Button>
          </div>
        </FieldGroup>
      ))}
    </>
  );
}
