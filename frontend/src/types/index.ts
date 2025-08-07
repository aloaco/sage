export interface ProjectInputs {
  hourlyRate: number | null;
  transcript: string;
  pdfFiles: File[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  complexity?: 'low' | 'medium' | 'high';
  source?: FeatureSource;
}

export interface FeatureSource {
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface Priority {
  id: string;
  feature: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: 'technical' | 'timeline' | 'resource';
  impact: string;
  mitigation: string;
}

export interface POCVersion {
  id: string;
  title: string;
  focus: 'revenue' | 'fundraising' | 'risk-mitigation';
  features: string[];
  timeEstimate: string;
  cost: number;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  cost: number;
}

export interface ProjectResults {
  features: Feature[];
  priorities: Priority[];
  risks: Risk[];
  pocVersions: POCVersion[];
  mvpDeliverables: Deliverable[];
  finalDeliverables: Deliverable[];
}

export type StepType = 
  | 'welcome'
  | 'input'
  | 'feature-extraction'
  | 'priority-analysis'
  | 'risk-analysis'
  | 'poc'
  | 'mvp';

export interface ProjectState {
  currentStep: StepType;
  inputs: ProjectInputs;
  results: ProjectResults;
  isLoading: boolean;
  error: string | null;
}