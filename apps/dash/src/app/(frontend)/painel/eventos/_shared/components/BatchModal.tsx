import { UpsertRegistrationBatchDto } from "@/app/api/batches/dto";

import clsx from "clsx";
import { Alertbox, For, Heading, SubmitButton, Text } from "odinkit";
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
import { useFieldArray } from "react-hook-form";
import { Organization } from "@prisma/client";
import { usePanel } from "../../../_shared/components/PanelStore";

export default function BatchModal({
  modalState,
  batches,
  modalities,
  isLoading,
  organization,
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
  organization: Organization;
}) {
  const batchForm = useFormContext<UpsertRegistrationBatchDto>();
  const BatchField = useMemo(() => batchForm.createField(), []);

  const { fields } = useFieldArray({
    control: batchForm.control,
    name: "categoryBatch",
  });

  const { fields: modalityFields } = useFieldArray({
    control: batchForm.control,
    name: "modalityBatch",
  });

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
          <div className="my-2 flex flex-col gap-4 lg:flex-row">
            <BatchField
              variant="switch"
              enableAsterisk={false}
              name="modalityControl"
            >
              <Label>Controle por Modalidade</Label>
              <Switch
                color={organization.options.colors.primaryColor?.tw.color}
              />
            </BatchField>
            <BatchField
              variant="switch"
              enableAsterisk={false}
              name="categoryControl"
            >
              <Label>Controle por Categoria</Label>
              <Switch
                color={organization.options.colors.primaryColor?.tw.color}
              />
            </BatchField>
          </div>
        )}
        {modalState.showCategoryBatches ? (
          <Fieldset>
            <div className="divide-y">
              <For each={modalities} identifier="modalities">
                {(modality, modalityIndex) => (
                  <div className="py-4">
                    <Heading>{modality.name}</Heading>
                    <div className="flex flex-col justify-center gap-4 lg:flex-row">
                      <BatchField
                        className={"grow"}
                        name={`modalityBatch.${modalities.findIndex((i) => i.id === modality.id)}.maxRegistrations`}
                      >
                        <Label>Máximo de Inscrições</Label>
                        <Input
                          disabled={!batchForm.watch("modalityControl")}
                          type="number"
                          inputMode="numeric"
                          placeholder="1000"
                          min={1}
                        />
                      </BatchField>
                      <BatchField
                        name={`modalityBatch.${modalities.findIndex((i) => i.id === modality.id)}.price`}
                        className={"grow"}
                      >
                        <Label>Preço</Label>
                        <Input
                          disabled={!batchForm.watch("modalityControl")}
                          inputMode="decimal"
                          placeholder="99,90"
                          min={0}
                        />
                      </BatchField>
                    </div>
                    <DisclosureAccordion
                      border={false}
                      disabled={!batchForm.watch("categoryControl")}
                      title={
                        <>
                          <>
                            Mostrar{" "}
                            {
                              fields.filter(
                                (field) => field.modalityId === modality.id
                              ).length
                            }{" "}
                            Categorias
                          </>
                        </>
                      }
                      className={clsx(
                        !batchForm.watch("categoryControl") &&
                          modalityIndex === modalities.length - 1 &&
                          "rounded-b-md"
                      )}
                    >
                      <div className="space-y-4 divide-y">
                        <div className="py-4">
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
                                          (c) =>
                                            c.id === categoryBatch.categoryId
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
                                      disabled={
                                        !batchForm.watch("categoryControl")
                                      }
                                      type="number"
                                      inputMode="numeric"
                                      min={0}
                                    />
                                  </BatchField>
                                  <BatchField
                                    enableAsterisk={false}
                                    name={`categoryBatch.${flatCategoryArray.findIndex((i) => i.id === categoryBatch.categoryId)}.price`}
                                  >
                                    <Label>Preço</Label>
                                    <Input
                                      disabled={
                                        !batchForm.watch("categoryControl")
                                      }
                                      inputMode="decimal"
                                      min={0}
                                    />
                                  </BatchField>
                                </div>
                              );
                            }}
                          </For>
                        </div>
                      </div>
                    </DisclosureAccordion>
                  </div>
                )}
              </For>
            </div>
          </Fieldset>
        ) : (
          <Fieldset className={"my-3 space-y-3"}>
            <div className={"grid grid-cols-2 gap-2"}>
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
            </div>
            <div className={"grid grid-cols-2 gap-2"}>
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
            </div>

            <div className={"grid grid-cols-2 gap-2 lg:grid-cols-2"}>
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
            </div>
            <div className={"grid grid-cols-2 gap-4 lg:grid-cols-2"}>
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
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {batchForm.watch("registrationType") !== "individual" && (
                <BatchField name="multipleRegistrationLimit">
                  <Label>Limite de Inscrições em lote (por equipe)</Label>
                  <Input type="number" />
                </BatchField>
              )}
              <BatchField name="protectedBatch" variant="switch">
                <Label>Proteger Lote</Label>
                <Description>
                  Se selecionado, o lote estará acessível apenas através do link
                  disponível na tabela.
                </Description>
                <Switch
                  color={organization.options.colors.primaryColor.tw.color}
                />
              </BatchField>
            </div>
          </Fieldset>
        )}
      </DialogBody>
      <DialogActions>
        {batchForm.getValues("id") && (
          <Button
            onClick={() => modalState.setShowCategoryBatches((prev) => !prev)}
            color={organization.options.colors.secondaryColor?.tw.color}
          >
            {modalState.showCategoryBatches
              ? "Voltar"
              : "Definir por Categoria"}
          </Button>
        )}
        <SubmitButton
          color={organization.options.colors.primaryColor?.tw.color}
        >
          {batchForm.getValues("id") ? "Salvar" : "Criar"}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}
