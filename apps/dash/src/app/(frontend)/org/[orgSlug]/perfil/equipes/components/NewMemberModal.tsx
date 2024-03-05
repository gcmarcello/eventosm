"use client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
} from "odinkit/client";
import { useState } from "react";

export default function NewMemberModal({ color }: { color: string }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button color={color} type="button" onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-2">
          <UserCircleIcon className="h-5 w-5" />
          Novo Membro
        </div>
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Refund payment</DialogTitle>
        <DialogDescription>
          The refund will be reflected in the customer’s bank account 2 to 3
          business days after processing.
        </DialogDescription>
        <DialogBody></DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Refund</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
