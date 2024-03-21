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
  const { colors } = usePanel();

  const { data, isMutating, trigger } = useAction({
    action: upsertEventGroup,
    redirect: true,
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  return (
    <MultistepForm
      hform={form}
      onSubmit={trigger}
      className="pb-20"
      order={["general", "rules"]}
      steps={{
        general: {
          fields: ["name", "slug", "eventGroupType", "registrationType"],
          form: <EventGroupGeneralInfo organization={organization} />,
        },
        rules: {
          fields: [
            "ruleLogic.mode",
            "ruleLogic.resultType",
            "ruleLogic.scoreCalculation",
          ],
          conditions: ["eventGroupType"],
          form: form.watch("eventGroupType") === "championship" && (
            <EventGroupRules organization={organization} />
          ),
        },
      }}
    >
      {({
        currentStep,
        hasNextStep,
        hasPrevStep,
        order,
        steps,
        isCurrentStepValid,
        walk,
      }) => {
        return (
          <>
            <div className={clsx("mb-4 space-y-2 pb-2 lg:mb-2")}>
              <For each={order}>
                {(step) => (
                  <Transition
                    show={step === order[currentStep]}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-0 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    {steps[step].form}
                  </Transition>
                )}
              </For>
            </div>

            <div
              className={clsx(
                "hidden justify-between lg:flex",
                !hasPrevStep && "flex-row-reverse"
              )}
            >
              {hasPrevStep && (
                <Button
                  type="button"
                  plain={true}
                  onClick={() => {
                    walk(-1);
                  }}
                >
                  Voltar
                </Button>
              )}

              {hasNextStep && (
                <Button
                  type="button"
                  color={organization.options.colors.primaryColor.tw.color}
                  onClick={() => {
                    walk(1);
                  }}
                  disabled={!isCurrentStepValid}
                >
                  Próximo
                </Button>
              )}

              {!hasNextStep && (
                <SubmitButton
                  color={organization.options.colors.primaryColor.tw.color}
                  disabled={!isCurrentStepValid}
                >
                  Inscrever
                </SubmitButton>
              )}
            </div>
            <BottomNavigation className={"block p-2 lg:hidden"}>
              <div
                className={clsx(
                  "flex justify-between",
                  !hasPrevStep && "flex-row-reverse"
                )}
              >
                {hasPrevStep && (
                  <Button
                    type="button"
                    onClick={() => {
                      walk(-1);
                    }}
                  >
                    Voltar
                  </Button>
                )}

                {hasNextStep && (
                  <Button
                    type="button"
                    color={organization.options.colors.primaryColor.tw.color}
                    onClick={() => {
                      walk(1);
                    }}
                    disabled={!isCurrentStepValid}
                  >
                    Próximo
                  </Button>
                )}

                {!hasNextStep && (
                  <SubmitButton
                    color={organization.options.colors.primaryColor.tw.color}
                    disabled={!isCurrentStepValid}
                  >
                    Inscrever
                  </SubmitButton>
                )}
              </div>
            </BottomNavigation>
          </>
        );
      }}
    </MultistepForm>
  );
}

function EventGroupGeneralInfo({
  organization,
}: {
  organization: Organization;
}) {
  const form = useFormContext<UpsertEventGroupDto>();
  const Field = useMemo(() => form.createField(), []);
  return (
    <Fieldset>
      <Legend>Informações Gerais</Legend>
      <Text>
        Informações gerais sobre o grupo de eventos. Você pode alterar essas
        informações a qualquer momento.
      </Text>
      <FieldGroup className="grid grid-cols-2 gap-3 lg:divide-x ">
        <div className="col-span-2 space-y-3 px-2 lg:col-span-1">
          <Field name="name">
            <Label>Nome</Label>
            <Input />
            <ErrorMessage />
          </Field>
          <Field name="slug">
            <Label>Link do Grupo de Eventos</Label>
            <Input />
            <Description className={"text-wrap text-xs"}>
              https://eventosm.com.br/org/{`${organization.slug}`}/eventos/
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
        </div>
        <div className={"col-span-2 flex-col lg:col-span-1 lg:flex lg:ps-6"}>
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
        </div>
      </FieldGroup>
    </Fieldset>
  );
}

function EventGroupRules({ organization }: { organization: Organization }) {
  const form = useFormContext<UpsertEventGroupDto>();
  const Field = useMemo(() => form.createField(), []);
  return (
    <Fieldset>
      {form.watch("eventGroupType") === "championship" && (
        <div className="mt-4 space-y-6 px-2">
          <div className="mb-2 mt-4">
            <Legend>Regras do Campeonato</Legend>
            <Text>
              Todas as etapas do torneio seguirão este mesmo regulamento.
            </Text>
          </div>
          <FieldGroup className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-3 px-2 lg:col-span-1">
              <Field
                className={"col-span-2 lg:col-span-1"}
                name="ruleLogic.mode"
              >
                <Label>Modo do Campeonato</Label>
                <RadioGroup>
                  <RadioField>
                    <Radio
                      color={organization.options.colors.primaryColor.tw.color}
                      value="league"
                    />
                    <Label>Liga</Label>
                    <Description>
                      Modo de torneio em que os participantes jogam entre si e
                      acumulam pontos.
                    </Description>
                  </RadioField>
                  <RadioField>
                    <Radio
                      disabled
                      color={organization.options.colors.primaryColor.tw.color}
                      value="cup"
                    />
                    <Label>Copa</Label>
                    <Description>
                      Modo de torneio em que os participantes participam de
                      rodadas eliminatórias.
                    </Description>
                  </RadioField>
                  <ErrorMessage />
                </RadioGroup>

                <ErrorMessage />
              </Field>
            </div>
            <div className="col-span-2 space-y-8 px-2 lg:col-span-1 lg:ps-6">
              <Field name="ruleLogic.resultType">
                <Label>Tipo de Pontuação</Label>
                <Select
                  displayValueKey="name"
                  data={[
                    { id: "time", name: "Tempo" },
                    { id: "points", name: "Pontos" },
                  ]}
                />
                <Description className={"text-sm"}>
                  {form.watch("ruleLogic.resultType") === "time"
                    ? "Os participantes acumulam tempos e são rankeados de acordo com o menor resultado."
                    : form.watch("ruleLogic.resultType")
                      ? "Os participantes acumulam pontos após as etapas ou rodadas do torneio."
                      : ""}
                </Description>
                <ErrorMessage />
              </Field>
              <Field name="ruleLogic.scoreCalculation">
                <Label>Cálculo de Pontos</Label>
                <Select
                  displayValueKey="name"
                  data={[
                    { id: "sum", name: "Soma" },
                    { id: "average", name: "Média" },
                  ]}
                />
                <Description className={"text-sm"}>
                  {form.watch("ruleLogic.scoreCalculation") === "sum"
                    ? `O ranking do torneio é calculado à partir ${form.watch("ruleLogic.resultType") === "points" ? "da soma de pontos" : "da soma de tempos"} de cada participante. ${form.watch("ruleLogic.resultType") === "points" ? "O participante com mais pontos é o vencedor." : form.watch("ruleLogic.resultType") ? "O participante com menos tempo é o vencedor." : ""}`
                    : form.watch("ruleLogic.scoreCalculation")
                      ? `O ranking do torneio é calculado à partir ${form.watch("ruleLogic.resultType") === "points" ? "da média de pontos" : "da média de tempos"} de cada participante. ${form.watch("ruleLogic.resultType") === "points" ? "O participante com mais pontos é o vencedor." : form.watch("ruleLogic.resultType") ? "O participante com menos tempo é o vencedor." : ""}`
                      : ""}
                </Description>
                <ErrorMessage />
              </Field>
            </div>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-8 px-2 lg:col-span-1 lg:ps-6 ">
              <Field name="ruleLogic.discard">
                <Label>Etapas Descartadas</Label>
                <Input type="text" inputMode="numeric" />
                <ErrorMessage />
                <Description>
                  Número de etapas que terão os resultados descartados para a
                  soma do ranking.
                </Description>
              </Field>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-3 px-2 lg:col-span-1 lg:ps-6">
              <Field name="ruleLogic.justifiedAbsences">
                <Label>Ausências Justificadas</Label>
                <Input type="text" inputMode="numeric" />
                <ErrorMessage />
                <Description>
                  Número de ausências justificadas permitidas antes da
                  eliminação.
                </Description>
              </Field>
              <Field name="ruleLogic.unjustifiedAbsences">
                <Label>Ausências não Justificadas</Label>
                <Input type="text" inputMode="numeric" />
                <ErrorMessage />
                <Description>
                  Número de ausências não justificadas permitidas antes da
                  eliminação.
                </Description>
              </Field>
            </div>
          </FieldGroup>
        </div>
      )}
    </Fieldset>
  );
}
