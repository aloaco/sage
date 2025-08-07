import React from 'react';
import { StepLayout } from '../layout/StepLayout';
import { ProgressIndicator } from '../shared/ProgressIndicator';
import { NavigationButtons } from '../shared/NavigationButtons';
import { useProjectStore } from '../../store/useProjectStore';

export const MVPStep: React.FC = () => {
  const { currentStep, results, inputs, isLoading, error } = useProjectStore();

  const deliverables = results.mvpDeliverables;
  const totalCost = deliverables.reduce((sum, d) => sum + d.cost, 0);
  const totalHours = inputs.hourlyRate ? Math.round(totalCost / inputs.hourlyRate) : 0;
  const totalWeeks = Math.ceil(totalHours / 40); // Assuming 40 hours per week

  return (
    <StepLayout imageUrl="https://images.unsplash.com/photo-1752805936214-bbdd8c94a576?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <div>
        <ProgressIndicator currentStep={currentStep} />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          MVP Development Plan
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Here's your complete MVP specification with deliverables and cost breakdown.
        </p>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">MVP generation failed</p>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-sm text-gray-500 mt-2">Showing fallback MVP plan instead</p>
            </div>
          </div>
        ) : deliverables.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600">No MVP plan generated yet</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ${totalCost.toLocaleString()}
                </div>
                <div className="text-sm text-blue-800">Total Cost</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {totalHours}h
                </div>
                <div className="text-sm text-green-800">Total Hours</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {totalWeeks}w
                </div>
                <div className="text-sm text-purple-800">Timeline</div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Deliverables</h2>
              {deliverables.map((deliverable, index) => (
                <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {deliverable.title}
                        </h3>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-gray-900">
                            ${deliverable.cost.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {deliverable.timeEstimate}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        {deliverable.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ready to get started?
              </h3>
              <p className="text-gray-600 mb-4">
                This MVP plan provides a solid foundation for your project. You can use this as a basis for 
                detailed project planning, team resource allocation, and client proposals.
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Download PDF Report
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Start New Analysis
                </button>
              </div>
            </div>
          </>
        )}

        <NavigationButtons 
          canGoNext={false}
          nextLabel="Complete"
          showPrevious={true}
        />
      </div>
    </StepLayout>
  );
};