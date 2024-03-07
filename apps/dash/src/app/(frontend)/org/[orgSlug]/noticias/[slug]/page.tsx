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
    },
  });

  if (!news) return notFound();

  const newsShareLink = organization.OrgCustomDomain[0]?.domain
    ? `https://${organization.OrgCustomDomain[0].domain}/noticias/${news.slug}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/org/${organization.slug}/noticias/${news.slug}`;

  const newsShareTitle = news.title;

  return (
    <div
      className={clsx(
        organization.options?.images?.bg && "lg:bg-slate-200",
        "h-dvh bg-cover lg:h-[calc(100dvh-85px)]"
      )}
    >
      <div
        className={clsx(
          "min-h-[600px] rounded-b-md bg-white px-4 pb-4 pt-4 xl:mx-16 2xl:mx-72"
        )}
      >
        <h1 className="text-3xl font-semibold text-gray-800">{news?.title}</h1>
        <p className="text-gray-500">{news?.subtitle}</p>
        <div className="mt-2 flex gap-2">
          <Text className="hidden lg:block">Compartilhe!</Text>
          <FacebookShareButton link={newsShareLink} />
          <TwitterShareButton link={newsShareLink} text={newsShareTitle} />
          <WhatsappShareButton link={newsShareLink} text={newsShareTitle} />
          <Text>
            Atualizado em{" "}
            {date(news?.updatedAt ?? news.createdAt, "DD/MM/YYYY HH:mm")}
          </Text>
        </div>
        <div className="mt-3 grid grid-cols-4 pb-3">
          {news.imageUrl && (
            <div className="relative col-span-4 h-72 w-full lg:col-span-2 lg:col-start-2">
              <Image alt="imagem da noticia" fill src={news.imageUrl} />
            </div>
          )}
          <div
            className="customHtml col-span-4 mt-5 lg:col-span-2 lg:col-start-2"
            dangerouslySetInnerHTML={{ __html: news.content }}
          ></div>
        </div>
      </div>
    </div>
  );
}
