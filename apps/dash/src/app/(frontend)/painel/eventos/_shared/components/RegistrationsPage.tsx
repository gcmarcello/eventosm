"use client";
import { date } from "odinkit";
import { Badge, Table, formatPhone } from "odinkit";
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
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Select,
  useAction,
  useForm,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { RegistrationWithInfo } from "../../grupos/[id]/inscritos/page";
import { ModalitiesWithCategories } from "prisma/types/Modalities";
import { updateRegistrationDto } from "@/app/api/registrations/dto";

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

  useEffect(() => {
    if (selectedRegistration) {
      form.setValue("registrationId", selectedRegistration?.id!);
      form.setValue("categoryId", selectedRegistration?.categoryId!);
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
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>
          Editar Inscrição - {selectedRegistration?.user.fullName}
        </DialogTitle>
        <DialogDescription>
          Você poderá editar os detalhes da inscrição do atleta por este menu.
        </DialogDescription>
        <DialogBody>
          <Form hform={form} onSubmit={(data) => console.log(data)}>
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
                      .map((cat) => ({ id: cat.id, name: cat.name }))}
                  />
                  <ErrorMessage />
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
                <Description>ID: {selectedRegistration?.id}</Description>
              </FieldGroup>
            </Fieldset>
          </Form>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Refund</Button>
        </DialogActions>
      </Dialog>
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
        data={registrations || []}
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
