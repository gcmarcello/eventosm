import { LoadingSpinner } from "odinkit";

export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-[500] flex h-full w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
