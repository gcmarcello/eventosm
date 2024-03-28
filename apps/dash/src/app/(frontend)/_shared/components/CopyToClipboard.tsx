"use client";

import { showToast } from "odinkit/client";

export default function CopyToClipboard({
  str,
  children,
}: {
  str: string;
  children: React.ReactNode;
}) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(str);
      showToast({
        message: "Copiado para a àrea de transferência!",
        title: "Sucesso",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      showToast({
        message: "Erro ao copiar para a àrea de transferência!",
        title: "Erro",
        variant: "error",
      });
    }
  }

  return <div onClick={() => handleCopy()}>{children}</div>;
}
