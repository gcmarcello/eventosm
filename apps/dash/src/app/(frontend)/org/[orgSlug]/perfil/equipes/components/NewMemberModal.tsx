"use client";
import { ExcelDataSchema, excelDataSchema } from "@/app/api/registrations/dto";
import { addTeamMembers } from "@/app/api/teams/action";
import { addTeamMembersDto, upsertTeamMemberDto } from "@/app/api/teams/dto";
import { chooseTextColor } from "@/utils/colors";
import {
  DocumentArrowUpIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Gender, Organization } from "@prisma/client";
import { Color } from "chart.js";
import {
  Link,
  sheetToJson,
  TableMock,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  For,
  TableCell,
  Text,
  formatCEP,
  formatCPF,
  formatPhone,
  normalize,
  SubmitButton,
  Alertbox,
} from "odinkit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

export default function NewMemberModal({
  organization,
  teamId,
}: {
  teamId: string;
  organization: Organization;
}) {
  let [isOpen, setIsOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"manual" | "file" | null>(null);

  const form = useForm({
    schema: addTeamMembersDto,
    defaultValues: {
      members: [],
      teamId,
      membersFile: [],
    },
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "members",
  });

  const addEmptyTeamMember = () => {
    fieldArray.append(
      {
        fullName: "",
        email: "",
        phone: "",
        document: "",
        info: {
          birthDate: "",
          zipCode: "",
          address: "",
          gender: "" as Gender,
          number: "",
          complement: "",
        },
      },
      { shouldFocus: true }
    );
  };

  function removeTeamMember(index: number) {
    if (fieldArray.fields.length > 1) fieldArray.remove(index);
  }

  function handleInputMode(mode: "manual" | "file" | null) {
    form.resetField("members");
    if (mode === "manual") {
      addEmptyTeamMember();
    }
    setInputMode(mode);
  }

  function formatSheetData(sheetData: ExcelDataSchema) {
    return sheetData.map((row) => ({
      fullName: row["Nome Completo"],
      email: row["E-mail"],
      phone: formatPhone(normalize(row.Celular)),
      document: formatCPF(normalize(row.CPF)),
      info: {
        address: row.Endereço,
        birthDate: row["Data de Nascimento (DD/MM/AAAA)"],
        zipCode: formatCEP(row.CEP),
        number: row["Número"],
        complement: row["Complemento (Opcional)"],
        gender: ["masc", "masculino", "m", "homem", "h", "homen"].includes(
          normalize(row.Sexo)
        )
          ? ("male" as "male")
          : ("female" as "female"),
      },
    }));
  }

  const { data, trigger, isMutating } = useAction({
    action: addTeamMembers,
    requestParser: (data) => {
      data.membersFile = [];
      return data;
    },
    onSuccess: () => {
      setIsOpen(false);
      form.reset();
      showToast({
        message: "Atletas adicionados com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      showToast({
        message: error,
        title: "Erro",
        variant: "error",
      });
    },
  });

  function getFaultyMembers() {
    if (!inputMode) return [];
    return fieldArray.fields.reduce((acc: number[], field, index) => {
      const errors = form.formState.errors.members?.[index];
      if (errors) {
        acc.push(index + 1);
      }
      return acc;
    }, []);
  }

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-2">
          <UserCircleIcon className="h-5 w-5" />
          Novo Membro
        </div>
      </Button>
      <Form hform={form} onSubmit={(data) => trigger(data)}>
        <Dialog
          size={form.watch("members").length ? "full" : "3xl"}
          open={isOpen}
          onClose={setIsOpen}
        >
          <DialogTitle>Adicionar Membros de Equipe</DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogBody>
            {!inputMode ? (
              <div className="col-span-4 my-4 flex flex-col justify-between gap-2 lg:col-span-2 lg:col-start-2 lg:flex-row lg:gap-4">
                <Button
                  outline
                  onClick={() => handleInputMode("file")}
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
                  onClick={() => {
                    handleInputMode("manual");
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
            ) : (
              <>
                <div className="col-span-4 space-y-4 lg:ps-4">
                  {inputMode === "file" && (
                    <div className="my-3 flex flex-col gap-3">
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
                            O arquivo deve ser um arquivo .xlsx e seguir o
                            formato correto.{" "}
                            <Link
                              style={{
                                color:
                                  organization.options.colors.primaryColor.hex,
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
                          2
                        </div>
                        <div className="flex flex-col">
                          <Text className="font-semibold">
                            Verifique os Dados
                          </Text>
                          <Text>
                            Após importar o arquivo, faça os ajustes
                            necessários.
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {inputMode === "file" && (
                  <Field name="membersFile">
                    <FileInput
                      fileTypes={["xlsx"]}
                      maxFiles={1}
                      maxSize={1}
                      validate={async (file) => {
                        const sheetArrayBuffer = await file.arrayBuffer();

                        const sheetJson = sheetToJson(sheetArrayBuffer);

                        if (!sheetJson?.length)
                          throw "Sua planilha não possui dados";

                        /* if (
                    batch.multipleRegistrationLimit &&
                    sheetJson.length > batch.multipleRegistrationLimit
                  ) {
                    throw "O número de inscrições excede o limite de inscrições permitido.";
                  } */

                        const sheetJsonValidation =
                          excelDataSchema.safeParse(sheetJson);

                        if (sheetJsonValidation.success) {
                          const data = sheetJsonValidation.data;

                          fieldArray.insert(0, formatSheetData(data));
                          form.trigger();

                          return true;
                        }

                        const error = sheetJsonValidation.error.issues.map(
                          (i) => {
                            const errorLocation = i.path;
                            const errorRow = Number(errorLocation[0]) + 1;
                            const errorColumn = errorLocation[1];
                            console.log(sheetJsonValidation.error.issues);
                            throw `Erro na linha ${errorRow}, coluna ${errorColumn}`;
                          }
                        );

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
                          form.watch("membersFile")?.length ? (
                            <Text>
                              <span
                                style={{
                                  color:
                                    organization.options.colors.primaryColor
                                      .hex,
                                }}
                                className="font-semibold"
                              >
                                Arquivo:
                              </span>{" "}
                              {form.watch("membersFile")?.[0].name}{" "}
                              <span
                                onClick={() => {
                                  form.resetField("members");
                                  form.resetField("membersFile");
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
                )}
                {(inputMode === "manual" ||
                  (form.watch("membersFile") &&
                    form.watch("members").length > 0)) && (
                  <div className="col-span-4 lg:divide-y">
                    <TableMock className={"my-2"}>
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
                        <For each={fieldArray.fields}>
                          {(field, index) => (
                            <>
                              <TableRow
                                key={field.id}
                                className="overflow-x-scroll"
                              >
                                <TableCell>
                                  <Button
                                    className={"flex items-center gap-1"}
                                    plain
                                    disabled={fieldArray.fields.length === 1}
                                    onClick={() => removeTeamMember(index)}
                                  >
                                    {index + 1}{" "}
                                    <TrashIcon className="h-4 w-4 text-red-500" />{" "}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Field name={`members.${index}.fullName`}>
                                    <div className="min-w-[150px]">
                                      <Input />
                                    </div>
                                  </Field>
                                </TableCell>
                                <TableCell>
                                  <Field name={`members.${index}.email`}>
                                    <div className="min-w-[200px]">
                                      <Input />
                                    </div>
                                  </Field>
                                </TableCell>
                                <TableCell className="min-w-[200px]">
                                  <Field name={`members.${index}.phone`}>
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
                                  <Field name={`members.${index}.document`}>
                                    <div className="min-w-[100px]">
                                      <Input mask={"999.999.999-99"} />
                                    </div>
                                  </Field>
                                </TableCell>
                                <TableCell>
                                  <Field name={`members.${index}.info.gender`}>
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
                                  <Field
                                    name={`members.${index}.info.birthDate`}
                                  >
                                    <div className="min-w-[100px]">
                                      <Input mask={"99/99/9999"} />
                                    </div>
                                  </Field>
                                </TableCell>
                                <TableCell className="min-w-[200px]">
                                  <Field name={`members.${index}.info.zipCode`}>
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
                )}{" "}
              </>
            )}
          </DialogBody>
          <DialogActions className="sm:*:w-auto">
            {getFaultyMembers().length ? (
              <Alertbox type="error" title="Erro!">
                {getFaultyMembers().length < 2
                  ? "Erros na linha"
                  : "Erros nas linhas"}{" "}
                {getFaultyMembers().join(", ")}
              </Alertbox>
            ) : null}
            <Button
              plain
              onClick={() => {
                if (inputMode) {
                  form.resetField("members");
                  form.resetField("membersFile");
                  setInputMode(null);
                } else {
                  setIsOpen(false);
                }
              }}
            >
              Voltar
            </Button>
            {inputMode && fieldArray.fields.length ? (
              <>
                <Button onClick={() => addEmptyTeamMember()}>
                  <PlusIcon className="h-6 w-6" /> Membro
                </Button>
              </>
            ) : null}
            {form.watch("members").length > 0 ? (
              <SubmitButton
                color={organization.options.colors.primaryColor.tw.color}
              >
                Adicionar
              </SubmitButton>
            ) : null}
          </DialogActions>
        </Dialog>
      </Form>
    </>
  );
}
