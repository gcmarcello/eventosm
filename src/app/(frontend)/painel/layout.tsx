import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import PanelNavbar from "./shared/PanelNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventoSM",
  description: "Painel de Controle",
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={clsx(inter.className)}>
        <PanelNavbar />
        {children}
      </div>
    </>
  );
}
