import { useState } from "react";
import { QrReader } from "react-qr-reader";
import ReaderContainer from "./components/ReaderContainer";
import clsx from "clsx";

export default function CheckinPage({ params }: { params: { id: string } }) {
  return (
    <div className={clsx("h-dvh bg-cover lg:h-[calc(100dvh-85px)]")}>
      <ReaderContainer id={params.id} />
    </div>
  );
}
