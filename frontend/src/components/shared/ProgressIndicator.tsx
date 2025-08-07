import React from "react";
import type { StepType } from "../../types";

interface ProgressIndicatorProps {
  currentStep: StepType;
}

const stepLabels = {
  welcome: "Welcome",
  input: "Project Info",
  "feature-extraction": "Features",
  "priority-analysis": "Priorities",
  "risk-analysis": "Risks",
  poc: "POC Options",
  mvp: "MVP Plan",
};

const stepOrder: StepType[] = [
  "welcome",
  "input",
  "feature-extraction",
  "priority-analysis",
  "risk-analysis",
  "poc",
  "mvp",
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
}) => {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between w-full">
        {stepOrder.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    index <= currentIndex
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap
                ${index <= currentIndex ? "text-blue-600" : "text-gray-400"}
              `}
              >
                {stepLabels[step]}
              </span>
            </div>
            {index < stepOrder.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4
                  ${index < currentIndex ? "bg-blue-600" : "bg-gray-200"}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
