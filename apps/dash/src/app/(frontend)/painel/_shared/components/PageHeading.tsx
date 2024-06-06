import { Divider, Heading } from "odinkit";
import { Button } from "odinkit/client";
import React from "react";

export function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-end justify-between">{children}</div>
      <Divider className="my-6" />
    </>
  );
}
