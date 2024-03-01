import {
  CreateMultipleRegistrationsDto,
  ExcelDataSchema,
  excelDataSchema,
} from "@/app/api/registrations/dto";
import { chooseTextColor } from "@/utils/colors";
import {
  DocumentArrowUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { EventRegistrationBatch, Organization } from "@prisma/client";
import {
  Alertbox,
  For,
  Link,
  List,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableMock,
  TableRow,
  Text,
  formatCEP,
  formatCPF,
  formatPhone,
  normalize,
  sheetToJson,
} from "odinkit";
import {
  FileInput,
  showToast,
  FileDropArea,
  useFormContext,
  Input,
  Select,
  Label,
  Description,
  Switch,
  ErrorMessage,
  Button,
} from "odinkit/client";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useMemo } from "react";
import { UseFieldArrayReturn } from "react-hook-form";

export function ParticipantsForm({
  setInputMode,
  inputMode,
  fieldArray,
  eventGroup,
  addEmptyTeamMember,
  organization,
  batch,
}: {
  addEmptyTeamMember: () => void;
  organization: Organization;
  batch: EventRegistrationBatch;
  eventGroup: EventGroupWithInfo;
  fieldArray: UseFieldArrayReturn<
    CreateMultipleRegistrationsDto,
    "teamMembers",
    "id"
  >;
  setInputMode: (mode: "file" | "manual" | null) => void;
  inputMode: null | "file" | "manual";
}) {
  const { fields, insert } = fieldArray;

  const form = useFormContext<CreateMultipleRegistrationsDto>();

  const Field = useMemo(() => form.createField(), []);

  function formatSheetData(sheetData: ExcelDataSchema) {
    return sheetData.map((row) => ({
      user: {
        fullName: row["Nome Completo"],
        email: row["E-mail"],
        phone: formatPhone(normalize(row.Celular)),
        document: formatCPF(normalize(row.CPF)),
        address: row.Endereço,
        birthDate: row["Data de Nascimento (DD/MM/AAAA)"],
        zipCode: formatCEP(row.CEP),
        number: row["Número"],
        complemento: row["Complemento (Opcional)"],
        gender: ["masc", "masculino", "m", "homem", "h", "homen"].includes(
          normalize(row.Sexo)
        )
          ? "male"
          : "female",
      },
      registration: {
        modalityId:
          eventGroup.EventModality.length > 1
            ? ""
            : eventGroup.EventModality[0]!.id,
        categoryId: "",
        addon: {
          id:
            eventGroup.EventAddon?.find((addon) => !addon.price)?.id ||
            undefined,
          option: "",
        },
      },
    }));
  }

  return (
    <>
      <div className="grid grid-cols-4">
        {!inputMode && (
          <>
            <div className="col-span-4 mb-3 space-y-4 bg-white lg:col-span-2 lg:col-start-2 lg:mb-6">
              <Field name="createTeam" variant="switch">
                <Label>Salvar atletas em um time</Label>
                <Description>
                  Selecione se deseja salvar os atletas em um time, agilizando
                  futuras inscrições.
                </Description>
                <Switch
                  color={organization.options.colors.primaryColor.tw.color}
                />
              </Field>

              {form.watch("createTeam") && (
                <div className="col-span-4 mb-3 lg:col-span-2 lg:mb-4">
                  <Field name="teamName">
                    <Label>Nome do Time</Label>
                    <Input placeholder="Academia X" />
                    <ErrorMessage />
                  </Field>
                </div>
              )}
            </div>
            <div className="col-span-4 flex flex-col justify-between gap-2 lg:col-span-2 lg:col-start-2 lg:flex-row lg:gap-4">
              <Button
                outline
                onClick={() => setInputMode("file")}
                disabled={form.watch("createTeam") && !form.watch("teamName")}
                className="flex grow cursor-pointer items-center justify-center rounded-md border border-slate-200 p-3 shadow  "
              >
                <DocumentArrowUpIcon
                  style={{
                    color: organization.options.colors.primaryColor.hex,
                  }}
                  className="size-16 "
                />{" "}
                <p className="px-2 text-center">Importar de Arquivo</p>
              </Button>
              <Button
                outline
                disabled={form.watch("createTeam") && !form.watch("teamName")}
                onClick={() => {
                  setInputMode("manual");
                  addEmptyTeamMember();
                }}
                className="flex grow cursor-pointer items-center  justify-center rounded-md border border-slate-200 p-3 shadow  "
              >
                <PencilSquareIcon
                  style={{
                    color: organization.options.colors.primaryColor.hex,
                  }}
                  className="size-16 "
                />{" "}
                <p className="px-2 text-center">Inscrever Manualmente</p>
              </Button>
            </div>
            <div className="col-span-4 mt-4 lg:col-span-2 lg:col-start-2 ">
              <Text className="flex items-center gap-2">
                <ComputerDesktopIcon className="size-32 lg:size-8" />
                Devido ao alto número de informações na tela, recomendamos que
                inscrições em lote sejam feitas através de um computador.
              </Text>
            </div>
          </>
        )}

        {inputMode === "file" && (
          <div className="col-span-4 space-y-4 lg:ps-4">
            <div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor:
                      organization.options.colors.primaryColor.hex,
                    color: chooseTextColor(
                      organization.options.colors.primaryColor.hex
                    ),
                  }}
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full font-bold "
                >
                  1
                </div>
                <div className="flex flex-col">
                  <Text className="font-semibold">Formato Correto</Text>
                  <Text>
                    O arquivo deve ser um arquivo .xlsx e seguir o formato
                    correto.{" "}
                    <Link
                      style={{
                        color: organization.options.colors.primaryColor.hex,
                      }}
                      href={
                        "https://f005.backblazeb2.com/file/eventosmb/ModeloInscricoes.xlsx"
                      }
                      className="underline"
                    >
                      Clique aqui
                    </Link>{" "}
                    para baixar o modelo.
                  </Text>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor:
                      organization.options.colors.primaryColor.hex,
                    color: chooseTextColor(
                      organization.options.colors.primaryColor.hex
                    ),
                  }}
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white"
                >
                  2
                </div>
                <div className="flex flex-col">
                  <Text className="font-semibold">Verificar e Corrigir</Text>
                  <Text>
                    Ao importar o arquivo, verifique se os dados foram lidos
                    corretamente, faça as alterações necessárias.
                  </Text>
                </div>
              </div>
            </div>
            <div>
              {form.formState.errors.files?.message &&
                typeof JSON.parse(form.formState.errors.files?.message) ===
                  "object" && (
                  <Alertbox type="error">
                    <List data={form.formState.errors.files?.message ?? ""} />
                  </Alertbox>
                )}
              {form.formState.errors.teamMembers ? (
                <Alertbox className="hidden lg:block" type="error">
                  <List
                    data={JSON.stringify(
                      Object.entries(
                        form.formState.errors.teamMembers || {}
                      ).map((value) => `Erro na linha ${Number(value[0]) + 1}`)
                    )}
                  />
                </Alertbox>
              ) : null}
            </div>
            <Field name="files">
              <FileInput
                fileTypes={["xlsx"]}
                maxFiles={1}
                maxSize={1}
                validate={async (file) => {
                  const sheetArrayBuffer = await file.arrayBuffer();

                  const sheetJson = sheetToJson(sheetArrayBuffer);

                  if (!sheetJson?.length) throw "Sua planilha não possui dados";

                  if (
                    batch.multipleRegistrationLimit &&
                    sheetJson.length > batch.multipleRegistrationLimit
                  ) {
                    throw "O número de inscrições excede o limite de inscrições permitido.";
                  }

                  const sheetJsonValidation =
                    excelDataSchema.safeParse(sheetJson);

                  if (sheetJsonValidation.success) {
                    const data = sheetJsonValidation.data;

                    insert(0, formatSheetData(data));
                    form.trigger();

                    return true;
                  }

                  const error = sheetJsonValidation.error.issues.map((i) => {
                    const errorLocation = i.path;
                    const errorRow = Number(errorLocation[0]) + 1;
                    const errorColumn = errorLocation[1];
                    throw `Erro na linha ${errorRow}, coluna ${errorColumn}`;
                  });

                  throw error;
                }}
                onError={(error) => {
                  console.log(error);
                  if (typeof error === "string") {
                    showToast({
                      message: error,
                      title: "Erro",
                      variant: "error",
                    });
                  }
                }}
              >
                <FileDropArea
                  color={organization.options.colors.primaryColor.hex}
                  render={
                    form.watch("files")?.length ? (
                      <Text>
                        <span
                          style={{
                            color: organization.options.colors.primaryColor.hex,
                          }}
                          className="font-semibold"
                        >
                          Arquivo:
                        </span>{" "}
                        {form.watch("files")[0].name}{" "}
                        <span
                          onClick={() => {
                            form.resetField("files");
                            form.resetField("teamMembers");
                          }}
                          className="cursor-pointer font-semibold "
                        >
                          Trocar
                        </span>
                      </Text>
                    ) : null
                  }
                />
              </FileInput>
            </Field>
          </div>
        )}
      </div>
      {form.watch("teamMembers").length ? (
        <div className="col-span-4 lg:divide-y">
          <TableMock>
            <TableHead>
              <TableRow>
                <TableHeader>Atleta</TableHeader>
                <TableHeader>Nome Completo</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Celular</TableHeader>
                <TableHeader>CPF</TableHeader>
                <TableHeader>Sexo</TableHeader>
                <TableHeader>Data de Nascimento</TableHeader>
                <TableHeader>CEP</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <For each={fields}>
                {(field, index) => (
                  <>
                    <TableRow className="overflow-x-scroll">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Field name={`teamMembers.${index}.user.fullName`}>
                          <div className="min-w-[150px]">
                            <Input />
                          </div>
                        </Field>
                      </TableCell>
                      <TableCell>
                        <Field name={`teamMembers.${index}.user.email`}>
                          <div className="min-w-[150px]">
                            <Input />
                          </div>
                        </Field>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <Field name={`teamMembers.${index}.user.phone`}>
                          <div className="min-w-[150px]">
                            <Input
                              mask={(fieldValue: string) => {
                                if (fieldValue.length > 14) {
                                  return "(99) 99999-9999";
                                } else {
                                  return "(99) 9999-9999";
                                }
                              }}
                            />
                          </div>
                        </Field>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <Field name={`teamMembers.${index}.user.document`}>
                          <div className="min-w-[100px]">
                            <Input mask={"999.999.999-99"} />
                          </div>
                        </Field>
                      </TableCell>
                      <TableCell>
                        <Field name={`teamMembers.${index}.user.gender`}>
                          <div className="min-w-[110px]">
                            <Select
                              data={[
                                {
                                  id: "female",
                                  name: "Feminino",
                                },
                                { id: "male", name: "Masculino" },
                              ]}
                              displayValueKey="name"
                            />
                          </div>
                        </Field>
                      </TableCell>
                      <TableCell>
                        <Field name={`teamMembers.${index}.user.birthDate`}>
                          <div className="min-w-[100px]">
                            <Input mask={"99/99/9999"} />
                          </div>
                        </Field>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <Field name={`teamMembers.${index}.user.zipCode`}>
                          <div className="min-w-[100px]">
                            <Input mask={"99999-999"} />
                          </div>
                        </Field>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </For>
            </TableBody>
          </TableMock>
        </div>
      ) : null}
    </>
  );
}
