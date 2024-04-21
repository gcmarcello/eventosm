import { adminUpdateUser } from "@/app/api/admin/users/action";
import { adminUpdateUserDto } from "@/app/api/admin/users/dto";
import { updateUserDto } from "@/app/api/users/dto";
import { Field } from "@headlessui/react";
import dayjs from "dayjs";
import {
  Alertbox,
  ErrorText,
  SubmitButton,
  cpfValidator,
  date,
  formatCEP,
  formatCPF,
  formatPhone,
  normalizeDocument,
  normalizePhone,
  normalizeZipCode,
} from "odinkit";
import {
  Button,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Select,
  Switch,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { normalize } from "path";
import { UserWithInfo } from "prisma/types/User";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";

export default function UserModal({
  user,
  isOpen,
  setIsOpen,
}: {
  user: UserWithInfo;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm({
    schema: adminUpdateUserDto,
    mode: "onChange", // 'onBlur' | 'onChange' | 'onSubmit
    defaultValues: {
      userId: user.id,
      role: user.role,
      confirmed: user.confirmed,
      document: cpfValidator(user.document)
        ? formatCPF(user.document)
        : user.document,
      email: user.email,
      fullName: user.fullName,
      phone: formatPhone(user.phone),
      info: {
        zipCode: formatCEP(user.info?.zipCode) || undefined,
        address: user.info?.address || undefined,
        cityId: user.info?.cityId || undefined,
        stateId: user.info?.stateId || undefined,
        number: user.info?.number || undefined,
        complement: user.info?.complement || undefined,
        gender: user.info.gender,
        support: user.info?.support || undefined,
        birthDate: date(user.info?.birthDate, "DD/MM/YYYY"),
      },
    },
  });

  const {
    data: userData,
    trigger: updateUserTrigger,
    isMutating: isUpdatingUser,
  } = useAction({
    action: adminUpdateUser,
    requestParser: (data) => {
      return {
        ...data,
        phone: normalizePhone(data.phone),
        document: normalizeDocument(data.document),
        info: {
          ...data.info,
          zipCode: normalizeZipCode(data.info.zipCode),
          birthDate: dayjs(data.info.birthDate, "DD/MM/YYYY").toISOString(),
        },
      };
    },
    onSuccess: () => {
      setIsOpen(false);
      showToast({
        variant: "success",
        message: "Usuário atualizado com sucesso.",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({
        variant: "error",
        message: error.message,
        title: "Erro!",
      });
    },
  });

  useEffect(
    () =>
      form.reset({
        userId: user.id,
        role: user.role,
        confirmed: user.confirmed,
        document: cpfValidator(user.document)
          ? formatCPF(user.document)
          : user.document,
        email: user.email,
        fullName: user.fullName,
        phone: formatPhone(user.phone),
        info: {
          zipCode: formatCEP(user.info?.zipCode) || undefined,
          address: user.info?.address || undefined,
          cityId: user.info?.cityId || undefined,
          stateId: user.info?.stateId || undefined,
          number: user.info?.number || undefined,
          complement: user.info?.complement || undefined,
        },
      }),
    [user]
  );

  const Field = useMemo(() => form.createField(), []);

  return (
    <Form hform={form} onSubmit={(data) => updateUserTrigger(data)}>
      <Dialog size="7xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Editar Usuário</DialogTitle>
        {/* <DialogDescription>{user.fullName}</DialogDescription> */}
        <DialogBody>
          <div className="my-4">
            {user.email !== form.watch("email") && (
              <Alertbox type="warning" className="mb-3">
                O usuário receberá um e-mail com a confirmação da alteração do
                seu endereço de e-mail.
              </Alertbox>
            )}
            <div>
              <Fieldset className={"mb-5"}>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x">
                  <FieldGroup className="lg:pe-3">
                    <Field name="fullName">
                      <Label>Nome Completo</Label>
                      <Input />
                      <ErrorMessage />
                    </Field>
                    <Field name="email">
                      <Label>Email</Label>
                      <Input />
                      <ErrorMessage />
                    </Field>
                    <Field name="phone">
                      <Label>Telefone</Label>
                      <Input
                        inputMode="tel"
                        placeholder="(99) 99999-9999"
                        mask={(fieldValue: string) => {
                          if (fieldValue.length > 14) {
                            return "(99) 99999-9999";
                          } else {
                            return "(99) 9999-9999";
                          }
                        }}
                      />
                      <ErrorMessage />
                    </Field>
                    <Field name="document" className="my-2 space-y-3">
                      <Label>CPF</Label>
                      <Input inputMode="tel" />
                      <ErrorMessage />
                    </Field>
                  </FieldGroup>
                  <FieldGroup className="lg:ps-3">
                    <Field name="info.gender">
                      <Label>Sexo</Label>
                      <Select
                        displayValueKey="name"
                        data={[
                          { id: "female", name: "Feminino" },
                          { id: "male", name: "Masculino" },
                        ]}
                      ></Select>
                      <ErrorMessage />
                    </Field>
                    <Field name="info.birthDate">
                      <Label>Data de Nascimento</Label>
                      <Input />
                    </Field>
                    <Field name="info.support">
                      <Label>Apoio/Patrocínio</Label>
                      <Input />
                    </Field>
                    <Field variant="switch" name="confirmed">
                      <Label>Confirmado</Label>
                      <Description>
                        Selecione se deseja que a conta esteja confirmada.
                      </Description>
                      <Switch color="indigo" />
                    </Field>
                  </FieldGroup>
                </div>
              </Fieldset>
              <Fieldset>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field name="info.zipCode">
                    <Label>CEP</Label>
                    <Input
                      inputMode="tel"
                      mask={(fieldValue: string) => {
                        if (fieldValue.length > 8) {
                          return "99999-999";
                        } else {
                          return "99999-999";
                        }
                      }}
                    />
                  </Field>
                  <Field name="info.address">
                    <Label>Endereço</Label>
                    <Input />
                  </Field>
                  <Field name="info.number">
                    <Label>Número</Label>
                    <Input />
                  </Field>
                  <Field name="info.complement">
                    <Label>Complemento</Label>
                    <Input />
                  </Field>
                </div>
              </Fieldset>
              <Fieldset>
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <Field name="role">
                    <Label>Tipo de Usuário</Label>
                    <Select
                      displayValueKey="name"
                      data={[
                        { id: "admin", name: "Administrador" },
                        { id: "user", name: "Usuário" },
                      ]}
                    ></Select>
                  </Field>
                </div>
              </Fieldset>
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <SubmitButton>Enviar</SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
