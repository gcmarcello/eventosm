import { Fragment } from "react";

interface ForProps<T> {
  each: T[];
  children: (item: T, index?: number) => JSX.Element;
  key?: string;
  fallback?: JSX.Element;
}

export function For<T>({ each, children, key, fallback }: ForProps<T>) {
  if (!each || each?.length < 1) return fallback;

  if (!key) return <>{each.map((element, index) => children(element, index))}</>;

  return (
    <>
      {each.map((element, index) => (
        <Fragment key={key + index}>{children(element, index)}</Fragment>
      ))}
    </>
  );
}
