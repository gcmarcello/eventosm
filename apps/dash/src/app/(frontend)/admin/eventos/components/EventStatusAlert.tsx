import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  Button,
} from "odinkit/client";
import { useState } from "react";
import { usePanel } from "../../_shared/components/PanelStore";

export function EventStatusAlert({ eventId }: { eventId: string }) {
  let [isOpen, setIsOpen] = useState(false);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  return (
    <>
      {/* <Button
        type="button"
        color={secondaryColor}
        onClick={() => setIsOpen(true)}
      >
        Status do Evento
      </Button> */}
      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>Are you sure you want to refund this payment?</AlertTitle>
        <AlertDescription>
          The refund will be reflected in the customer’s bank account 2 to 3
          business days after processing.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Refund</Button>
        </AlertActions>
      </Alert>
    </>
  );
}
