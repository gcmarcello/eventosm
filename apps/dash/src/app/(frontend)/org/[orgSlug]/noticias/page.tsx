import { Title } from "odinkit";
import NewsCard from "../../_shared/NewsCard";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Date } from "odinkit/client";
import Image from "next/image";
import prisma from "prisma/prisma";

export default async function NewsPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const news = await prisma.news.findMany({
    where: { Organization: { slug: params.orgSlug }, status: "published" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-200">
      <div className="rounded-b-md bg-white px-4 pt-8 lg:mx-64 lg:px-16">
        <Title>Notícias</Title>
        <ul role="list" className="divide-y divide-gray-100 lg:py-4">
          {news.map((n) => (
            <li
              key={n.id}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  {n.imageUrl && (
                    <img
                      className="size-8 rounded-full"
                      src={n.imageUrl}
                      alt=""
                    />
                  )}
                  <a
                    href={`/noticias/${n.slug}`}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:underline"
                  >
                    {n.title}
                  </a>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p className="lg:whitespace-nowrap">{n.subtitle}</p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="">
                    {<Date date={n.createdAt} format="DD/MM/YYYY" />}
                  </div>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <a
                  href={`/noticias/${n.slug}`}
                  className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                >
                  Ver mais<span className="sr-only">, {n.title}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
