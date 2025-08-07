import React from "react";
import { useProjectStore } from "../../store/useProjectStore";

interface NavigationButtonsProps {
  canGoNext?: boolean;
  nextLabel?: string;
  showPrevious?: boolean;
  onNext?: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  canGoNext = true,
  nextLabel = "Next",
  showPrevious = true,
  onNext,
}) => {
  const { nextStep, prevStep, currentStep } = useProjectStore();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      nextStep();
    }
  };

  const isFirstStep = currentStep === "welcome";

  return (
    <div className="flex justify-between mt-8">
      {showPrevious && (
        <button
          onClick={prevStep}
          className={`px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer
          ${isFirstStep || !showPrevious ? "invisible" : ""}
        `}
          disabled={isFirstStep || !showPrevious}
        >
          Previous
        </button>
      )}

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer
          ${
            canGoNext
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        {nextLabel}
      </button>
    </div>
  );
};
