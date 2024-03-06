import { readEventGroups, readEvents } from "@/app/api/events/service";
import { Heading, date } from "odinkit";
import { MapPinIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { notFound } from "next/navigation";
import { For } from "odinkit";
import EventCard from "./components/EventCard";
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
    where: { organizationId: organization.id },
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
      <div
        className={clsx(
          organization.options?.images?.bg && "bg-slate-200",
          "h-dvh bg-cover"
        )}
      >
        <div
          className={clsx(
            "min-h-[600px] rounded-b-md bg-white px-4 pb-4 pt-4 xl:mx-72"
          )}
        >
          <div className="grid grid-cols-3 gap-6 ">
            <div
              className={clsx(
                "xxl:col-span-2 col-span-3 flex flex-col gap-4 lg:col-span-2"
              )}
            >
              {organization.options?.images?.hero && (
                <div className="relative h-[155px] w-auto lg:h-[375px]">
                  <Image
                    fill={true}
                    className="rounded-md"
                    src={organization.options?.images?.hero || ""}
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="col-span-3 flex flex-col px-5 lg:col-span-1">
              <div className="mb-2">
                <Heading>Próximos Eventos</Heading>
              </div>
              <div className="flex flex-col gap-4">
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
                    return <EventCard event={event} orgSlug={params.orgSlug} />;
                  }}
                </For>
              </div>
            </div>
            <div className="col-span-3">
              <NewsCard news={news} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
