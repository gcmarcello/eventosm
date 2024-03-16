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
