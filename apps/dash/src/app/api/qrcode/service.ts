import { getServerEnv } from "../env";

export async function generateQrCodes(arg: string[]) {
  return await fetch(getServerEnv("QUEUE_URL") + "/qrCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
}
