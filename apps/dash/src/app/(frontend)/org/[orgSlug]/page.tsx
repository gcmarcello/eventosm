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
      status: undefined,
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

  /* const news = [
    {
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
      date: "2021-07-22T03:00:00.000",
      image:
        "https://cbmtb.s3.sa-east-1.amazonaws.com/dev-folder/news-main/65ce41c69c9dd7a41ab385bc9dec71f7.jpeg",
      id: 1,
    },
    {
      title: "Pedal Para Todos de Verão 2023",
      description:
        "Passeio ciclístico apoiado pela Santos Brasil reúne centenas de pessoas na orla de Santos (SP)",
      date: "2021-07-22T03:00:00.000",
      image:
        "https://cbmtb.s3.sa-east-1.amazonaws.com/dev-folder/news-main/65ce41c69c9dd7a41ab385bc9dec71f7.jpeg",
      id: 2,
    },
  ]; */

  return (
    <>
      <div className="bg-slate-200 lg:h-[calc(100dvh-80px)]">
        <div className={clsx("rounded-b-md bg-white pb-4 xl:mx-16 2xl:mx-72")}>
          <div className="col-span-6 flex flex-col gap-4">
            {organization.options?.images?.hero && (
              <div className="relative w-auto ">
                <img src={organization.options?.images?.hero || ""} alt="" />
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-6 gap-4 px-4">
            <div className="col-span-6 md:col-span-2">
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

            <div className="col-span-6 flex-col md:col-span-4 md:flex">
              <NewsCard news={news} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
