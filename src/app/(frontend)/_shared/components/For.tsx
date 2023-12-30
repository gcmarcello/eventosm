import { Fragment } from "react";

interface ForProps<T> {
  each: T[];
  children: (item: T, index?: number) => JSX.Element;
  identifier?: string;
  fallback?: JSX.Element;
}

export function For<T>({ each, children, identifier, fallback }: ForProps<T>) {
  if (!each || each?.length < 1) return fallback;

  if (!identifier) return <>{each.map((element, index) => children(element, index))}</>;

  return (
    <>
      {each.map((element, index) => (
        <Fragment key={identifier + index}>{children(element, index)}</Fragment>
      ))}
    </>
  );
}
