import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import MainNavbar from "./_shared/components/MainNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  return (
    <html data-theme={theme?.value} lang="en">
      <body className={clsx(inter.className, "bg-white dark:bg-zinc-800")}>
        <MainNavbar />
        <main>{children}</main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
