"use client";
import { notFound, useSelectedLayoutSegment } from "next/navigation";

export default function Layout({
  children,
  login,
  cadastro,
  recuperar,
  params,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  cadastro: React.ReactNode;
  recuperar: React.ReactNode;
  params: { route: string };
}) {
  const possibleRoutes = ["login", "cadastro", "recuperar"];
  if (!possibleRoutes.find((route) => route === params.route))
    return notFound();
  return (
    <>
      <div className="grid grid-cols-8 bg-white lg:h-[calc(100dvh-80px)]">
        <div className="col-span-8 lg:col-span-3">
          {params.route === "cadastro" && cadastro}
          {params.route === "recuperar" && recuperar}
          {params.route === "login" && login}
        </div>
        <div className="col-span-0 hidden lg:col-span-5 lg:block">
          <img
            className="inset-0 h-full w-full object-cover"
            src="https://i.imgur.com/MNOnNVF.jpeg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
