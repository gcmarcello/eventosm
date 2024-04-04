export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[100dvh]  bg-slate-200">{children}</div>;
}
