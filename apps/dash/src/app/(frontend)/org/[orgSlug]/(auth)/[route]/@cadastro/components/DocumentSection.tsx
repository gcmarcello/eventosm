"use client";
import { Alertbox, Link, Text, cpfValidator } from "odinkit";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
  useAction,
  useFormContext,
} from "odinkit/client";
import { Input } from "odinkit/client";
import { Switch } from "@headlessui/react";
import { useMemo } from "react";
import { SignupDto } from "@/app/api/auth/dto";
import { readUserFromDocument } from "@/app/api/auth/action";
import { Organization } from "@prisma/client";

export default function DocumentSection({
  organization,
  eventId,
}: {
  organization: Organization;
  eventId?: string;
}) {
  const form = useFormContext<SignupDto>();
  const Field = useMemo(() => form.createField(), []);
  const {
    trigger: findDocument,
    isMutating: loadingDocument,
    data: documentData,
  } = useAction({
    action: readUserFromDocument,
    onError: (data) => console.log(data),
    onSuccess: ({ data }) => {
      if (data?.existent)
        form.setError("root.serverError", {
          message:
            data.type === "sameorg"
              ? "Este CPF já possui uma conta"
              : "Este CPF já possui uma conta EventoSM",
        });
    },
  });

  return (
    <Fieldset>
      {form.formState.errors.root?.serverError && (
        <Alertbox className="my-2" type="error">
          {form.formState.errors.root.serverError.message}!{" "}
          <br className="lg:hidden" />{" "}
          <Link
            className="me-1 font-medium underline"
            href={eventId ? "/login" : `/login?redirect=inscricoes/${eventId}`}
          >
            Clique aqui
          </Link>
          para ir à página de login ou recuperação de senha.
        </Alertbox>
      )}
      <Legend>Identificação</Legend>
      <Text>Insira seu documento para identificação.</Text>
      <FieldGroup>
        <div>
          <div>
            {!form.getValues("foreigner") ? (
              <Field name="document" className="my-2 space-y-3">
                <Label>Documento {"(CPF)"}</Label>
                <Input
                  inputMode="tel"
                  mask={"999.999.999-99"}
                  loading={loadingDocument}
                  onChange={(e) => {
                    if (form.formState.errors.root?.serverError)
                      form.clearErrors("root.serverError");
                    if (
                      e.target.value.length === 14 &&
                      cpfValidator(e.target.value)
                    ) {
                      findDocument({
                        document: e.target.value,
                        organizationId: organization.id,
                      });
                    }
                  }}
                  placeholder="999.999.999-99"
                />
                <ErrorMessage />
              </Field>
            ) : (
              <Field name="foreignDocument" className="my-2 space-y-3">
                <Label>Documento {"(Passaporte ou RNE)"}</Label>
                <Input />
                <ErrorMessage />
              </Field>
            )}
            <Field name="foreigner">
              <Switch
                onChange={() => {
                  form.setValue("foreigner", !form.getValues("foreigner"));
                  form.resetField("document");
                  form.resetField("foreignDocument");
                }}
              >
                {({ checked }) => (
                  <Description>
                    {checked ? (
                      <>
                        <span className="underline">Clique aqui</span> para usar
                        seu CPF.
                      </>
                    ) : (
                      <>
                        Estrangeiro?{" "}
                        <span className="underline">clique aqui!</span>
                      </>
                    )}
                  </Description>
                )}
              </Switch>
            </Field>
          </div>
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
