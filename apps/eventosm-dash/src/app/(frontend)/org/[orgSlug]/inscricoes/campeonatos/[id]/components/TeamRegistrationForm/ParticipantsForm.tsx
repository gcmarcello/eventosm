import {
  CreateMultipleRegistrationsDto,
  ExcelDataSchema,
  excelDataSchema,
} from "@/app/api/registrations/dto";
import {
  DocumentArrowUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
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
} from "odinkit/client";
import { EventGroupWithEvents } from "prisma/types/Events";
import { useMemo } from "react";
import { UseFieldArrayReturn } from "react-hook-form";

export function ParticipantsForm({
  setInputMode,
  inputMode,
  fieldArray,
  eventGroup,
  addEmptyTeamMember,
}: {
  addEmptyTeamMember: () => void;
  eventGroup: EventGroupWithEvents;
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
        name: row["Nome Completo"],
        email: row["E-mail"],
        phone: formatPhone(normalize(row.Celular)),
        document: formatCPF(row.CPF),
        birthDate: row["Data de Nascimento"],
        zipCode: formatCEP(row.CEP),
        gender:
          normalize(row.Sexo) === "masculino" ||
          normalize(row.Sexo) === "masc" ||
          normalize(row.Sexo) === "m"
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
            <div className="col-span-2 col-start-2 mb-3 space-y-4 bg-white lg:mb-6">
              <Field name="createTeam" variant="switch">
                <Label>Salvar atletas em um time</Label>
                <Description>
                  Selecione se deseja salvar os atletas em um time, agilizando
                  futuras inscrições.
                </Description>
                <Switch color="emerald" />
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
              <div
                onClick={() => setInputMode("file")}
                className="flex grow cursor-pointer items-center justify-center rounded-md border border-slate-200 p-3 shadow  hover:bg-slate-50"
              >
                <DocumentArrowUpIcon className="size-16 text-emerald-600" />{" "}
                <p className="px-2 text-center">Importar de Arquivo</p>
              </div>
              <div
                onClick={() => {
                  setInputMode("manual");
                  addEmptyTeamMember();
                }}
                className="flex grow cursor-pointer items-center  justify-center rounded-md border border-slate-200 p-3 shadow  hover:bg-slate-50"
              >
                <PencilSquareIcon className="size-16 text-emerald-600" />{" "}
                <p className="px-2 text-center">Inscrever Manualmente</p>
              </div>
            </div>
          </>
        )}

        {inputMode === "file" && (
          <div className="col-span-4 space-y-4 lg:ps-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                  1
                </div>
                <div className="flex flex-col">
                  <Text className="font-semibold">Formato Correto</Text>
                  <Text>
                    O arquivo deve ser um arquivo .xlsx e seguir o formato
                    correto.{" "}
                    <Link
                      href={
                        "https://f005.backblazeb2.com/file/eventosmb/ModeloInscricoes.xlsx"
                      }
                      className="text-emerald-600 underline"
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
                <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
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
            </div>
            <Field name="files">
              <FileInput
                fileTypes={["xlsx"]}
                maxFiles={1}
                maxSize={1}
                validate={async (file) => {
                  const sheetArrayBuffer = await file.arrayBuffer();

                  const sheetJson = sheetToJson(sheetArrayBuffer);

                  if (!sheetJson?.length)
                    return "Sua planilha não possui dados";

                  const sheetJsonValidation =
                    excelDataSchema.safeParse(sheetJson);

                  if (sheetJsonValidation.success) {
                    const data = sheetJsonValidation.data;

                    insert(0, formatSheetData(data));

                    return true;
                  }

                  const error = sheetJsonValidation.error.issues.map((i) => {
                    const errorLocation = i.path;
                    const errorRow = Number(errorLocation[0]) + 1;
                    const errorColumn = errorLocation[1];
                    return `Erro na linha ${errorRow}, coluna ${errorColumn}`;
                  });

                  return error;
                }}
                onError={(error) => {
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
                  render={
                    form.watch("files")?.length ? (
                      <Text>
                        <span className="font-semibold">Arquivo:</span>{" "}
                        {form.watch("files")[0].name}{" "}
                        <span
                          onClick={() => {
                            form.reset();
                          }}
                          className="cursor-pointer font-semibold text-emerald-600"
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
      <div className="col-span-4 lg:divide-y">
        <For each={fields}>
          {(field, index) => (
            <>
              <TableMock>
                <TableHead>
                  <TableRow>
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
                  <TableRow>
                    <TableCell>
                      <Field name={`teamMembers.${index}.user.name`}>
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
                    <TableCell>
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
                    <TableCell>
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
                    <TableCell>
                      <Field name={`teamMembers.${index}.user.zipCode`}>
                        <div className="min-w-[100px]">
                          <Input mask={"99999-999"} />
                        </div>
                      </Field>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </TableMock>
            </>
          )}
        </For>
      </div>
    </>
  );
}
