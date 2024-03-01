import { For, Heading, date } from "odinkit";

export default function NewsCard({ news }: { news?: any[] }) {
  return (
    <div>
      <div className="rounded-t-md border border-b border-gray-200 bg-gray-100/25 px-4 py-3 sm:px-6">
        <Heading>Últimas Notícias</Heading>
      </div>
      <ul
        role="list"
        className="grow divide-y divide-gray-100 border border-gray-900/5"
      >
        {news?.length ? (
          <For each={news} identifier="news">
            {(item) => (
              <li className="px-4 py-2">
                <div className="flex items-center gap-x-3">
                  <img
                    src={item.image || ""}
                    alt=""
                    className="h-8 w-8 flex-none rounded-3xl bg-gray-800"
                  />
                  <h3 className="flex-auto text-sm font-semibold leading-6 text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <time className="flex-none text-xs text-gray-500">
                  {date(item.date, "DD/MM/YYYY")}
                </time>
                <div className="mt-1 flex gap-2 text-sm text-gray-500">
                  {item.description}
                </div>
              </li>
            )}
          </For>
        ) : (
          <li className="p-2">
            <div className="flex items-center gap-x-3">
              <h3 className="flex-auto text-sm font-semibold leading-6 text-gray-900">
                Nenhuma notícia encontrada.
              </h3>
            </div>

            <div className="mt-1 flex gap-2 text-sm text-gray-500">
              Mais em breve.
            </div>
          </li>
        )}
      </ul>
      <div className="flex justify-end rounded-b-md border border-b border-gray-200 bg-gray-100/25 px-4 py-3  sm:px-6">
        <h3 className="text-sm font-semibold leading-6 text-gray-900">
          Ver Mais -{">"}
        </h3>
      </div>
    </div>
  );
}
