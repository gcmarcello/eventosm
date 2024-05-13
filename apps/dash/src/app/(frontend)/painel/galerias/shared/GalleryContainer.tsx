"use client";
import { upsertGalleryDto } from "@/app/api/galleries/dto";
import { Event, EventGroup, Gallery, Organization } from "@prisma/client";
import { BottomNavigation, SubmitButton, Text, z } from "odinkit";
import { Form, showToast, useAction, useForm } from "odinkit/client";
import { GalleryForm } from "./GalleryForm";
import React, { useMemo, useState } from "react";
import { upsertGallery } from "@/app/api/galleries/action";
import { nestUpload, uploadFiles } from "@/app/api/uploads/action";
import { set } from "lodash";

export function GalleryContainer({
  gallery,
  children,
}: {
  gallery?: Gallery & {
    Event?: Event | null;
    EventGroup?: EventGroup | null;
  };
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState<number>(0);
  const form = useForm({
    schema: upsertGalleryDto
      .omit({ mediaUrls: true })
      .merge(z.object({ medias: z.array(z.any()).optional() })),
    mode: "onChange",
    defaultValues: {
      eventGroupId: gallery?.eventGroupId ?? null,
      eventId: gallery?.eventId ?? null,
      name: gallery?.name,
      id: gallery?.id,
    },
  });

  const { data, trigger, isMutating } = useAction({
    action: upsertGallery,
    redirect: true,
    onSuccess: (data) => {
      showToast({
        message: "Galeria atualizada com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: "Erro ao atualizar galeria. " + error,
        title: "Erro",
        variant: "error",
      });
    },
  });

  return (
    <>
      <Form
        hform={form}
        onSubmit={async (data) => {
          const { medias, ...rest } = data;

          if (!medias?.length)
            return await upsertGallery({
              ...rest,
            });

          const uploadedFiles = await nestUpload({
            files: medias.map((m: any) => ({ file: m })),
            folder: "images/",
            progress: setProgress,
          });

          const urlArray = Object.values(uploadedFiles!)
            .map((f) => f?.key)
            .filter((f) => f) as string[];

          await trigger({
            ...rest,
            mediaUrls: uploadedFiles ? urlArray : undefined,
          });
        }}
      >
        <div className="pb-16 lg:pb-0">{children}</div>
        <BottomNavigation>
          <div className="flex items-center justify-end gap-2 p-2">
            <SubmitButton>Enviar</SubmitButton>{" "}
            {form.formState.isSubmitting && form.watch("medias") && (
              <Text>
                Enviando Arquivos... (
                {(progress / form.watch("medias")!.length) * 100}%)
              </Text>
            )}
          </div>
        </BottomNavigation>
      </Form>
    </>
  );
}
