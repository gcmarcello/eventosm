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

  const news = [
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
  ];

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
            "xxl:mx-32 min-h-[600px] rounded-b-md bg-white px-4 pb-4 pt-4 xl:mx-8"
          )}
        >
          <div className="grid grid-cols-4 gap-4 ">
            <div
              className={clsx(
                "xxl:col-span-3 col-span-4 flex flex-col gap-4 lg:col-span-3"
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
              <NewsCard news={news} />
            </div>

            <div className="col-span-4 flex flex-col lg:col-span-1">
              <div className="mb-2">
                <Heading>Próximos Eventos</Heading>
              </div>
              <For each={[...eventGroups, ...events]}>
                {(event) => {
                  return <EventCard event={event} orgSlug={params.orgSlug} />;
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
