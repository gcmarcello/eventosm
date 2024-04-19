import clsx from "clsx";

export function OrgLayoutContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex grow flex-col", className)}>{children}</div>
  );
}
