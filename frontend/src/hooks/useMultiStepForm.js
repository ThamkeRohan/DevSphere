import { useState } from "react";

export function useMultiStepForm(steps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    function next() {
        if(currentStepIndex === steps.length - 1) return 
        setCurrentStepIndex(prev => prev + 1)
    }
    function previous() {
        if(currentStepIndex === 0) return
        setCurrentStepIndex(prev => prev - 1)
    }
    function goTo(stepIndex) {
        if(stepIndex < 0 || stepIndex > steps.length - 1) return
        setCurrentStepIndex(stepIndex)
    }
    return {
        steps,
        currentStepIndex,
        currentStep: steps[currentStepIndex],
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        next,
        previous,
        goTo
    }

}