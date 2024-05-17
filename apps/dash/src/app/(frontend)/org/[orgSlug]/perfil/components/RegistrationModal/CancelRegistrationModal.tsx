import { cancelRegistration } from "@/app/api/registrations/action";
import { SubmitButton } from "odinkit";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertBody,
  AlertActions,
  useForm,
  Form,
  Button,
  Input,
  useAction,
  showToast,
} from "odinkit/client";
import { EventGroupRegistration } from "prisma/types/Registrations";
import { Dispatch, SetStateAction, useMemo } from "react";

import { z } from "zod";

export function CancelRegistrationModal({
  isOpen,
  setIsOpen,
  registration,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  registration: EventGroupRegistration;
}) {
  const form = useForm({
    schema: z.object({ confirm: z.literal("Cancelar") }),
  });

  const {
    data: cancelData,
    trigger: cancelTrigger,
    isMutating,
  } = useAction({
    action: cancelRegistration,
    redirect: true,
    onSuccess: () => {
      setIsOpen(false);
      showToast({
        message: "Inscrição cancelada com sucesso",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({ message: error.message, variant: "error", title: "Erro!" });
    },
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <Form
        hform={form}
        onSubmit={() => cancelTrigger({ registrationId: registration.id })}
      >
        <Alert open={isOpen} onClose={setIsOpen}>
          <AlertTitle>
            Você tem certeza que deseja cancelar sua inscrição no(a){" "}
            {registration.eventGroup?.name}?
          </AlertTitle>
          <AlertDescription>
            A inscrição será cancelada automaticamente para todas as etapas, e
            você ficará impossibilitado de participar do evento. A possibilidade
            de reinscrição estará sujeita a disponibilidade de vagas.
          </AlertDescription>
          <AlertBody>
            <Field name="confirm">
              <Input placeholder={`Digite "Cancelar" para confirmar`} />
            </Field>
          </AlertBody>
          <AlertActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Voltar
            </Button>
            <SubmitButton color={"red"}>Cancelar Inscrição</SubmitButton>
          </AlertActions>
        </Alert>
      </Form>
    </>
  );
}
