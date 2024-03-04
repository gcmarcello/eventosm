"use client";
import { ExcelDataSchema, excelDataSchema } from "@/app/api/registrations/dto";
import { createTeam } from "@/app/api/teams/action";
import { createTeamDto } from "@/app/api/teams/dto";
import { Transition } from "@headlessui/react";
import {
  ComputerDesktopIcon,
  DocumentArrowUpIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Gender, Organization } from "@prisma/client";
import {
  For,
  SubmitButton,
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
  Button,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  MultistepForm,
  Select,
  Switch,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

export function NewTeamModal({ organization }: { organization: Organization }) {
  const [isOpen, setIsOpen] = useState(false);
  const [addTeamMembers, setAddTeamMembers] = useState(false);
  const [inputMode, setInputMode] = useState<"manual" | "file" | null>(null);

  const form = useForm({
    schema: createTeamDto,
    defaultValues: {
      name: "",
      members: [],
      addMembers: false,
    },
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "members",
  });

  const addEmptyTeamMember = () => {
    fieldArray.append({
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
    });
  };

  function removeTeamMember(index: number) {
    if (fieldArray.fields.length > 1) fieldArray.remove(index);
  }

  function requiredFieldsForParticipant() {
    const array = fieldArray.fields.flatMap((_, index) => [
      `members.${index}.user.fullName`,
      `members.${index}.user.email`,
      `members.${index}.user.phone`,
      `members.${index}.user.document`,
      `members.${index}.user.birthDate`,
      `members.${index}.user.zipCode`,
      `members.${index}.user.gender`,
    ]);
    return array;
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
    action: createTeam,
    requestParser: (data) => {
      data.membersFile = [];
      return data;
    },
    onSuccess: () => {
      setIsOpen(false);
      form.reset();
      showToast({
        message: "Equipe criada com sucesso!",
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

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <Button
        color={organization.options.colors.primaryColor.tw.color}
        className="my-auto"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircleIcon className="size-5" />
        <span className="hidden lg:block">Criar Nova Equipe</span>
      </Button>
      <MultistepForm
        className="my-2"
        hform={form}
        onSubmit={(data) => trigger(data)}
        order={["name", "members"]}
        steps={{
          name: {
            fields: ["name"],
            form: (
              <Fieldset className={"my-2"}>
                <FieldGroup>
                  <Field name="name">
                    <Label>Nome da Equipe</Label>
                    <Input />
                  </Field>
                  <Field variant="switch" name="addMembers">
                    <Label>Deseja cadastrar membros agora?</Label>
                    <Description>
                      Você poderá fazer isso mais tarde.
                    </Description>
                    <Switch
                      color={organization.options.colors.primaryColor.tw.color}
                    />
                  </Field>
                </FieldGroup>
              </Fieldset>
            ),
          },
          members: {
            condition: form.watch("addMembers"),
            fields: requiredFieldsForParticipant() as any,
            form: !inputMode ? (
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
                                  organization.options.colors.primaryColor.hex,
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
                {inputMode === "manual" ||
                  (form.watch("membersFile") && (
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
                                    <Field
                                      name={`members.${index}.info.gender`}
                                    >
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
                                    <Field
                                      name={`members.${index}.info.zipCode`}
                                    >
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
                  ))}{" "}
              </>
            ),
          },
        }}
      >
        {({
          currentStep,
          hasNextStep,
          hasPrevStep,
          order,
          steps,
          isCurrentStepValid,
          walk,
        }) => {
          return (
            <>
              <Dialog
                size={currentStep > 0 && inputMode ? "full" : "lg"}
                open={isOpen}
                onClose={setIsOpen}
              >
                <DialogTitle>Criar Equipe</DialogTitle>
                <DialogDescription>
                  {currentStep === 0 ? (
                    "Ao criar uma equipe, você se torna o administrador dela. Você poderá gerenciar os membros, inscrever a equipe em eventos e alterar as informações."
                  ) : (
                    <span className="flex items-center gap-3 lg:gap-4">
                      <ComputerDesktopIcon className="size-32 lg:hidden" />
                      Devido ao alto número de informações na tela, recomendamos
                      que o cadastro de atletas seja feito através de um
                      computador.
                    </span>
                  )}
                </DialogDescription>
                <DialogBody>
                  <For each={order}>
                    {(step) => (
                      <Transition
                        show={step === order[currentStep]}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-0 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        {steps[step].form}
                      </Transition>
                    )}
                  </For>
                </DialogBody>
                <DialogActions>
                  {hasNextStep && (
                    <>
                      <Button
                        type="button"
                        color={
                          organization.options.colors.primaryColor.tw.color
                        }
                        onClick={() => {
                          walk(1);
                          scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={!isCurrentStepValid}
                      >
                        Próximo
                      </Button>
                    </>
                  )}
                  {hasPrevStep && (
                    <Button
                      type="button"
                      className={"hidden lg:block"}
                      plain={true}
                      onClick={() => {
                        walk(-1);
                        if (currentStep === 1) {
                          setInputMode(null);
                          form.resetField("membersFile");
                        }
                      }}
                    >
                      Voltar
                    </Button>
                  )}
                  {currentStep === 1 &&
                  inputMode &&
                  fieldArray.fields.length ? (
                    <>
                      <Button onClick={() => addEmptyTeamMember()}>
                        <PlusIcon className="h-6 w-6" /> Membro
                      </Button>
                    </>
                  ) : null}

                  <div className="flex justify-between">
                    {hasPrevStep && (
                      <Button
                        type="button"
                        className={"lg:hidden"}
                        plain={true}
                        onClick={() => {
                          walk(-1);
                          currentStep === 1 && setInputMode(null);
                        }}
                      >
                        Voltar
                      </Button>
                    )}
                    {!hasNextStep && inputMode && (
                      <SubmitButton
                        color={
                          organization.options.colors.primaryColor.tw.color
                        }
                      >
                        Inscrever
                      </SubmitButton>
                    )}
                  </div>
                </DialogActions>
              </Dialog>
            </>
          );
        }}
      </MultistepForm>
    </>
  );
}
