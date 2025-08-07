import React, { useState } from 'react';
import { StepLayout } from '../layout/StepLayout';
import { ProgressIndicator } from '../shared/ProgressIndicator';
import { NavigationButtons } from '../shared/NavigationButtons';
import { useProjectStore } from '../../store/useProjectStore';

export const POCStep: React.FC = () => {
  const { currentStep, results, inputs, isLoading, error, processMVPGeneration } = useProjectStore();
  const [selectedPOC, setSelectedPOC] = useState<string | null>(null);

  const handleBuildMVP = () => {
    if (selectedPOC) {
      processMVPGeneration(selectedPOC);
    }
  };

  const pocVersions = results.pocVersions;

  const getFocusIcon = (focus: string) => {
    switch (focus) {
      case 'revenue':
        return '💰';
      case 'fundraising':
        return '🚀';
      case 'risk-mitigation':
        return '🛡️';
      default:
        return '📋';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus) {
      case 'revenue':
        return 'bg-green-100 text-green-800';
      case 'fundraising':
        return 'bg-blue-100 text-blue-800';
      case 'risk-mitigation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <StepLayout imageUrl="https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <div>
        <ProgressIndicator currentStep={currentStep} />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Proof of Concept Options
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Choose the POC approach that best aligns with your business goals.
        </p>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">POC generation failed</p>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-sm text-gray-500 mt-2">Showing fallback POC options instead</p>
            </div>
          </div>
        ) : pocVersions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600">No POC options generated yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {pocVersions.map((poc) => (
              <div 
                key={poc.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm
                  ${selectedPOC === poc.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => setSelectedPOC(poc.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-3xl">
                    {getFocusIcon(poc.focus)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {poc.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFocusColor(poc.focus)}`}>
                        {poc.focus.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Timeline</p>
                        <p className="font-medium text-gray-900">{poc.timeEstimate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                        <p className="font-medium text-gray-900">
                          ${poc.cost.toLocaleString()}
                          {inputs.hourlyRate && (
                            <span className="text-sm text-gray-500 ml-1">
                              (~{Math.round(poc.cost / inputs.hourlyRate)} hours)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Key Features:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {poc.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedPOC === poc.id && (
                      <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          ✓ Selected for MVP development
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <NavigationButtons 
          canGoNext={selectedPOC !== null && !isLoading}
          nextLabel={isLoading ? "Generating..." : "Build MVP Plan"}
          onNext={handleBuildMVP}
        />
      </div>
    </StepLayout>
  );
};