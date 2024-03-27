import { resendConfirmationEmail } from "@/app/api/auth/action";
import { updateUserDto } from "@/app/api/users/dto";
import { Field } from "@headlessui/react";
import dayjs from "dayjs";
import { LoadingSpinner, date, formatCEP, formatCPF } from "odinkit";
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
  Form,
  Input,
  Label,
  Switch,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { UserWithInfo } from "prisma/types/User";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

export default function UserModal({
  user,
  isOpen,
  setIsOpen,
}: {
  user: UserWithInfo;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [sentEmail, setSentEmail] = useState(false);

  const {
    data: resendData,
    trigger: resendTrigger,
    isMutating: resendMutation,
  } = useAction({
    action: resendConfirmationEmail,
    onSuccess: () => {
      setSentEmail(true);
      showToast({
        message: "Email de confirmação reenviado com sucesso!",
        variant: "success",
      });
    },
  });

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => {
      setSentEmail(false);
    }, 300);
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>Informações de Usuário</DialogTitle>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Nome Completo
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.fullName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Data de Nascimento
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {dayjs(user.info.birthDate).format("DD/MM/YYYY")}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Documento
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatCPF(user.document)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Endereço
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.info.address}, {user.info.number} - {user.info.complement}.{" "}
              <br />
              {user.info.city?.name} - {user.info.state?.name},{" "}
              {formatCEP(user.info.zipCode)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Status da Conta
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.confirmed ? (
                <>Confirmada</>
              ) : sentEmail ? (
                "Email de confirmação reenviado!"
              ) : resendMutation ? (
                <LoadingSpinner />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-red-600">
                    Não Confirmada
                  </div>
                  <div
                    onClick={() => resendTrigger({ userId: user.id })}
                    className="cursor-pointer text-xs underline hover:no-underline"
                  >
                    (Reenviar confirmação)
                  </div>
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>
      <DialogBody></DialogBody>
      <DialogActions>
        <Button plain onClick={handleClose}>
          Sair
        </Button>
      </DialogActions>
    </Dialog>
  );
}
