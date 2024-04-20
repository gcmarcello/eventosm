import { News } from "@prisma/client";
import { For, Heading, Link, date } from "odinkit";

export default function NewsCard({ news }: { news?: News[] }) {
  return (
    <>
      <div className="rounded-t-md border border-b border-gray-200 bg-gray-100/25 px-4 py-3 sm:px-6">
        <Heading>Últimas Notícias</Heading>
      </div>
      <ul
        role="list"
        className="grow divide-y divide-gray-100 border border-gray-900/5"
      >
        <For
          each={news || []}
          identifier="news"
          fallback={
            <li className="px-4 py-2">
              <div className="flex items-center gap-x-3">
                <h3 className="flex-auto text-sm font-semibold leading-6 text-gray-900">
                  Nenhuma notícia até agora
                </h3>
              </div>
              <div className="mt-1 flex gap-2 text-sm text-gray-500">
                Mais em breve!{" "}
              </div>
            </li>
          }
        >
          {(item) => (
            <li className="px-4 py-2">
              <div className="flex items-center gap-x-3 lg:flex-row">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl || ""}
                    alt=""
                    className="h-20 max-w-32 flex-none rounded-lg "
                  />
                )}
                <div>
                  <Link href={`/noticias/${item.slug}`}>
                    <h3 className="flex-auto text-sm font-semibold leading-6 text-gray-900">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="mt-1 flex gap-2 text-sm text-gray-500">
                    {item.subtitle}
                  </div>
                </div>
              </div>
              <time className="flex-none text-xs text-gray-500">
                {date(item.updatedAt ?? item.createdAt, "DD/MM/YYYY")}
              </time>
            </li>
          )}
        </For>
      </ul>
      <div className="flex justify-end rounded-b-md border border-b border-gray-200 bg-gray-100/25 px-4 py-3  sm:px-6">
        <h3 className="text-sm font-semibold leading-6 text-gray-400">
          Ver Mais -{">"}
        </h3>
      </div>
    </>
  );
}
