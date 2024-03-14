"use client";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function ReaderContainer({ id }: { id: string }) {
  const [data, setData] = useState("No result");
  console.log(id);
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result as any);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{ facingMode: "environment", aspectRatio: { ideal: 1 } }}
          containerStyle={{ height: "300px", width: "300px" }}
          videoContainerStyle={{ height: "300px", width: "300px" }}
        />
        <p>{data}</p>
      </div>
    </>
  );
}
