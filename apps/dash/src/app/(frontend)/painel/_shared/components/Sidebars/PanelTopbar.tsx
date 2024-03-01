"use client";

import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "./lib/useSidebar";
import { usePathname } from "next/navigation";
import ProfileDropdown from "@/app/(frontend)/_shared/components/ProfileDropdown";
import { getPageName } from "../../utils/pageName";
import { Link } from "odinkit";

export function SupporterTopBar() {
  const { user, organization, setVisibility } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:ml-64 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() =>
          setVisibility((prev) => ({
            ...prev,
            panelSidebar: true,
          }))
        }
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex min-w-0 flex-1 items-center">
          <h2 className="flex text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            <span className="hidden lg:block">
              {getPageName(pathname, false)}
            </span>
            <span className="block lg:hidden">
              {getPageName(pathname, true)}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Link
            target="_blank"
            type="button"
            href={
              organization.domain
                ? `https://${organization.domain}`
                : `/org/${organization.slug}`
            }
            className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500"
            /* onClick={async () =>
              setVisibility((prev) => ({
                ...prev,
                supporterSidebar: true,
              }))
            } */
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowTopRightOnSquareIcon
                className="h-6 w-6"
                aria-hidden="true"
              />{" "}
              <span className="hidden lg:block">Ver Site</span>
            </div>
          </Link>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <ProfileDropdown user={user} />
        </div>
      </div>
    </div>
  );
}
