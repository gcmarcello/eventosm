import { getEnv } from "@/utils/settings";

export async function CustomDomainMiddleware({ host }: { host: string }) {
  try {
    const url = getEnv("NEXT_PUBLIC_SITE_URL");

    if (!url) return false;

    const org = await fetch(`${url}/api/domains?host=${host}`)
      .then((res) => res.json())
      .catch((error) => error);

    if (!org) return false;

    return org.Organization.slug;
  } catch (error) {
    return false;
  }
}
