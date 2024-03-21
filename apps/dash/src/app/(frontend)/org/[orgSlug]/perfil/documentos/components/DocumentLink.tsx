"use client";
import { getUserDocument } from "@/app/api/users/action";
import { EyeIcon } from "@heroicons/react/24/outline";
import { UserDocument } from "@prisma/client";
import { useRouter } from "next/navigation";
import { showToast, useAction } from "odinkit/client";

export function DocumentLink({ document }: { document: UserDocument }) {
  const router = useRouter();
  const { data, trigger } = useAction({
    action: getUserDocument,
    onSuccess: (data) => window.open(data.data, "_blank"),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  return (
    <span
      className="flex w-full cursor-pointer items-center gap-2"
      onClick={() => trigger({ id: document.id })}
    >
      <EyeIcon className="size-4" /> Ver
    </span>
  );
}
