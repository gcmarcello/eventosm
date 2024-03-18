"use client";
import { upsertNews } from "@/app/api/news/action";
import { upsertNewsDto } from "@/app/api/news/dto";
import { uploadFiles } from "@/app/api/uploads/action";
import { News } from "@prisma/client";
import { FileImagePreview, SubmitButton, Text, slugify } from "odinkit";
import {
  Description,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  RichTextEditor,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { OrganizationWithDomain } from "prisma/types/Organization";
import { useEffect, useMemo } from "react";
import { z } from "zod";

export function NewsForm({
  news,
  organization,
}: {
  news?: News;
  organization: OrganizationWithDomain;
}) {
  const form = useForm({
    schema: upsertNewsDto.omit({ imageUrl: true }).merge(
      z.object({
        image: z.array(z.any()).optional(),
      })
    ),
    mode: "onChange",
    defaultValues: {
      id: news?.id,
      content: news?.content,
      slug: news?.slug || "",
      status: news?.status,
      subtitle: news?.subtitle || "",
      title: news?.title,
    },
  });

  const { data, trigger, isMutating } = useAction({
    action: upsertNews,
    redirect: true,
    onSuccess: (res) => {
      showToast({
        message: res.message || "Sucesso",
        title: "Sucesso!",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (news?.slug) return;
    form.setValue("slug", slugify(form.watch("title") || ""));
  }, [form.watch("title")]);

  const Field = useMemo(() => form.createField(), []);

  return (
    <Form
      hform={form}
      onSubmit={async (data) => {
        const { image, ...rest } = data;

        const uploadedFiles = await uploadFiles(
          [{ name: "image", file: image ? image[0] : [] }],
          "news/"
        );

        await trigger({
          ...rest,
          imageUrl: uploadedFiles?.image?.url ?? news?.imageUrl,
        });
      }}
    >
      <Fieldset>
        <div className="flex justify-end">
          <SubmitButton
            color={organization.options.colors.primaryColor.tw.color}
          >
            Salvar
          </SubmitButton>
        </div>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field name="title">
              <Label>Título</Label>
              <Input />
            </Field>
            <Field name="subtitle">
              <Label>Subtítulo</Label>
              <Input />
            </Field>
            <Field name="slug">
              <Label>Link</Label>
              <Input />
              <Description>
                {organization.OrgCustomDomain[0]?.domain
                  ? `${organization.OrgCustomDomain[0]?.domain}/noticias/${form.watch("slug")}`
                  : `${process.env.NEXT_PUBLIC_SITE_URL}/org/${organization.slug}/noticias/${form.watch("slug")}`}
              </Description>
            </Field>
            <Field name="status">
              <Label>Status da Notícia</Label>
              <Select
                displayValueKey="name"
                data={[
                  { id: "draft", name: "Rascunho" },
                  { id: "archived", name: "Arquivada" },
                  { id: "published", name: "Publicada" },
                ]}
              />
            </Field>
            <Field name="image" className="col-span-1 lg:col-span-2">
              <Label>Imagem da Notícia</Label>
              <FileInput
                fileTypes={["png", "jpg", "jpeg"]}
                maxFiles={1}
                maxSize={1}
                onError={(error) => {
                  if (typeof error === "string") {
                    showToast({
                      message: error,
                      title: "Erro",
                      variant: "error",
                    });
                  }
                }}
              >
                <FileDropArea
                  render={
                    form.watch("image")?.length ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivo:</span>{" "}
                          {form.watch("image")?.[0].name}{" "}
                          <span
                            onClick={() => {
                              form.resetField("image");
                            }}
                            className="cursor-pointer font-semibold text-emerald-600"
                          >
                            Trocar
                          </span>
                        </Text>
                      </>
                    ) : null
                  }
                />
              </FileInput>
              <div className="my-3">
                <FileImagePreview defaultValue={news?.imageUrl || ""} />
              </div>
            </Field>
            <Field name="content" className="col-span-1 lg:col-span-2">
              <Label>Descrição do Grupo de Eventos</Label>
              <RichTextEditor />
            </Field>
          </div>
        </FieldGroup>
      </Fieldset>
    </Form>
  );
}
