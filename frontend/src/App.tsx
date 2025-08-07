import { useProjectStore } from "./store/useProjectStore";
import { WelcomeStep } from "./components/steps/WelcomeStep";
import { InputStep } from "./components/steps/InputStep";
import { FeatureExtractionStep } from "./components/steps/FeatureExtractionStep";
import { PriorityAnalysisStep } from "./components/steps/PriorityAnalysisStep";
import { RiskAnalysisStep } from "./components/steps/RiskAnalysisStep";
import { POCStep } from "./components/steps/POCStep";
import { MVPStep } from "./components/steps/MVPStep";
import CacheControls from "./components/shared/CacheControls";

function App() {
  const { currentStep } = useProjectStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep />;
      case "input":
        return <InputStep />;
      case "feature-extraction":
        return <FeatureExtractionStep />;
      case "priority-analysis":
        return <PriorityAnalysisStep />;
      case "risk-analysis":
        return <RiskAnalysisStep />;
      case "poc":
        return <POCStep />;
      case "mvp":
        return <MVPStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
      <CacheControls />
    </div>
  );
}

export default App;
