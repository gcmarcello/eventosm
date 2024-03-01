import { getClientEnv } from "@/app/(frontend)/env";

export async function CustomDomainMiddleware({ host }: { host: string }) {
  try {
    const url = process.env.NEXT_PUBLIC_SITE_URL;

    console.log(url);

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
