import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { DashboardLayout } from "../../painel/_shared/components/DashboardLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventoSM",
  description: "Login",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen">{children}</div>;
}
