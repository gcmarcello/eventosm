import { Divider, SubmitButton } from "odinkit";

export function SubmitContainer() {
  return (
    <div className="sticky bottom-0 z-50 mt-4 space-y-4 bg-white dark:bg-zinc-900">
      <Divider />
      <div className="flex justify-end">
        <SubmitButton>Criar</SubmitButton>
      </div>
    </div>
  );
}
