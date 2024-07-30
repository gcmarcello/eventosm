import { UpsertEventDto } from "@/app/api/events/dto";
import { readEventModalities } from "@/app/api/modalities/action";
import { ModalityCategory } from "@prisma/client";
import { Alertbox, For, Heading } from "odinkit";
import {
  Alert,
  Button,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  FieldGroup,
  Fieldset,
  Input,
  Label,
  Switch,
  useAction,
  useFormContext,
} from "odinkit/client";
import { EventWithRegistrationCount } from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import CategoryModalityOptions from "./CategoryModalityOptions";

export function EventTeamModalitiesDialog({
  event,
}: {
  event: EventWithRegistrationCount;
}) {
  let [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ModalityCategory[]>([]);
  const form = useFormContext<UpsertEventDto>();
  const { fields } = useFieldArray({
    control: form.control,
    name: "options.rules.modalities",
  });

  const Field = useMemo(() => form.createField(), []);

  const { data, trigger } = useAction({ action: readEventModalities });

  useEffect(() => {
    async function fetchData() {
      trigger(event.id);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !data.length) return;
    setCategories(data.flatMap((mod) => mod.modalityCategory));
  }, [data]);

  function handleClose() {
    if (form.formState.errors.options?.rules?.modalities) return;
    setIsOpen(false);
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Opções de Modalidade
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Opções de Modalidade</DialogTitle>
        <DialogDescription>
          Controle as categorias disponíveis ou obrigatórias para inscrição em
          equipe para cada modalidade.
        </DialogDescription>
        {form.formState.errors?.options?.rules?.modalities && (
          <Alertbox className="my-3" type="error">
            Alguma modalidade possui categorias duplicadas.
          </Alertbox>
        )}
        <DialogBody>
          <div className="my-2">
            {fields.map((field, index) => (
              <Fieldset key={field.id}>
                <FieldGroup>
                  <Heading>
                    {data?.find((mod) => mod.id === field.modId)?.name || null}
                  </Heading>
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <Field name={`options.rules.modalities.${index}.teamSize`}>
                      <Label>Tamanho da Equipe</Label>
                      <Input type="number" min={1} />
                    </Field>

                    <Field
                      name={`options.rules.modalities.${index}.enableCategoryControl`}
                      variant="switch"
                    >
                      <Label>Controlar Categorias</Label>
                      <Switch color="dark" />
                    </Field>
                  </div>
                </FieldGroup>
                {form.watch(
                  `options.rules.modalities.${index}.enableCategoryControl`
                ) && (
                  <CategoryModalityOptions
                    catIndex={index}
                    categories={categories.filter(
                      (cat) => cat.eventModalityId === field.modId
                    )}
                  />
                )}
              </Fieldset>
            ))}
          </div>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => handleClose()}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
