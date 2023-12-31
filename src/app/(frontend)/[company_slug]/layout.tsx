import { Inter } from "next/font/google";
import { CompanyNavbar } from "./_shared/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <CompanyNavbar />;
}
