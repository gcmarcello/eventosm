"use client";
import { upsertGalleryDto } from "@/app/api/galleries/dto";
import { Event, EventGroup, Gallery, Organization } from "@prisma/client";
import { BottomNavigation, SubmitButton, Text, z } from "odinkit";
import { Form, useForm } from "odinkit/client";
import { GalleryForm } from "./GalleryForm";
import React, { useMemo } from "react";
import { upsertGallery } from "@/app/api/galleries/action";
import { uploadFiles } from "@/app/api/uploads/action";

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

          const uploadedFiles = await uploadFiles(
            medias.map((m: any) => ({ file: m })),
            "images/"
          );

          const urlArray = Object.values(uploadedFiles!)
            .map((f) => f?.url)
            .filter((f) => f) as string[];

          await upsertGallery({
            ...rest,
            mediaUrls: uploadedFiles ? urlArray : undefined,
          });
        }}
      >
        <div className="pb-16 lg:pb-0">{children}</div>
        <BottomNavigation>
          <div className="flex items-center justify-end gap-2 p-2">
            <SubmitButton>Enviar</SubmitButton>{" "}
            {form.formState.isSubmitting && <Text>Enviando Arquivos...</Text>}
          </div>
        </BottomNavigation>
      </Form>
    </>
  );
}
