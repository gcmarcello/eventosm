"use client";
import { nestUpload } from "@/app/api/uploads/action";
import { RichTextEditor } from "odinkit/client";

export function RTE() {
  if (!process.env.NEXT_PUBLIC_BUCKET_URL)
    throw new Error("NEXT_PUBLIC_BUCKET_URL not defined");
  return (
    <RichTextEditor
      uploadFn={nestUpload}
      fileUploadPath={process.env.NEXT_PUBLIC_BUCKET_URL + "/uploads/"}
    />
  );
}
