import React from "react";
import { StepLayout } from "../layout/StepLayout";
import { ProgressIndicator } from "../shared/ProgressIndicator";
import { NavigationButtons } from "../shared/NavigationButtons";
import { FileUpload } from "../shared/FileUpload";
import { useProjectStore } from "../../store/useProjectStore";

export const InputStep: React.FC = () => {
  const {
    inputs,
    updateInputs,
    currentStep,
    processFeatureExtraction,
    isLoading,
    error,
  } = useProjectStore();

  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateInputs({ hourlyRate: value ? parseFloat(value) : null });
  };

  const handleTranscriptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateInputs({ transcript: e.target.value });
  };

  const handleFilesChange = (files: File[]) => {
    updateInputs({ pdfFiles: files });
  };

  const canProceed = !!inputs.hourlyRate && inputs.transcript.trim().length > 0;

  return (
    <StepLayout imageUrl="https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <div>
        <ProgressIndicator currentStep={currentStep} />

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Tell us about your project
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          We'll use this information to generate accurate estimates and
          recommendations.
        </p>

        <div className="space-y-6">
          {/* Hourly Rate */}
          <div>
            <label
              htmlFor="hourlyRate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Hourly Rate *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="hourlyRate"
                value={inputs.hourlyRate || ""}
                onChange={handleHourlyRateChange}
                className="block w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150"
                min="0"
                step="1"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              This will be used to calculate project costs
            </p>
          </div>

          {/* Transcript */}
          <div>
            <label
              htmlFor="transcript"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Description / Transcript *
            </label>
            <textarea
              id="transcript"
              value={inputs.transcript}
              onChange={handleTranscriptChange}
              rows={6}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your project in detail. Include features, functionality, target users, and any specific requirements..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {inputs.transcript.length} characters
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <FileUpload
              files={inputs.pdfFiles}
              onFilesChange={handleFilesChange}
              accept=".pdf"
              multiple={true}
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload any wireframes, specifications, or requirement documents
            </p>
          </div>
        </div>

        <NavigationButtons
          canGoNext={canProceed && !isLoading}
          nextLabel={isLoading ? "Analyzing..." : "Analyze Project"}
          onNext={processFeatureExtraction}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </StepLayout>
  );
};
