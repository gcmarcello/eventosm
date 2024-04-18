"use server";
import { CompanyNavbar } from "../_shared/Navbar";
import { readOrganizations } from "@/app/api/orgs/service";
import { notFound } from "next/navigation";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { OrgStore } from "./_shared/components/OrgStore";
import OrgFooter from "../_shared/OrgFooter";

export async function generateViewport({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = (
    await readOrganizations({
      where: { slug: params.orgSlug },
    })
  )[0];

  if (!organization) {
    return notFound();
  }

  return {
    themeColor: organization.options.colors.primaryColor.hex,
  };
}

export async function generateMetadata(props: { params: { orgSlug: string } }) {
  const organization = await prisma.organization.findUnique({
    where: { slug: props.params.orgSlug },
  });

  if (!organization) {
    return notFound();
  }

  return {
    title: organization.name,
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
      {/* <style>{`
          ::-webkit-scrollbar {
            display: none;
        }
        `}</style> */}
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
