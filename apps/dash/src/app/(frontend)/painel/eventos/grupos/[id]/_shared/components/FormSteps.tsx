"use client";
import { Step, Steps } from "odinkit";
import { useRef } from "react";

export function EditEventGroupFormSteps({
  color,
  steps,
}: {
  color: string;
  steps: Step[];
}) {
  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  return (
    <Steps color={color} topRef={topRef} stepRefs={stepRefs} steps={steps} />
  );
}
