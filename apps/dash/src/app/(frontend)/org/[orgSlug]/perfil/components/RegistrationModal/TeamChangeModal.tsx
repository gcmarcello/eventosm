import { connectRegistrationToTeamDto } from "@/app/api/registrations/dto";
import { connectRegistrationToTeam } from "@/app/api/registrations/action";
import { EventRegistration, Organization, Team } from "@prisma/client";
import { SubmitButton } from "odinkit";
import {
  Button,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Form,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useState, useMemo, Dispatch, SetStateAction } from "react";

export function TeamChangeModal({
  registration,
  teams,
  organization,
  isTeamChangeOpen,
  setIsTeamChangeOpen,
}: {
  registration: EventRegistration;
  teams: Team[];
  organization: Organization;
  isTeamChangeOpen: boolean;
  setIsTeamChangeOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const connectTeamForm = useForm({
    schema: connectRegistrationToTeamDto,
    defaultValues: {
      registrationId: registration.id,
      teamId: "",
    },
  });
  const {
    data: connectRegistrationToTeamData,
    trigger: connectRegistrationToTeamTrigger,
  } = useAction({
    action: connectRegistrationToTeam,
    onSuccess: (data) => {
      setIsTeamChangeOpen(false);
      showToast({
        message: data.message || "Inscrição conectada à equipe com sucesso.",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({ message: error.message, variant: "error", title: "Erro!" });
    },
  });

  const Field = useMemo(() => connectTeamForm.createField(), []);

  return (
    <Form
      hform={connectTeamForm}
      onSubmit={(data) => connectRegistrationToTeamTrigger(data)}
    >
      <Dialog open={isTeamChangeOpen} onClose={setIsTeamChangeOpen}>
        <DialogTitle>Atribuir Equipe</DialogTitle>
        <DialogDescription>
          A sua inscrição será conectada à equipe escolhida, e será exibida nos
          seus resultados. <br />
        </DialogDescription>
        <DialogBody>
          <Field name="teamId">
            <Select
              displayValueKey="name"
              data={teams.map((team) => ({
                name: team.name,
                id: team.id,
              }))}
            />
            <Description>
              Não será possível alterar a equipe após a atribuição.
            </Description>
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsTeamChangeOpen(false);
              connectTeamForm.reset();
            }}
          >
            Cancelar
          </Button>
          <SubmitButton
            color={organization?.options.colors.primaryColor.tw.color}
          >
            Atribuir
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
