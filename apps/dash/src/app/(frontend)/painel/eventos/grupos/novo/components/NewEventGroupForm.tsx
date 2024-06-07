"use client";
import { UpsertEventGroupDto, upsertEventGroupDto } from "@/app/api/events/dto";
import {
  BottomNavigation,
  ButtonSpinner,
  For,
  SubmitButton,
  Text,
} from "odinkit";
import {
  Button,
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Legend,
  MultistepForm,
  Radio,
  RadioField,
  RadioGroup,
  Select,
  showToast,
  useAction,
  useForm,
  useFormContext,
} from "odinkit/client";
import { useMemo } from "react";
import { upsertEventGroup } from "@/app/api/events/action";
import { EventGroup, Organization } from "@prisma/client";
import { EventGroupWithEvents } from "prisma/types/Events";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { usePanel } from "@/app/(frontend)/admin/_shared/components/PanelStore";
import { SubmitContainer } from "../../../_shared/components/SubmitContainer";

export default function EventGroupForm({
  organization,
  eventGroup,
}: {
  organization: Organization;
  eventGroup?: EventGroupWithEvents;
}) {
  const form = useForm({
    id: "EventGroupForm",
    schema: upsertEventGroupDto,
    mode: "onChange",
    defaultValues: {
      id: eventGroup?.id,
      eventGroupType: eventGroup?.eventGroupType || "championship",
      ruleLogic: {
        mode: "league",
        resultType: "time",
        scoreCalculation: "average",
      },
      registrationType: undefined,
    },
  });

  const { data, isMutating, trigger } = useAction({
    action: upsertEventGroup,
    redirect: true,
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <Form hform={form} onSubmit={(data) => trigger(data)}>
      {" "}
      <Fieldset>
        <Legend>Informações Gerais</Legend>
        <FieldGroup>
          <Field name="name">
            <Label>Nome</Label>
            <Input />
            <ErrorMessage />
          </Field>
          <Field name="slug">
            <Label>Link do Grupo de Eventos</Label>
            <Input />
            <Description className={"text-wrap text-xs"}>
              https://eventosm.com.br/org/{`${organization.slug}`}
              /campeonatos/
              <span className="font-semibold">{`${form.watch("slug") || "exemplo"}`}</span>
            </Description>
            <ErrorMessage />
          </Field>
          <Field name="eventGroupType">
            <Label>Tipo de Grupo de Eventos</Label>
            <Select
              displayValueKey="name"
              onChange={() => form.resetField("rules")}
              data={[
                { id: "championship", name: "Torneio" },
                { id: "free", name: "Livre" },
              ]}
            />
            <ErrorMessage />
            <Description className={"text-sm"}>
              Você pode escolher entre criar um grupo de eventos do estilo
              livre, ou criar seu próprio torneio com regras customizadas.
            </Description>
          </Field>
          <Field enableAsterisk={false} name="registrationType">
            <Label>Estilo de Inscrição</Label>
            <RadioGroup>
              <RadioField>
                <Radio
                  color={organization.options.colors.primaryColor.tw.color}
                  value="individual"
                />
                <Label>Individual</Label>
                <Description>
                  Inscrições podem ser feitas apenas por atletas.
                </Description>
              </RadioField>
              <RadioField>
                <Radio
                  color={organization.options.colors.primaryColor.tw.color}
                  value="team"
                />
                <Label>Equipes</Label>
                <Description>
                  Inscrições podem ser feitas apenas por equipes.
                </Description>
              </RadioField>
              <RadioField>
                <Radio
                  color={organization.options.colors.primaryColor.tw.color}
                  value="mixed"
                />
                <Label>Mista</Label>
                <Description>
                  Inscrições podem ser feitas por atletas ou equipes.
                </Description>
              </RadioField>
            </RadioGroup>
          </Field>
        </FieldGroup>
      </Fieldset>
      <SubmitContainer />
    </Form>
  );
}
