import { readEventGroups, readEvents } from "@/app/api/events/service";
import { Heading, date } from "odinkit";
import { MapPinIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { notFound } from "next/navigation";
import { For } from "odinkit";
import EventCard from "./_shared/components/EventCard";
import Link from "next/link";
import NewsCard from "../_shared/NewsCard";
import { readOrganizations } from "@/app/api/orgs/service";
import OrgFooter from "../_shared/OrgFooter";
import { OrgPageContainer } from "./_shared/components/OrgPageContainer";

export default async function CompanyHome({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = (
    await readOrganizations({
      where: { slug: params.orgSlug },
    })
  )[0];

  if (!organization) return notFound();
  const events = await readEvents({
    where: {
      Organization: { slug: params.orgSlug },
      status: "published",
      eventGroupId: null,
    },
  });
  const eventGroups = await readEventGroups({
    where: { Organization: { slug: params.orgSlug }, status: "published" },
  });

  const news = await prisma.news.findMany({
    where: { organizationId: organization.id, status: "published" },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <OrgPageContainer
        className="grow bg-slate-200 lg:px-16 lg:pb-8 "
        organization={organization}
      >
        <div className={clsx("rounded-b-md bg-white pb-4 xl:mx-16 2xl:mx-72")}>
          <div className="col-span-6 flex  flex-col gap-4">
            {organization.options?.images?.hero && (
              <div className="relative w-auto ">
                <img
                  className="max-h-96 w-full"
                  src={organization.options?.images?.hero || ""}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-12 gap-4 px-4">
            <div className="xxl:col-span-3 col-span-12 md:col-span-3">
              <div className="col-span-6 mb-2 ">
                <Heading>Próximos Eventos</Heading>
              </div>

              <div className="space-y-3">
                <For
                  each={[...eventGroups, ...events]}
                  fallback={
                    <>
                      <div className="mt-1 flex gap-2 text-sm text-gray-500">
                        Mais em breve!{" "}
                      </div>
                    </>
                  }
                >
                  {(event) => {
                    return (
                      <div className="col-span-6 flex flex-col md:col-span-2">
                        <div className="flex flex-col gap-4 lg:grid">
                          <EventCard event={event} orgSlug={params.orgSlug} />
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>

            <div className="xxl:col-span-9 col-span-12 flex-col md:col-span-9 md:flex">
              <NewsCard news={news} />
            </div>
          </div>
        </div>
      </OrgPageContainer>
    </>
  );
}
