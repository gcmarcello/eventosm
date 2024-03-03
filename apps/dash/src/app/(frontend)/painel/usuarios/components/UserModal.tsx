import { updateUserDto } from "@/app/api/users/dto";
import { Field } from "@headlessui/react";
import dayjs from "dayjs";
import { date } from "odinkit";
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
  useForm,
} from "odinkit/client";
import { UserWithInfo } from "prisma/types/User";
import { Dispatch, SetStateAction, useMemo } from "react";

export default function UserModal({
  user,
  isOpen,
  setIsOpen,
}: {
  user: UserWithInfo;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Informações de Usuário</DialogTitle>
      {/* <DialogDescription>{user.fullName}</DialogDescription> */}
      <DialogBody></DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={() => setIsOpen(false)}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
