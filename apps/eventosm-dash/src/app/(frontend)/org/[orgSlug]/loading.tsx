import { LoadingSpinner } from "odinkit";

export default function GlobalLoading() {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
