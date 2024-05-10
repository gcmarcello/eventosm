import {
  Description,
  FieldGroup,
  Fieldset,
  Label,
  Select,
  useFormContext,
} from "odinkit/client";
import { filterCategories } from "../../../utils/categories";
import { useEffect, useMemo } from "react";
import { Text } from "odinkit";
import { Team } from "@prisma/client";
import { EventWithInfo } from "prisma/types/Events";
import dayjs from "dayjs";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
import { SignupRegistrationDto } from "@/app/api/registrations/events/event.dto";
dayjs.extend(parseCustomFormat);

export function SportDetails({
  event,
  teams,
  userInfo,
}: {
  event: EventWithInfo;
  teams?: Team[];
  userInfo: { gender: string; birthDate: Date };
}) {
  const form = useFormContext<SignupRegistrationDto>();
  const Field = useMemo(() => form.createField(), [form]);

  const categories = useMemo(() => {
    return filterCategories(
      event.EventModality.find(
        (mod) => mod.id === form.watch("registration.modalityId")
      )?.modalityCategory || [],
      {
        birthDate: dayjs(form.watch("info.birthDate"), "DD/MM/YYYY").toDate(),
        gender: form.watch("info.gender"),
      }
    );
  }, [
    form.watch("info.birthDate"),
    form.watch("info.gender"),
    form.watch("registration.modalityId"),
  ]);

  useEffect(() => {
    if (categories.length === 1)
      form.setValue("registration.categoryId", categories[0]?.id);
  }, [categories]);

  useEffect(() => {
    form.resetField("registration.categoryId", {
      defaultValue: "",
    });
  }, [form.watch("registration.modalityId")]);

  return (
    <Fieldset className={"grid grid-cols-2 lg:divide-x"}>
      <FieldGroup className="col-span-2 lg:col-span-2 lg:pe-4">
        {event.EventModality.length > 1 ? (
          <Field name="registration.modalityId">
            <Label>Selecionar Modalidade</Label>
            <Select
              data={event.EventModality}
              valueKey="id"
              displayValueKey="name"
            />
          </Field>
        ) : (
          <Text className="mb-3">
            Modalidade Única -{" "}
            {
              event.EventModality.find(
                (mod) => mod.id === form.getValues("registration.modalityId")
              )?.name
            }
          </Text>
        )}
        <Field name="registration.categoryId">
          <Label>Selecionar Categoria</Label>
          {form.watch("registration.modalityId") && categories.length === 0 ? (
            <Text>
              Não existe nenhuma categoria para sua idade e sexo nesta
              modalidade.
            </Text>
          ) : (
            <Select
              disabled={form.watch("registration.modalityId") === undefined}
              data={categories}
              valueKey="id"
              displayValueKey="name"
            />
          )}
          <Description>
            {form.watch("registration.modalityId") === undefined
              ? "Escolha uma modalidade para liberar as categorias."
              : categories.length === 0
                ? null
                : "As categorias exibidas são apenas as disponíveis para você."}
          </Description>
        </Field>
        {teams?.length ? (
          <Field name="teamId">
            <Label>Se inscrever com equipe</Label>
            <Select data={teams} valueKey="id" displayValueKey="name" />
            <Description>
              Você pode escolher sua equipe depois, mas não poderá alterar uma
              vez escolhida.
            </Description>
          </Field>
        ) : null}
      </FieldGroup>
    </Fieldset>
  );
}
