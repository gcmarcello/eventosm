import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import MainNavbar from "./(frontend)/_shared/components/MainNavbar";
import { Mocker } from "odinkit/client";
import { isDev } from "@/app/api/env";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventoSM",
  description: "Construído com tecnologia EventoSM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  return (
    <html data-theme={theme?.value} lang="pt-BR">
      <Analytics />
      <body className={clsx(inter.className)}>
        {isDev && <Mocker />}

        <main>{children}</main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
