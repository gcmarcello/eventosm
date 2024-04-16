"use client";
import { SubmitButton, date } from "odinkit";
import { Badge, Table, formatPhone } from "odinkit";
import {
  Field as HeadlessRadioField,
  Radio as HeadlessRadio,
  RadioGroup as HeadlessRadioGroup,
  type FieldProps as HeadlessFieldProps,
  type RadioGroupProps as HeadlessRadioGroupProps,
  type RadioProps as HeadlessRadioProps,
} from "@headlessui/react";
import {
  Button,
  Date,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  RadioField,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { RegistrationWithInfo } from "../../grupos/[id]/inscritos/page";
import { ModalitiesWithCategories } from "prisma/types/Modalities";
import { updateRegistrationDto } from "@/app/api/registrations/dto";
import { determineCategoryAvailability } from "@/app/(frontend)/org/[orgSlug]/inscricoes/utils/categories";
import Image from "next/image";
import {
  resendEventGroupRegistrationConfirmation,
  updateRegistration,
} from "@/app/api/registrations/action";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import RegistrationStatusDropdown from "./RegistrationStatusDropdown";
import { EventRegistrationStatus } from "@prisma/client";

export default function RegistrationsTable({
  registrations,
  modalitiesWithCategories,
}: {
  registrations: RegistrationWithInfo[];
  modalitiesWithCategories: ModalitiesWithCategories[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<null | RegistrationWithInfo>(null);

  function handleSelectedRegistration(registration: RegistrationWithInfo) {
    setSelectedRegistration(registration);
    setIsOpen(true);
  }

  const form = useForm({
    schema: updateRegistrationDto,
  });

  const categories = useMemo(
    () => modalitiesWithCategories.flatMap((mod) => mod.modalityCategory),
    [modalitiesWithCategories]
  );

  const { data: updatedRegistration, trigger: updateRegistrationTrigger } =
    useAction({
      action: updateRegistration,
      onError: (error) =>
        showToast({ message: error.message, variant: "error", title: "Erro!" }),
      onSuccess: () => {
        setIsOpen(false);
        setSelectedRegistration(null);
        showToast({
          message: "Inscrição atualizada com sucesso!",
          variant: "success",
          title: "Sucesso!",
        });
      },
    });

  const {
    data: resendConfirmation,
    trigger: resendConfirmationTrigger,
    isMutating: isResendingEmailConfirmation,
  } = useAction({
    action: resendEventGroupRegistrationConfirmation,
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
    onSuccess: () => {
      showToast({
        message: "Confirmação re-enviada com sucesso!",
        variant: "success",
        title: "Sucesso!",
      });
    },
  });

  useEffect(() => {
    if (selectedRegistration) {
      form.setValue("registrationId", selectedRegistration?.id!);
      form.setValue("categoryId", selectedRegistration?.categoryId!);
      form.setValue("status", selectedRegistration?.status!);
      form.setValue(
        "modalityId",
        selectedRegistration?.modalityId ?? undefined!
      );
      form.setValue("code", selectedRegistration?.code!);
    }
  }, [selectedRegistration]);

  const Field = useMemo(() => form.createField(), [form]);

  return (
    <>
      <Form hform={form} onSubmit={(data) => updateRegistrationTrigger(data)}>
        <Dialog open={isOpen} onClose={setIsOpen}>
          <DialogTitle>
            Editar Inscrição - {selectedRegistration?.user.fullName}
          </DialogTitle>
          <DialogDescription>
            Você poderá editar os detalhes da inscrição do atleta por este menu.
          </DialogDescription>
          <DialogBody>
            <Fieldset className={"mt-2"}>
              <FieldGroup>
                <Field name="modalityId">
                  <Label>Modalidade</Label>
                  <Select
                    displayValueKey="name"
                    data={modalitiesWithCategories.map((mod) => ({
                      id: mod.id,
                      name: mod.name,
                    }))}
                  />
                  <ErrorMessage />
                </Field>
                <Field name="categoryId">
                  <Label>Categoria</Label>
                  <Select
                    displayValueKey="name"
                    data={categories
                      .filter(
                        (cat) =>
                          cat.eventModalityId === form.watch("modalityId")
                      )
                      .map((cat) => ({
                        id: cat.id,
                        name:
                          cat.name +
                          (determineCategoryAvailability(cat, {
                            birthDate:
                              selectedRegistration?.user.info?.birthDate!,
                            gender: selectedRegistration?.user.info?.gender!,
                          })
                            ? ""
                            : " (Indisponível Normalmente)"),
                      }))}
                  />
                  <ErrorMessage />
                  <Description>
                    As categorias que estão indisponíveis (normalmente) estão
                    destacadas.
                  </Description>
                </Field>
                <Field name="code">
                  <Label>Número</Label>
                  <Input />
                  <ErrorMessage />
                  <Description>
                    Dois atletas não podem possuir o mesmo número. Letras são
                    permitidas.
                  </Description>
                </Field>
                <div className="flex">
                  <div className="hidden lg:block">
                    <Image
                      height={150}
                      width={150}
                      src={selectedRegistration?.qrCode || ""}
                      alt="Qr Code"
                    />
                  </div>
                  <div className="flex grow flex-col justify-evenly gap-2 lg:gap-0">
                    <Button
                      className={"w-full"}
                      loading={isResendingEmailConfirmation}
                      onClick={() =>
                        selectedRegistration &&
                        resendConfirmationTrigger(selectedRegistration.id)
                      }
                    >
                      Reenviar QR Code
                    </Button>
                    <RegistrationStatusDropdown />
                  </div>
                </div>
                <Description>ID: {selectedRegistration?.id}</Description>
              </FieldGroup>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton>Salvar</SubmitButton>
          </DialogActions>
        </Dialog>
      </Form>
      <Table
        xlsx={{
          data:
            registrations?.map((registration) => ({
              Número: registration.code,
              Document: registration.user.document,
              Nome: registration.user.fullName,
              Status: registration.status,
              Categoria: registration.category?.name,
              Telefone: registration.user.phone,
              Equipe: registration.team?.name,
              "Data de Inscrição": date(
                registration.createdAt,
                "DD/MM/YYYY HH:mm",
                true
              ),
              Kit: registration.addon?.name,
              "Opção do Kit": registration.addonOption,
            })) || [],
        }}
        data={
          registrations.sort((a, b) => Number(b.code) - Number(a.code)) || []
        }
        columns={(columnHelper) => [
          columnHelper.accessor("code", {
            id: "code",
            header: "Número",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("user.fullName", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            enableSorting: true,
            enableGlobalFilter: false,
            cell: (info) => {
              switch (info.getValue()) {
                case "pending":
                  return <Badge color="amber">Pendente</Badge>;
                case "active":
                  return <Badge color="green">Ativa</Badge>;
                case "cancelled":
                  return <Badge color="red">Cancelada</Badge>;
                case "suspended":
                  return <Badge color="rose">Suspensa</Badge>;
              }
            },
          }),
          columnHelper.accessor("category.name", {
            id: "category",
            header: "Categoria",
            enableSorting: true,
            enableGlobalFilter: false,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("team.name", {
            id: "team",
            header: "Equipe",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("createdAt", {
            id: "createdAt",
            header: "Data da Inscrição",
            enableSorting: true,
            enableGlobalFilter: false,
            cell: (info) => (
              <Date date={info.getValue()} format="DD/MM/YYYY HH:mm" />
            ),
          }),
          columnHelper.accessor("addon.name", {
            id: "addon",
            header: "Kit",
            enableSorting: true,
            enableGlobalFilter: false,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("addonOption", {
            id: "addonOption",
            header: "Opção do Kit",
            enableSorting: true,
            enableGlobalFilter: false,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: true,
            enableGlobalFilter: false,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      handleSelectedRegistration(info.row.original);
                    }}
                  >
                    Editar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      />
    </>
  );
}
