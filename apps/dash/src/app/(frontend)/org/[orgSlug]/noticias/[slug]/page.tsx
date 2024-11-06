import clsx from "clsx";
import { notFound } from "next/navigation";
import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";
import { Link, Text, date } from "odinkit";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "../../../_shared/ShareButtons";
import Image from "next/image";
import { Date } from "odinkit/client";
import prisma from "prisma/prisma";

export default async function NewsPage({
  params,
}: {
  params: { slug: string; orgSlug: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return notFound();

  const news = await prisma.news.findUnique({
    where: {
      slug_organizationId: {
        slug: params.slug,
        organizationId: organization.id,
      },
      status: "published",
    },
  });

  if (!news) return notFound();

  const newsShareLink = organization.OrgCustomDomain[0]?.domain
    ? `https://${organization.OrgCustomDomain[0].domain}/noticias/${news.slug}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/org/${organization.slug}/noticias/${news.slug}`;

  const newsShareTitle = news.title;

  return (
    <div className="bg-slate-200">
      <div
        className={clsx(
          "rounded-b-md bg-white px-4 pb-4 pt-4 xl:mx-16 2xl:mx-72"
        )}
      >
        <h1 className="text-3xl font-semibold text-gray-800">{news?.title}</h1>
        <p className="text-gray-500">{news?.subtitle}</p>
        <div className="mt-2 flex gap-2">
          <Text className="hidden lg:block">Compartilhe!</Text>
          <FacebookShareButton link={newsShareLink} />
          <TwitterShareButton link={newsShareLink} text={newsShareTitle} />
          <WhatsappShareButton link={newsShareLink} text={newsShareTitle} />
          <span className="flex items-center gap-1 text-base/6 text-zinc-500 sm:text-sm/6">
            Atualizado em{" "}
            <Date
              date={news?.updatedAt ?? news.createdAt}
              format="DD/MM/YYYY"
            />
          </span>
        </div>
        <div className="mt-3 grid grid-cols-5 pb-3">
          {news.imageUrl && (
            <div className="relative col-span-5 mb-4 h-72 w-full lg:col-span-3 lg:col-start-2">
              <Image alt="imagem da noticia" fill src={news.imageUrl} />
            </div>
          )}
          <div
            className="customHtml col-span-5 mt-5 lg:col-span-3 lg:col-start-2"
            dangerouslySetInnerHTML={{ __html: news.content }}
          ></div>
        </div>
      </div>
    </div>
  );
}
