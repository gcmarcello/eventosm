import { Alertbox } from "odinkit";

export default function ServerAlertBox({
  message,
  alert,
}: {
  message: string;
  alert: string;
}) {
  if (!["success", "error", "warning", "info"].includes(alert)) return;
  console.log(alert);
  return (
    <Alertbox type={alert as "success" | "error" | "warning" | "info"}>
      {message}
    </Alertbox>
  );
}
