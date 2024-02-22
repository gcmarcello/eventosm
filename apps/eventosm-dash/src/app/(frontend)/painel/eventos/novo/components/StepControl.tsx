import { Button, useSteps } from "odinkit/client";
import { usePanel } from "../../../_shared/components/PanelStore";
import { scrollToElement, scrollToElementX } from "odinkit";

export default function StepControl({
  topRef,
  stepRefs,
  blockNextStep,
  steps,
}: {
  topRef: any;
  stepRefs: any;
  blockNextStep: boolean;
  steps: any;
}) {
  const {
    colors: { primaryColor },
  } = usePanel();
  const step = useSteps({});
  return (
    <>
      <Button
        color="white"
        disabled={step.currentStep === 0}
        onClick={() => {
          scrollToElementX(stepRefs.current[step.currentStep - 1]!, 0);
          topRef.current && scrollToElement(topRef.current, 0);
          step.walk(-1);
        }}
      >
        Anterior
      </Button>
      <Button
        color={primaryColor?.tw.color}
        type={step.currentStep === steps.length - 1 ? "submit" : "button"}
        disabled={blockNextStep}
        onClick={(e: any) => {
          if (step.currentStep !== steps.length - 1) {
            e.preventDefault();
            scrollToElementX(stepRefs.current[step.currentStep + 1]!, 0);
            topRef.current && scrollToElement(topRef.current, 0);
            step.walk(1);
          }
        }}
      >
        {step.currentStep === steps.length - 1 ? "Criar" : "Próximo"}
      </Button>
    </>
  );
}
