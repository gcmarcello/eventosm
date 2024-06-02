import { LoadingSpinner } from "odinkit";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-50px)] w-screen items-center justify-center lg:h-[calc(100vh-46px)] dark:bg-zinc-900 lg:dark:bg-zinc-950">
      <LoadingSpinner />
    </div>
  );
}
