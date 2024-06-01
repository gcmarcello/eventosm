"use client";
import { TwitterShareButton } from "@/app/(frontend)/org/_shared/ShareButtons";
import { updateOrganization } from "@/app/api/orgs/action";
import { upsertOrganizationDto } from "@/app/api/orgs/dto";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import InstagramIcon from "node_modules/odinkit/src/icons/InstagramIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import YoutubeIcon from "node_modules/odinkit/src/icons/YoutubeIcon";
import { SubmitButton, Text, formatPhone } from "odinkit";
import {
  FieldGroup,
  ErrorMessage,
  Legend,
  useFormContext,
  Fieldset,
  Label,
  Input,
  Description,
  useForm,
  useAction,
  showToast,
  Form,
} from "odinkit/client";
import { useMemo } from "react";

export default function GeneralInfoSection({
  organization,
}: {
  organization: Organization;
}) {
  const form = useForm({
    mode: "onChange",
    schema: upsertOrganizationDto,
    defaultValues: {
      name: organization.name,
      document: organization.document,
      email: organization.email,
      phone: formatPhone(organization.phone || ""),
      slug: organization.slug,
      abbreviation: organization.abbreviation,
      options: {
        socialMedia: {
          facebook: organization.options?.socialMedia?.facebook || "",
          instagram: organization.options?.socialMedia?.instagram || "",
          twitter: organization.options?.socialMedia?.twitter || "",
          youtube: organization.options?.socialMedia?.youtube || "",
        },
      },
    },
  });

  const { trigger: updateTrigger, isMutating: isLoading } = useAction({
    action: updateOrganization,
    redirect: true,
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
    onSuccess: (data) =>
      showToast({
        message: "Organização atualizada com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
  });
  const Field = useMemo(() => form.createField(), []);

  return (
    <Form
      hform={form}
      onSubmit={(data) => {
        updateTrigger(data);
      }}
    >
      <Fieldset>
        <FieldGroup>
          <FieldGroup className="col-span-2">
            <Legend className="col-span-2 lg:col-span-1">
              Detalhes Gerais
            </Legend>
            <Text className="col-span-2 lg:col-span-1">
              Informações principais da organização.
            </Text>
          </FieldGroup>
          <Field className="col-span-2 lg:col-span-1" name="name">
            <Label>Nome da Organização</Label>
            <Input />
            <ErrorMessage />
          </Field>
          <Field className="col-span-2 lg:col-span-1 " name="document">
            <Label>CNPJ</Label>
            <Input mask={"99.999.999/9999-99"} />
            <Text className="flex gap-1">
              <InformationCircleIcon className="h-5 w-5" /> O CNPJ é opcional
            </Text>
            <ErrorMessage />
          </Field>
          <Field className="col-span-2 lg:col-span-1" name="email">
            <Label>Email da Organização</Label>
            <Input />
            <ErrorMessage />
          </Field>
          <Field className="col-span-2 lg:col-span-1" name="phone">
            <Label>Telefone da Organização</Label>
            <Input
              mask={(fieldValue: string) => {
                if (fieldValue.length > 14) {
                  return "(99) 99999-9999";
                } else {
                  return "(99) 9999-9999";
                }
              }}
            />
            <ErrorMessage />
          </Field>
          <Field className="col-span-2 lg:col-span-1" name="slug">
            <Label>Link do perfil</Label>
            <Input />
            <Description className="flex gap-1">
              Letras minúsculas, números e hífens.
            </Description>
            <Text className="text-wrap italic">
              {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/org/
              {form.watch("slug") || "exemplo"}
            </Text>
            <ErrorMessage />
          </Field>
        </FieldGroup>
        <FieldGroup className="pt-4">
          <div className="mb-4">
            <Legend>Mídias sociais</Legend>
            <Text>Links das mídias sociais da organização.</Text>
            <Text>Utilize o link completo, com "https://"</Text>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 ">
            <Field
              className="col-span-2 lg:col-span-1"
              name="options.socialMedia.facebook"
            >
              <Label>Facebook</Label>
              <Input
                icon={
                  <>
                    <FacebookIcon color="#9d9da2" size={20} />
                  </>
                }
              />

              <ErrorMessage />
            </Field>
            <Field
              className="col-span-2 lg:col-span-1"
              name="options.socialMedia.instagram"
            >
              <Label>Instagram</Label>
              <Input
                icon={
                  <>
                    <InstagramIcon color="#9d9da2" size={20} />
                  </>
                }
              />
              <ErrorMessage />
            </Field>
            <Field
              className="col-span-2 lg:col-span-1"
              name="options.socialMedia.twitter"
            >
              <Label>X / Twitter</Label>
              <Input
                icon={
                  <>
                    <XIcon color="#9d9da2" size={20} />
                  </>
                }
              />
              <ErrorMessage />
            </Field>
            <Field
              className="col-span-2 lg:col-span-1"
              name="options.socialMedia.youtube"
            >
              <Label>Youtube</Label>
              <Input
                icon={
                  <>
                    <YoutubeIcon color="#9d9da2" size={20} />
                  </>
                }
              />
              <ErrorMessage />
            </Field>
          </div>
        </FieldGroup>
      </Fieldset>
      <SubmitButton>Salvar</SubmitButton>
    </Form>
  );
}
