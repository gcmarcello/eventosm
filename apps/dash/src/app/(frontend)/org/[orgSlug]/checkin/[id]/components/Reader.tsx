import { Dispatch, SetStateAction, useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "odinkit/client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import QrScanner from "@/app/(frontend)/_shared/qrCodeReader";

export default function QRReader({
  trigger,
}: {
  trigger: (data: any) => void;
}) {
  return (
    <>
      <div
        style={{ maxWidth: "250px" }}
        className="flex flex-col items-center justify-center gap-2"
      >
        <QrScanner
          onScan={(d) => d && trigger(d)}
          facingMode={"environment"}
          switchLabel={() => null}
          delay={2000}
        />
      </div>
    </>
  );
}

{
  /* <QrReader
      onResult={async (result, error) => {
        if (!!result) {
          trigger({ registrationId: result.getText() });
        }
      }}
      constraints={{
        facingMode: "environment",
        aspectRatio: { ideal: 1 },
      }}
      containerStyle={{ display: "flex", justifyContent: "center" }}
      videoStyle={{
        height: "300px",
        width: "300px",
        paddingTop: "0px",
        paddingBottom: "20px",
        borderRadius: "5px",
      }}
      videoContainerStyle={{
        height: "300px",
        width: "300px",
        paddingTop: "0px",
        paddingBottom: "20px",
      }}
    /> */
}
