import React from "react";
import { StepLayout } from "../layout/StepLayout";
import { NavigationButtons } from "../shared/NavigationButtons";

export const WelcomeStep: React.FC = () => {
  return (
    <StepLayout imageUrl="https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <div className="text-left">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Ready to build your software?
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Get an accurate project scope and cost estimate in just a few minutes.
        </p>

        <div className="mb-8">
          <div className="flex items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Feature Analysis
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Risk Assessment
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Cost Estimation
            </div>
          </div>
        </div>

        <NavigationButtons nextLabel="Get Started" showPrevious={false} />
      </div>
    </StepLayout>
  );
};
