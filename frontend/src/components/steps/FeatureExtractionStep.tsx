import React from 'react';
import { StepLayout } from '../layout/StepLayout';
import { ProgressIndicator } from '../shared/ProgressIndicator';
import { NavigationButtons } from '../shared/NavigationButtons';
import { useProjectStore } from '../../store/useProjectStore';

export const FeatureExtractionStep: React.FC = () => {
  const { currentStep, results, isLoading, error, processPriorityAnalysis } = useProjectStore();

  const features = results.features;

  return (
    <StepLayout imageUrl="https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <div>
        <ProgressIndicator currentStep={currentStep} />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Extracted Features
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Based on your project description, we've identified these key features to be built.
        </p>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">AI analysis failed</p>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-sm text-gray-500 mt-2">Showing fallback features instead</p>
            </div>
          </div>
        ) : features.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600">No features extracted yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {features.map((feature) => (
              <div key={feature.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {feature.description}
                    </p>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${feature.complexity === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : feature.complexity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {feature.complexity} complexity
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <NavigationButtons 
          canGoNext={features.length > 0 && !isLoading}
          nextLabel={isLoading ? "Analyzing..." : "Analyze Priorities"}
          onNext={processPriorityAnalysis}
        />
      </div>
    </StepLayout>
  );
};