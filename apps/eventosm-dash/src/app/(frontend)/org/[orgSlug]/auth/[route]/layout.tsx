"use client";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Layout({
  children,
  login,
  cadastro,
  params,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  cadastro: React.ReactNode;
  params: { route: string };
}) {
  return (
    <>
      <div className="grid grid-cols-8 lg:h-[calc(100dvh-80px)]">
        <div className="col-span-8 lg:col-span-3">
          {params.route === "cadastro" ? cadastro : login}
        </div>
        <div className="col-span-0 hidden lg:col-span-5 lg:block">
          <img
            className="inset-0 h-full w-full object-cover"
            src="https://c02.purpledshub.com/uploads/sites/39/2022/10/Fox-DHX-Factory-rear-mountain-bike-shock-2-3e0ee7f.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
