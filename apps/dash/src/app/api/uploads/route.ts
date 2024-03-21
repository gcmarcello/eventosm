import { NextRequest, NextResponse } from "next/server";
import { uploadFile, uploadPrivateFile } from "./service";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const folder = request.nextUrl.searchParams.get("folder");
    const privateFile = request.nextUrl.searchParams.get("private");
    const formData = await request.formData();
    const filesObj: { [formField: string]: { key: string; url: string } } = {};

    for (let [formField, value] of formData.entries()) {
      if (value instanceof File) {
        const url = privateFile
          ? await uploadPrivateFile(
              value,
              folder ? `${folder}${value.name}` : value.name
            )
          : await uploadFile(
              value,
              folder ? `${folder}${value.name}` : value.name
            );
        filesObj[formField] = { key: value.name, url: url };
      }
    }
    return NextResponse.json(filesObj);
  } catch (error) {
    throw error;
  }
}
