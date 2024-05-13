export async function uploadFiles<T extends string>(
  files: { name?: T; file: File }[],
  folder?: string,
  privateFile: boolean = false
) {
  const formData = new FormData();
  if (!files) return;
  for (const file of files) {
    formData.append(file.name || crypto.randomUUID(), file.file);
  }
  const uploadedFiles: {
    [key in T]:
      | {
          key: string;
          url: string;
        }
      | undefined;
  } = await fetch(
    `/api/uploads` +
      "?" +
      (folder ? `folder=${folder}` : "") +
      `&private=${privateFile}`,
    {
      method: "POST",
      body: formData,
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      throw error;
    });

  return uploadedFiles;
}

export async function nestUpload<T extends string>({
  files,
  folder,
  privateFile = false,
  progress,
}: {
  files: { name?: T; file: File }[];
  folder?: string;
  privateFile?: boolean;
  progress?: (progress: number) => void;
}) {
  if (!files) return;
  let fileProgress = 0;
  let fileToUpload;
  let filesArray = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file.file);
    fileToUpload = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/uploads?" +
        (folder ? `folder=${folder}` : "") +
        `&private=${privateFile}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
        throw error;
      });
    if (progress) {
      fileProgress += 1;
      progress(fileProgress);
    }
    filesArray.push(fileToUpload);
  }

  return filesArray;
}
