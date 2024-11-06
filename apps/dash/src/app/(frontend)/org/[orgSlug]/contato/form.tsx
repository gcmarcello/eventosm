"use client";

import form from "@/app/(frontend)/painel/eventos/grupos/[id]/geral/form";
import { createOrgTicket } from "@/app/api/contact/action";
import { createOrgTicketDto } from "@/app/api/contact/dto";
import { Alertbox, SubmitButton } from "odinkit";
import {
  Form,
  Input,
  Label,
  Textarea,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo, useState } from "react";

export function TicketForm({ organizationId }: { organizationId: string }) {
  const form = useForm({
    schema: createOrgTicketDto,
    defaultValues: {
      organizationId,
    },
  });
  const [success, setSuccess] = useState(false);
  const Field = useMemo(() => form.createField(), [form]);

  const { trigger, data } = useAction({
    action: createOrgTicket,
  });

  if (data) {
    return (
      <Alertbox type="success">
        <div className="space-y-2">
          <p>Chamado criado com sucesso! </p>
          <p>
            Protocolo: <span className="font-semibold">{data.id}</span>
          </p>
          <p>
            Enviamos uma confirmação do protocolo para o seu email. Em breve
            entraremos em contato.
          </p>
        </div>
      </Alertbox>
    );
  }

  return (
    <Form className="pb-4" hform={form} onSubmit={(data) => trigger(data)}>
      <Field name="name">
        <Label>Nome</Label>
        <Input />
      </Field>
      <Field name="email">
        <Label>Email</Label>
        <Input />
      </Field>
      <Field name="phone">
        <Label>Telefone</Label>
        <Input />
      </Field>

      <Field name="message">
        <Label>Mensagem</Label>
        <Textarea rows={6} />
      </Field>
      <div className="mt-4 flex justify-end">
        <SubmitButton>Enviar</SubmitButton>
      </div>
    </Form>
  );
}
