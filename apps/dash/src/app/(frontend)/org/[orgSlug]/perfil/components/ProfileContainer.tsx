"use client";

import clsx from "clsx";
import { Organization } from "@prisma/client";
import {
  Badge,
  For,
  SubmitButton,
  date,
  formatCEP,
  formatCPF,
  formatPhone,
  normalizeDocument,
  normalizePhone,
  normalizeZipCode,
  scrollToElement,
} from "odinkit";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  FieldGroup,
  Form,
  Input,
  Label,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { UpdateUserDto, updateUserDto } from "@/app/api/users/dto";
import { get } from "lodash";
import { updateUser } from "@/app/api/users/action";
import { readAddressFromZipCode } from "@/app/api/geo/action";
import dayjs from "dayjs";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(parseCustomFormat);

export default function ProfileContainer({
  connectedOrgs,
  userSession,
  orgSlug,
}: {
  connectedOrgs: Organization[];
  userSession: UserSession;
  orgSlug: string;
}) {
  const [organization, setOrganization] = useState(
    connectedOrgs.find((org) => org.slug === orgSlug)
  );
  const [showAddressModal, setShowAddressModal] = useState(false);

  const form = useForm({
    schema: updateUserDto,
    mode: "onChange",
    defaultValues: {
      fullName: userSession.fullName,
      email: userSession.email,
      phone: formatPhone(userSession.phone || ""),
      document: formatCPF(userSession.document),
      info: {
        zipCode: formatCEP(userSession.info?.zipCode || ""),
        address: userSession.info?.address || "",
        number: userSession.info?.number || "",
        gender: userSession.info?.gender,
        cityId: userSession.info?.cityId || "",
        stateId: userSession.info?.stateId || "",
        support: userSession.info?.support || "",
        birthDate: dayjs(userSession.info?.birthDate).toISOString(),
      },
    },
  });

  const [fields, setFields] = useState<
    {
      name: any;
      display: string;
      edit: boolean;
    }[]
  >([
    { name: "fullName", display: "Nome Completo", edit: false },
    { name: "email", display: "Email", edit: false },
    {
      name: "phone",
      display: "Telefone",
      edit: false,
    },
    { name: "document", display: "Documento", edit: false },
    { name: "info.support", display: "Apoio/Patrocínio", edit: false },
  ]);

  function handleEdit(field?: string) {
    if (!field)
      return setFields(
        fields.map((f) => {
          return { ...f, edit: false };
        })
      );

    setFields(
      fields.map((f) => ({ ...f, edit: f.name === field ? !f.edit : false }))
    );
  }

  function handleMask(field: string) {
    switch (field) {
      case "phone":
        return form.watch("phone").length < 14
          ? "(99) 9999-99999"
          : "(99) 99999-9999";

      case "document":
        return "999.999.999-99";

      default:
        return "";
    }
  }

  const { data, trigger, isMutating } = useAction({
    action: updateUser,
    requestParser: (data) => {
      const parsedData: UpdateUserDto = {
        ...data,
        phone: normalizePhone(data.phone),
        document: normalizeDocument(data.document),
        info: {
          ...data.info,
          zipCode: normalizeZipCode(data.info.zipCode),
        },
      };
      return parsedData;
    },
    onSuccess: (data) => {
      handleEdit();
      showToast({
        message: "Dados atualizados com sucesso.",
        variant: "success",
        title: "Sucesso",
      });
      setShowAddressModal(false);
    },
    onError: (error) =>
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro!",
      }),
  });

  const {
    data: cepData,
    trigger: cepTrigger,
    isMutating: isMutatingCep,
  } = useAction({
    action: readAddressFromZipCode,
    onSuccess: ({ data }) => {
      form.setValue("info.number", "");
      form.setValue("info.complement", "");
      if (!data || !data.city.id || !data.state.id)
        return showToast({
          message: "CEP não encontrado",
          variant: "error",
          title: "Erro!",
        });
      form.setValue("info.address", data.address);
      form.setValue("info.cityId", data.city.id);
      form.setValue("info.stateId", data.state.id);
      setTimeout(() => {
        if (addressRef.current) scrollToElement(addressRef.current);
      }, 200);
    },
  });
  const addressRef = useRef<HTMLDivElement>(null);

  const Field = useMemo(() => form.createField(), []);

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <Form hform={form} onSubmit={(data) => trigger(data)}>
        <Dialog open={showAddressModal} onClose={setShowAddressModal}>
          <DialogTitle>Atualizar Endereço</DialogTitle>
          <DialogDescription>
            Digitar seu CEP atualizará automaticamente seu endereço. Você
            precisa apenas preencher o número e complemento.
          </DialogDescription>
          <DialogBody>
            <Field name="info.zipCode">
              <Label>CEP</Label>
              <Input
                mask={"99999-999"}
                loading={isMutatingCep}
                onChange={(e) => {
                  if (e.target.value.length === 9) {
                    cepTrigger({ zipCode: e.target.value });
                  }
                }}
              />
            </Field>
            {cepData && (
              <div ref={addressRef}>
                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <div className="items-center pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 lg:w-24">
                      Endereço
                    </dt>
                    <dd className="mt-1 flex items-center justify-start  gap-x-6 sm:mt-0 sm:flex-auto">
                      <div>{cepData?.address}</div>
                    </dd>
                  </div>
                  <div className="items-center pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 lg:w-24">
                      Cidade
                    </dt>
                    <dd className="mt-1 flex items-center justify-start  gap-x-6 sm:mt-0 sm:flex-auto">
                      <div>{cepData?.city.name}</div>
                    </dd>
                  </div>
                  <div className="items-center pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 lg:w-24">
                      Estado
                    </dt>
                    <dd className="mt-1 flex items-center justify-start  gap-x-6 sm:mt-0 sm:flex-auto">
                      <div>{cepData?.state.name}</div>
                    </dd>
                  </div>
                  <div className="pt-6">
                    <Field name={"info.number"}>
                      <Label>Número</Label>
                      <Input />
                      <ErrorMessage />
                    </Field>
                  </div>
                  <div className="pt-6">
                    <Field name={"info.complement"}>
                      <Label>Complemento</Label>
                      <Input />
                      <ErrorMessage />
                    </Field>
                  </div>
                </dl>
              </div>
            )}
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setShowAddressModal(false)}>
              Cancelar
            </Button>
            <SubmitButton
              disabled={
                isMutatingCep ||
                form.watch("info.zipCode").length !== 9 ||
                !form.watch("info.number")
              }
            >
              Salvar
            </SubmitButton>
          </DialogActions>
        </Dialog>
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Meu Perfil
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Essas informações são compartilhadas entre todas as organizações que
            você está conectado.
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <For each={fields}>
              {(field) => (
                <div className="items-center pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    {field.display}
                  </dt>
                  <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {field.edit ? (
                      <>
                        <Field name={field.name}>
                          <Input mask={handleMask(field.name)} />
                          <ErrorMessage />
                        </Field>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-md p-2 font-semibold hover:bg-gray-50"
                            onClick={() => handleEdit(field.name)}
                            style={{
                              color:
                                organization?.options.colors.secondaryColor.hex,
                            }}
                          >
                            Cancelar
                          </button>
                          <SubmitButton
                            className="rounded-md p-2 font-semibold hover:bg-gray-50"
                            style={{
                              color:
                                organization?.options.colors.primaryColor.hex,
                            }}
                          >
                            Salvar
                          </SubmitButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>{form.getValues(field.name)}</div>
                        <button
                          type="button"
                          className="font-semibold"
                          onClick={() => handleEdit(field.name)}
                          style={{
                            color:
                              organization?.options.colors.primaryColor.hex,
                          }}
                        >
                          Atualizar
                        </button>
                      </>
                    )}
                  </dd>
                </div>
              )}
            </For>
            <div className="items-center pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Endereço
              </dt>
              <dd className="mt-1 flex items-center justify-between  gap-x-6 sm:mt-0 sm:flex-auto">
                <div>{`${form.getValues("info.address")}, ${form.getValues("info.number")}`}</div>
                <button
                  type="button"
                  className="font-semibold"
                  onClick={() => setShowAddressModal(true)}
                  style={{
                    color: organization?.options.colors.primaryColor.hex,
                  }}
                >
                  Atualizar
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </Form>

      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Organizações Conectadas
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Gerencie as organizações que você está conectado e tem acesso aos seus
          dados.
        </p>

        <ul
          role="list"
          className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
        >
          <For each={connectedOrgs}>
            {(org: Organization) => (
              <li className="flex justify-between gap-x-6 py-6">
                <Image
                  alt="logo"
                  height={64}
                  width={64}
                  src={org.options.images?.logo ?? ""}
                />
                <div className="font-medium text-gray-900">{org.name}</div>
                {org.slug === orgSlug ? (
                  <Badge>Atual</Badge>
                ) : (
                  <button
                    type="button"
                    className="font-semibold text-red-600 hover:text-red-500"
                  >
                    Remover
                  </button>
                )}
              </li>
            )}
          </For>
        </ul>

        {/* <div className="flex border-t border-gray-100 pt-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  <span aria-hidden="true">+</span> Add another application
                </button>
              </div> */}
      </div>
    </div>
  );
}
