import { Dispatch, SetStateAction, useState } from "react";
import { QrReader } from "react-qr-reader";
import QRScanner from "@alzera/react-qr-scanner";
import { Button } from "odinkit/client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function QRReader({
  trigger,
}: {
  trigger: (data: any) => void;
}) {
  const [facingMode, setFacingMode] = useState<"environment" | "face">(
    "environment"
  );
  return (
    <>
      <div
        style={{ maxWidth: "250px" }}
        className="flex flex-col items-center justify-center gap-2"
      >
        <QRScanner
          onScan={(d) => d && trigger(d)}
          facingMode={facingMode}
          switchLabel={() => null}
          delay={2000}
        />
        <div className="">
          <Button
            plain
            onClick={() =>
              setFacingMode((prev) =>
                prev === "environment" ? "face" : "environment"
              )
            }
          >
            <ArrowPathIcon className="size-8 text-white" /> Virar Câmera
          </Button>
        </div>
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
