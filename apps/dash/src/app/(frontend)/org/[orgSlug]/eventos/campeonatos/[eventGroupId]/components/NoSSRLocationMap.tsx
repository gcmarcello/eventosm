import dynamic from "next/dynamic";
import { LoadingSpinner } from "odinkit";

export const NoSsrMap = dynamic(() => import("./LocationMap"), {
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
  ssr: false,
});
