import { Inter } from "next/font/google";
import { CompanyNavbar } from "../_shared/Navbar";
import clsx from "clsx";
import { readOrganizations } from "@/app/api/orgs/service";
import { notFound } from "next/navigation";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { OrgStore } from "./components/OrgStore";
import type { Metadata, ResolvingMetadata } from "next";
import { isDev } from "@/utils/settings";
import dayjs from "dayjs";

const inter = Inter({ subsets: ["latin"] });

export async function generateViewport(props: { orgSlug: string }) {
  const organization = (
    await readOrganizations({
      where: { slug: props.orgSlug },
    })
  )[0];

  if (!organization) {
    return notFound();
  }

  return {
    themeColor: organization.options.colors.primaryColor.hex,
  };
}

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  const { request } = await UseMiddlewares().then(
    OptionalUserSessionMiddleware
  );
  const organization = (
    await readOrganizations({
      where: { slug: params.orgSlug },
    })
  )[0];

  if (!organization) {
    return notFound();
  }

  return (
    <>
      {organization.options && (
        <OrgStore
          value={{
            id: organization.id,
            colors: organization.options.colors,
            name: organization.name,
            slug: organization.slug,
            abbreviation: organization.abbreviation,
          }}
        />
      )}
      <CompanyNavbar organization={organization} user={request.userSession} />
      {children}
    </>
  );
}
