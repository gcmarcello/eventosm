export default function InstitutionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-200 lg:h-[calc(100dvh-88px)]">{children}</div>
  );
}
