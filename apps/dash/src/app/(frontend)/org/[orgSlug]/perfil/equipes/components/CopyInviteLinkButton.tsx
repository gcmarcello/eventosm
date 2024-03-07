"use client";
import { getServerEnv } from "@/app/api/env";
import { isDev } from "@/utils/settings";
import { Button } from "@headlessui/react";
import {
  ClipboardDocumentIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Organization } from "@prisma/client";
import { Text } from "odinkit";
import { showToast } from "odinkit/client";
import { OrganizationWithDomain } from "prisma/types/Organization";

export default function CopyInviteLinkButton({
  teamId,
  organization,
}: {
  teamId: string;
  organization: OrganizationWithDomain;
}) {
  async function handleLinkCopy() {
    if (organization?.OrgCustomDomain[0]?.domain) {
      await navigator.clipboard.writeText(
        `${isDev ? "http" : "https"}://${organization?.OrgCustomDomain[0].domain}/equipes/convite/${teamId}`
      );
    } else {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_SITE_URL}/org/${organization?.slug}/equipes/convite/${teamId}`
      );
    }

    showToast({
      message: "Link copiado!",
      title: "Sucesso",
      variant: "success",
    });
  }
  return (
    <Button
      onClick={async () => await handleLinkCopy()}
      className="flex grow cursor-pointer items-center  justify-center "
    >
      <ClipboardDocumentIcon
        style={{
          color: organization.options.colors.primaryColor.hex,
        }}
        className="size-5"
      />{" "}
      <Text
        className="px-2 text-sm  hover:underline"
        style={{ color: organization.options.colors.primaryColor.hex }}
      >
        Copiar link de convite
      </Text>{" "}
      <Text className="hidden xl:block">
        - atletas já cadastrados poderão se juntar à sua equipe.
      </Text>
    </Button>
  );
}
