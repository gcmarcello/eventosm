import { LoadingSpinner } from "odinkit";

export default function Loading() {
  return (
    <div className="mt-20 flex h-full w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
