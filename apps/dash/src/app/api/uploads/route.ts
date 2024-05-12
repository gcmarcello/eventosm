import { NextRequest, NextResponse } from "next/server";
import { uploadFile, uploadPrivateFile } from "./service";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const folder = request.nextUrl.searchParams.get("folder");
    const privateFile = request.nextUrl.searchParams.get("private");
    const formData = await request.formData();
    const filesObj: { [formField: string]: { key: string; url: string } } = {};

    for (let [formField, value] of formData.entries()) {
      if (value instanceof File) {
        const file =
          privateFile === "true"
            ? await uploadPrivateFile(value, value.name, folder)
            : await uploadFile(value, value.name, folder);
        filesObj[formField] = file;
      }
    }
    return NextResponse.json(filesObj);
  } catch (error) {
    throw error;
  }
}
