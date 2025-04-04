"use client";
import { For, Link, SubmitButton, date } from "odinkit";
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
  RichTextEditor,
  Select,
  Textarea,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";
import { ModalitiesWithCategories } from "prisma/types/Modalities";
import {
  UpdateRegistrationDto,
  updateRegistrationDto,
} from "@/app/api/registrations/dto";
import { determineCategoryAvailability } from "@/app/(frontend)/org/[orgSlug]/inscricoes/utils/categories";
import Image from "next/image";
import {
  resendRegistrationConfirmation,
  updateRegistration,
} from "@/app/api/registrations/action";
import RegistrationStatusDropdown from "../RegistrationStatusDropdown";
import { EventRegistrationWithInfo } from "prisma/types/Registrations";
import { RegistrationsTable } from "./RegistrationsTable";
import { readAbsenceJustification } from "@/app/api/absences/action";

export default function RegistrationsContainer({
  registrations,
  modalitiesWithCategories,
}: {
  registrations: EventRegistrationWithInfo[];
  modalitiesWithCategories: ModalitiesWithCategories[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<null | EventRegistrationWithInfo>(null);

  function handleSelectedRegistration(registration: EventRegistrationWithInfo) {
    setSelectedRegistration(registration);
    setIsOpen(true);
  }

  const form = useForm<UpdateRegistrationDto>({
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
    action: resendRegistrationConfirmation,
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
      form.setValue(
        "justifiedAbsences",
        selectedRegistration?.justifiedAbsences ?? 0
      );
      form.setValue(
        "unjustifiedAbsences",
        selectedRegistration?.unjustifiedAbsences ?? 0
      );
      form.setValue("code", selectedRegistration?.code!);
      form.setValue(
        "additionalInfo.suspensionReason",
        selectedRegistration?.additionalInfo?.suspensionReason
      );
    }
  }, [selectedRegistration]);

  const {
    data: absenceJustificationData,
    trigger: triggerReadAbsenceJustificationData,
  } = useAction({
    action: readAbsenceJustification,
    onSuccess: (data) => window.open(data.data, "_blank"),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  const Field = useMemo(() => form.createField(), [form]);

  return (
    <>
      <Form hform={form} onSubmit={(data) => updateRegistrationTrigger(data)}>
        <Dialog open={isOpen} onClose={setIsOpen}>
          <DialogTitle>
            Editar Inscrição - {selectedRegistration?.user?.fullName}
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
                              selectedRegistration?.user?.info?.birthDate!,
                            gender: selectedRegistration?.user?.info?.gender!,
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
                {selectedRegistration?.RegistrationDocument?.length ? (
                  <>
                    <div
                      data-slot="label"
                      className="select-none text-base/6 font-medium text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6"
                    >
                      Documentos
                    </div>
                    <For each={selectedRegistration?.RegistrationDocument}>
                      {(doc) => (
                        <Link
                          href={
                            process.env.NEXT_PUBLIC_BUCKET_URL +
                            "/registrationDocuments/" +
                            doc.file
                          }
                        >
                          {doc.file}
                        </Link>
                      )}
                    </For>
                  </>
                ) : null}
                <Field name="code">
                  <Label>Número</Label>
                  <Input />
                  <ErrorMessage />
                  <Description>
                    Dois atletas não podem possuir o mesmo número. Letras são
                    permitidas.
                  </Description>
                </Field>
                <div className="flex gap-2">
                  <Field name="justifiedAbsences">
                    <Label>Ausências Justificadas</Label>
                    <Input type="number" />
                    <ErrorMessage />
                  </Field>
                  <Field name="unjustifiedAbsences">
                    <Label>Ausências Não Justificadas</Label>
                    <Input type="number" />
                    <ErrorMessage />
                  </Field>
                </div>
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
                        resendConfirmationTrigger({id: selectedRegistration.id, eventGroup: Boolean(selectedRegistration.eventGroupId)}, )
                      }
                    >
                      Reenviar QR Code
                    </Button>
                    <RegistrationStatusDropdown />
                  </div>
                </div>
                {form.watch("status") === "suspended" && (
                  <Field name="additionalInfo.suspensionReason">
                    <Label>Motivo da Suspensão</Label>
                    <Textarea />
                  </Field>
                )}
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
      <RegistrationsTable
        registrations={registrations}
        handleSelectedRegistration={handleSelectedRegistration}
      />
    </>
  );
}
