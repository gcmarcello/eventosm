import { UpsertRegistrationBatchDto } from "@/app/api/batches/dto";

import clsx from "clsx";
import { Alertbox, For, SubmitButton, Text } from "odinkit";
import {
  DialogBody,
  FieldGroup,
  ErrorMessage,
  DialogActions,
  Form,
  Dialog,
  DialogTitle,
  DialogDescription,
  Label,
  Switch,
  Fieldset,
  Input,
  Description,
  Button,
  DisclosureAccordion,
  useFormContext,
  Select,
} from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventModalityWithCategories } from "prisma/types/Events";
import { Dispatch, SetStateAction, useMemo } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { usePanel } from "../../_shared/components/PanelStore";

export default function BatchModal({
  modalState,
  batches,
  modalities,
  isLoading,
}: {
  modalState: {
    setIsBatchModalOpen: Dispatch<SetStateAction<boolean>>;
    isBatchModalOpen: boolean;
    showCategoryBatches: boolean;
    setShowCategoryBatches: Dispatch<SetStateAction<boolean>>;
  };
  isLoading?: boolean;
  batches: EventRegistrationBatchesWithCategoriesAndRegistrations[];
  modalities: EventModalityWithCategories[];
}) {
  const batchForm = useFormContext<UpsertRegistrationBatchDto>();
  const BatchField = useMemo(() => batchForm.createField(), []);

  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: batchForm.control,
      name: "categoryBatch",
    }
  );

  const flatCategoryArray = useMemo(
    () => modalities.flatMap((modality) => modality.modalityCategory),
    [modalities]
  );

  return (
    <Dialog
      size="5xl"
      open={modalState.isBatchModalOpen}
      onClose={modalState.setIsBatchModalOpen}
    >
      <DialogTitle>
        {batchForm.getValues("id")
          ? "Editar Lote de Inscrição"
          : "Criar Lote de Inscrição"}
      </DialogTitle>
      <DialogDescription>
        {modalState.showCategoryBatches
          ? "Controle o lote de inscrição por categoria. Qualquer valor deixado em branco irá herdar o valor do lote de inscrição."
          : "Lotes de inscrição não podem se sobrepor nas datas de início e fim."}
      </DialogDescription>
      <DialogBody>
        {batchForm.formState.errors.root?.serverError?.message && (
          <Alertbox type="error" className="mb-3">
            <ul>
              <li>{batchForm.formState.errors.root?.serverError?.message}</li>
            </ul>
          </Alertbox>
        )}

        {modalState.showCategoryBatches && (
          <div className="mb-2 flex flex-col items-center justify-between gap-2 lg:flex-row">
            <BatchField
              variant="switch"
              enableAsterisk={false}
              name="categoryControl"
            >
              <Label>Controle por Categoria</Label>
              <Switch color={primaryColor?.tw.color} />
            </BatchField>
            <span className="text-xl">
              Vagas:{" "}
              {batchForm.watch("categoryControl") ? (
                <span
                  className={clsx(
                    (batchForm
                      .watch("categoryBatch")
                      ?.reduce(
                        (acc, f) =>
                          (typeof f.maxRegistrations === "number"
                            ? f.maxRegistrations
                            : 0) + acc,
                        0
                      ) ?? 0) > batchForm.getValues("maxRegistrations")
                      ? "text-red-600"
                      : ""
                  )}
                >
                  {batchForm
                    .watch("categoryBatch")
                    ?.reduce(
                      (acc, f) =>
                        (typeof f.maxRegistrations === "number"
                          ? f.maxRegistrations
                          : 0) + acc,
                      0
                    )}
                </span>
              ) : (
                0
              )}{" "}
              / {batchForm.getValues("maxRegistrations")}
            </span>
          </div>
        )}
        {modalState.showCategoryBatches ? (
          <Fieldset>
            <For each={modalities} identifier="modalities">
              {(modality, modalityIndex) => (
                <DisclosureAccordion
                  disabled={!batchForm.watch("categoryControl")}
                  title={modality.name}
                  className={clsx(
                    !batchForm.watch("categoryControl") &&
                      modalityIndex === modalities.length - 1 &&
                      "rounded-b-md"
                  )}
                >
                  <For
                    each={fields.filter(
                      (field) => field.modalityId === modality.id
                    )}
                    identifier="category"
                  >
                    {(categoryBatch, index) => {
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center">
                            <Text>
                              {
                                flatCategoryArray.find(
                                  (c) => c.id === categoryBatch.categoryId
                                )?.name
                              }
                            </Text>{" "}
                          </div>
                          <BatchField
                            enableAsterisk={false}
                            name={`categoryBatch.${flatCategoryArray.findIndex((i) => i.id === categoryBatch.categoryId)}.maxRegistrations`}
                          >
                            <Label>Inscrições</Label>
                            <Input
                              type="number"
                              inputMode="numeric"
                              placeholder="1000"
                            />
                          </BatchField>
                          <BatchField
                            enableAsterisk={false}
                            name={`categoryBatch.${flatCategoryArray.findIndex((i) => i.id === categoryBatch.categoryId)}.price`}
                          >
                            <Label>Preço</Label>
                            <Input inputMode="decimal" placeholder="99,90" />
                          </BatchField>
                        </div>
                      );
                    }}
                  </For>
                </DisclosureAccordion>
              )}
            </For>
          </Fieldset>
        ) : (
          <Fieldset>
            <FieldGroup className={"grid grid-cols-2 gap-2"}>
              <BatchField name="dateStart">
                <Label>Data de Início</Label>
                <Input
                  mask={"99/99/9999"}
                  inputMode="numeric"
                  placeholder="12/08/2024"
                />
              </BatchField>
              <BatchField name="timeStart">
                <Label>Hora de Início</Label>
                <Input mask={"99:99"} inputMode="numeric" placeholder="09:40" />
              </BatchField>
            </FieldGroup>
            <FieldGroup className={"grid grid-cols-2 gap-2"}>
              <BatchField name="dateEnd">
                <Label>Data de Término</Label>
                <Input
                  mask={"99/99/9999"}
                  inputMode="numeric"
                  placeholder="12/08/2024"
                />
                <ErrorMessage />
              </BatchField>
              <BatchField name="timeEnd">
                <Label>Hora de Término</Label>
                <Input mask={"99:99"} inputMode="numeric" placeholder="09:40" />
              </BatchField>
            </FieldGroup>

            <FieldGroup className={"grid grid-cols-2 gap-2 lg:grid-cols-2"}>
              <BatchField name="maxRegistrations">
                <Label>Inscrições</Label>
                <Input type="number" inputMode="numeric" placeholder="1000" />
              </BatchField>
              <BatchField name="price">
                <Label>Preço</Label>
                <Input inputMode="decimal" placeholder="99,90" />
              </BatchField>
              {!batchForm.getValues("id") && (
                <Description className={"col-span-2"}>
                  Você poderá criar limites por categoria depois de criar o
                  lote.
                </Description>
              )}
            </FieldGroup>
            <FieldGroup className={"grid grid-cols-2 gap-2 lg:grid-cols-2"}>
              <BatchField enableAsterisk={false} name="registrationType">
                <Label>Tipo de Inscrição</Label>
                <Select
                  displayValueKey="name"
                  data={[
                    { id: "mixed", name: "Mista" },
                    { id: "individual", name: "Apenas individual" },
                    { id: "team", name: "Apenas Equipes" },
                  ]}
                />
              </BatchField>
              <BatchField name="name">
                <Label>Nome do Lote</Label>
                <Input />
              </BatchField>
            </FieldGroup>
          </Fieldset>
        )}
      </DialogBody>
      <DialogActions className="justify-between">
        {batchForm.getValues("id") && (
          <Button
            onClick={() => modalState.setShowCategoryBatches((prev) => !prev)}
            color={secondaryColor?.tw.color}
          >
            {modalState.showCategoryBatches
              ? "Voltar"
              : "Definir por Categoria"}
          </Button>
        )}
        <div className="flex gap-2">
          <SubmitButton color={primaryColor?.tw.color}>
            {batchForm.getValues("id") ? "Salvar" : "Criar"}
          </SubmitButton>
        </div>
      </DialogActions>
    </Dialog>
  );
}
