"use client";

import { useOrg } from "../../../components/OrgStore";

import {
  Button,
  ErrorMessage,
  FieldGroup,
  Form,
  Input,
  Label,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { upsertPasswordRecoveryTokenDto } from "@/app/api/auth/recovery/dto";
import { generateRecoveryToken } from "@/app/api/auth/recovery/action";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function RecoverPage() {
  const { colors, abbreviation, id, name } = useOrg();

  const form = useForm({
    schema: upsertPasswordRecoveryTokenDto,
    defaultValues: { type: undefined, identifier: "", organizationId: id },
  });

  const { data, trigger, isMutating } = useAction({
    action: generateRecoveryToken,
    redirect: true,
    onError: (error) =>
      showToast({
        title: "Erro",
        variant: "error",
        message: error,
      }),
  });

  const Field = useMemo(() => form.createField(), [form]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:flex-none lg:px-10 lg:py-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="mt-8 flex items-baseline gap-3">
              <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Recuperar Conta
              </h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Depois de se identificar, lhe enviaremos um email para redefinir
              sua senha.{" "}
            </p>
          </div>

          <div className="mt-10">
            <div>
              <Form
                hform={form}
                onSubmit={(data) => trigger(data)}
                className="space-y-6"
              >
                <FieldGroup className="space-y-6">
                  <Field name="type">
                    <Label>Escolha uma forma de identificação</Label>
                    <Select
                      displayValueKey="name"
                      onChange={() => form.resetField("identifier")}
                      data={[
                        { id: "document", name: "CPF" },
                        { id: "email", name: "E-mail" },
                        { id: "phone", name: "Telefone" },
                      ]}
                      defaultValue={""}
                    ></Select>
                    <ErrorMessage />
                  </Field>
                  {form.watch("type") && (
                    <>
                      <Field name="identifier">
                        <Label>
                          Digite seu{" "}
                          {form.watch("type") === "email"
                            ? "E-mail"
                            : form.watch("type") === "phone"
                              ? "telefone"
                              : "documento (CPF)"}
                        </Label>
                        <Input
                          mask={(value) => {
                            const type = form.watch("type");

                            switch (type) {
                              case "document":
                                return "999.999.999-99";
                              case "phone":
                                return value.length > 14
                                  ? "(99) 99999-9999"
                                  : "(99) 9999-99999";
                              default:
                                return "";
                            }
                          }}
                        />
                        <ErrorMessage />
                      </Field>
                      <div className="flex">
                        <Button
                          loading={isMutating}
                          type="submit"
                          className={"w-full"}
                          color={colors.primaryColor.tw.color}
                        >
                          Recuperar Senha
                        </Button>
                      </div>
                    </>
                  )}
                </FieldGroup>
              </Form>
              <div className="mt-5 text-center text-xs leading-6 text-gray-500 lg:mt-8 lg:text-start">
                Tecnologia EventoSM® {dayjs().get("year")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
