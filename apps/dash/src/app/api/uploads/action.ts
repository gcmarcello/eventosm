export async function uploadFiles<T extends string>(
  files: { name: T; file: File }[],
  folder?: string
) {
  const formData = new FormData();
  if (!files) return;
  for (const file of files) {
    formData.append(file.name, file.file);
  }
  const uploadedFiles: {
    [key in T]:
      | {
          key: string;
          url: string;
        }
      | undefined;
  } = await fetch(`/api/uploads` + (folder ? `?folder=${folder}` : ""), {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      throw error;
    });

  return uploadedFiles;
}
