import clsx from "clsx";

interface BottomNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomNavigation(props: BottomNavigationProps) {
  const { children, className } = props;
  return (
    <nav
      className={clsx(
        "w-100 fixed bottom-0 left-0 right-0 items-center border-t border-gray-700 bg-zinc-800",
        className
      )}
    >
      {children}
    </nav>
  );
}
