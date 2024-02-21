import { upsertEventDto } from "@/app/api/events/dto";
import dayjs from "dayjs";
import {
  Description,
  ErrorMessage,
  Fieldset,
  Label,
  Form,
  useForm,
  Select,
  Textarea,
  Input,
  showToast,
  useAction,
} from "odinkit/client";
import { Text } from "odinkit";
import { EventWithRegistrationCount } from "prisma/types/Events";
import { useMemo } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import { upsertEvent } from "@/app/api/events/action";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventGeneralInfo({
  event,
}: {
  event: EventWithRegistrationCount;
}) {
  const form = useForm({
    mode: "onChange",
    schema: upsertEventDto,
    defaultValues: {
      name: event.name,
      location: event.location,
      description: event.description ?? "",
      rules: event.rules ?? "",
      dateEnd: dayjs(event.dateEnd).utc().format("DD/MM/YYYY"),
      dateStart: dayjs(event.dateStart).utc().format("DD/MM/YYYY"),
      slug: event.slug,
      id: event.id,
    },
  });

  const {
    data: generalInfo,
    trigger: generalInfoTrigger,
    isMutating,
  } = useAction({
    action: upsertEvent,
    onSuccess: () => {
      showToast({
        message: "Informações gerais atualizadas com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: () => {
      showToast({
        message: "Erro ao atualizar informações gerais!",
        title: "Erro!",
        variant: "error",
      });
    },
  });

  const Field = useMemo(() => form.createField(), []);
  return (
    <Form
      id="EventGeneralInfoForm"
      hform={form}
      onSubmit={(data) => generalInfoTrigger(data)}
    >
      <Fieldset className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field className="col-span-2 lg:col-span-1" name="name">
          <Label>Nome do Evento</Label>
          <Input placeholder="10 KM da Rua 3" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="location">
          <Label>Local</Label>
          <Input placeholder="Rua 3" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="dateStart">
          <Label>Início do Evento</Label>
          <Input mask={"99/99/9999"} placeholder="01/01/2024" />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2 lg:col-span-1" name="dateEnd">
          <Label>Término do Evento</Label>
          <Input mask={"99/99/9999"} placeholder="02/01/2024" />
          <ErrorMessage />
        </Field>

        <Field className="col-span-2 lg:col-span-1" name="slug">
          <Label>Link do Evento</Label>
          <Input />
          <ErrorMessage />
          <Description className="flex gap-1">
            Letras minúsculas, números e hífens.
          </Description>
          <Text className="text-wrap italic">
            {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/org/
            {"exemplo"}
          </Text>
        </Field>
        {/* <Field className="col-span-2" name="details">
        <Label>Detalhes do Evento</Label>
        <Textarea placeholder="Detalhes do evento, aparecerão em destaque na página." />
        <ErrorMessage />
      </Field> */}
        <Field className="col-span-2" name="description">
          <Label>Descrição do Evento</Label>
          <Textarea placeholder="Informações gerais do evento." />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2" name="rules">
          <Label>Regulamento do Evento</Label>
          <Textarea placeholder="Regras do evento, aparecerão na página principal e durante a inscrição." />
          <ErrorMessage />
        </Field>
      </Fieldset>
    </Form>
  );
}
