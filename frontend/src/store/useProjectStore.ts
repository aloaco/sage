import { create } from 'zustand';
import type { ProjectState, StepType, ProjectInputs, Feature, Priority, Risk, POCVersion, Deliverable } from '../types';

interface ProjectStore extends ProjectState {
  // Navigation actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StepType) => void;
  
  // Input actions
  updateInputs: (inputs: Partial<ProjectInputs>) => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // AI Processing actions
  processFeatureExtraction: () => Promise<void>;
  setFeatures: (features: Feature[]) => void;
  processPriorityAnalysis: () => Promise<void>;
  setPriorities: (priorities: Priority[]) => void;
  processRiskAnalysis: () => Promise<void>;
  setRisks: (risks: Risk[]) => void;
  processPOCGeneration: () => Promise<void>;
  setPOCs: (pocVersions: POCVersion[]) => void;
  processMVPGeneration: (selectedPOCId: string) => Promise<void>;
  setMVPDeliverables: (deliverables: Deliverable[]) => void;
}

const stepOrder: StepType[] = [
  'welcome',
  'input',
  'feature-extraction',
  'priority-analysis',
  'risk-analysis',
  'poc',
  'mvp'
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  currentStep: 'welcome',
  inputs: {
    hourlyRate: null,
    transcript: '',
    pdfFiles: []
  },
  results: {
    features: [],
    priorities: [],
    risks: [],
    pocVersions: [],
    mvpDeliverables: [],
    finalDeliverables: []
  },
  isLoading: false,
  error: null,

  // Navigation actions
  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] });
    }
  },

  goToStep: (step: StepType) => {
    set({ currentStep: step });
  },

  // Input actions
  updateInputs: (newInputs: Partial<ProjectInputs>) => {
    set((state) => ({
      inputs: { ...state.inputs, ...newInputs }
    }));
  },

  // Loading actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // AI Processing actions
  processFeatureExtraction: async () => {
    const { inputs, setLoading, setError, nextStep } = get();
    
    try {
      setLoading(true);
      setError(null);

      const { backendApi } = await import('../services/backendApi');
      const { filesToBase64 } = await import('../utils/fileUtils');

      let pdfBase64Array: string[] = [];
      if (inputs.pdfFiles && inputs.pdfFiles.length > 0) {
        pdfBase64Array = await filesToBase64(inputs.pdfFiles);
      }
      
      const aiResponse = await backendApi.extractFeatures(inputs.transcript, pdfBase64Array);
      
      let features: Feature[] = [];
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.features && Array.isArray(parsed.features)) {
          features = parsed.features;
        } else if (Array.isArray(parsed)) {
          features = parsed;
        } else {
          features = [parsed];
        }
      } catch (parseError) {
        const { mockFeatures } = await import('../mockData');
        features = mockFeatures;
      }

      set((state) => ({
        results: { ...state.results, features },
        isLoading: false
      }));
      
      nextStep();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Feature extraction failed');
      setLoading(false);
      
      try {
        const { mockFeatures } = await import('../mockData');
        set((state) => ({
          results: { ...state.results, features: mockFeatures }
        }));
        nextStep();
      } catch (fallbackError) {
        // Silent fallback failure
      }
    }
  },

  setFeatures: (features: Feature[]) => {
    set((state) => ({
      results: { ...state.results, features }
    }));
  },

  processPriorityAnalysis: async () => {
    const { inputs, results, setLoading, setError, nextStep } = get();
    
    try {
      setLoading(true);
      setError(null);

      const { backendApi } = await import('../services/backendApi');
      const featuresJson = JSON.stringify(results.features, null, 2);
      
      const aiResponse = await backendApi.analyzePriorities(featuresJson, inputs.transcript);
      
      let priorities: Priority[] = [];
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.priorities && Array.isArray(parsed.priorities)) {
          priorities = parsed.priorities;
        } else if (Array.isArray(parsed)) {
          priorities = parsed;
        } else {
          priorities = [parsed];
        }
      } catch (parseError) {
        const { mockPriorities } = await import('../mockData');
        priorities = mockPriorities;
      }

      set((state) => ({
        results: { ...state.results, priorities },
        isLoading: false
      }));
      
      nextStep();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Priority analysis failed');
      setLoading(false);
      
      try {
        const { mockPriorities } = await import('../mockData');
        set((state) => ({
          results: { ...state.results, priorities: mockPriorities }
        }));
        nextStep();
      } catch (fallbackError) {
        // Silent fallback failure
      }
    }
  },

  setPriorities: (priorities: Priority[]) => {
    set((state) => ({
      results: { ...state.results, priorities }
    }));
  },

  processRiskAnalysis: async () => {
    const { inputs, results, setLoading, setError, nextStep } = get();
    
    try {
      setLoading(true);
      setError(null);

      const { backendApi } = await import('../services/backendApi');
      const featuresJson = JSON.stringify(results.features, null, 2);
      const prioritiesJson = JSON.stringify(results.priorities, null, 2);
      
      const aiResponse = await backendApi.analyzeRisks(featuresJson, prioritiesJson, inputs.transcript);
      
      let risks: Risk[] = [];
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.risks && Array.isArray(parsed.risks)) {
          risks = parsed.risks;
        } else if (Array.isArray(parsed)) {
          risks = parsed;
        } else {
          risks = [parsed];
        }
      } catch (parseError) {
        const { mockRisks } = await import('../mockData');
        risks = mockRisks;
      }

      set((state) => ({
        results: { ...state.results, risks },
        isLoading: false
      }));
      
      nextStep();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Risk analysis failed');
      setLoading(false);
      
      try {
        const { mockRisks } = await import('../mockData');
        set((state) => ({
          results: { ...state.results, risks: mockRisks }
        }));
        nextStep();
      } catch (fallbackError) {
        // Silent fallback failure
      }
    }
  },

  setRisks: (risks: Risk[]) => {
    set((state) => ({
      results: { ...state.results, risks }
    }));
  },

  processPOCGeneration: async () => {
    const { inputs, results, setLoading, setError, nextStep } = get();
    
    try {
      setLoading(true);
      setError(null);

      const { backendApi } = await import('../services/backendApi');
      const featuresJson = JSON.stringify(results.features, null, 2);
      const prioritiesJson = JSON.stringify(results.priorities, null, 2);
      const risksJson = JSON.stringify(results.risks, null, 2);

      if (!inputs.hourlyRate) {
        throw new Error('Hourly rate is required for POC cost calculation');
      }
      
      const aiResponse = await backendApi.generatePOCs(featuresJson, prioritiesJson, risksJson, inputs.hourlyRate);
      
      let pocVersions: POCVersion[] = [];
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.pocVersions && Array.isArray(parsed.pocVersions)) {
          pocVersions = parsed.pocVersions;
        } else if (Array.isArray(parsed)) {
          pocVersions = parsed;
        } else {
          pocVersions = [parsed];
        }
      } catch (parseError) {
        const { mockPOCVersions } = await import('../mockData');
        pocVersions = mockPOCVersions;
      }

      set((state) => ({
        results: { ...state.results, pocVersions },
        isLoading: false
      }));
      
      nextStep();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'POC generation failed');
      setLoading(false);
      
      try {
        const { mockPOCVersions } = await import('../mockData');
        set((state) => ({
          results: { ...state.results, pocVersions: mockPOCVersions }
        }));
        nextStep();
      } catch (fallbackError) {
        // Silent fallback failure
      }
    }
  },

  setPOCs: (pocVersions: POCVersion[]) => {
    set((state) => ({
      results: { ...state.results, pocVersions }
    }));
  },

  processMVPGeneration: async (selectedPOCId: string) => {
    const { inputs, results, setLoading, setError, nextStep } = get();
    
    try {
      setLoading(true);
      setError(null);

      const selectedPOC = results.pocVersions.find(poc => poc.id === selectedPOCId);
      if (!selectedPOC) {
        throw new Error('Selected POC not found');
      }

      const { backendApi } = await import('../services/backendApi');
      const selectedPOCJson = JSON.stringify(selectedPOC, null, 2);
      const featuresJson = JSON.stringify(results.features, null, 2);
      const prioritiesJson = JSON.stringify(results.priorities, null, 2);
      const risksJson = JSON.stringify(results.risks, null, 2);

      if (!inputs.hourlyRate) {
        throw new Error('Hourly rate is required for MVP cost calculation');
      }
      
      const aiResponse = await backendApi.generateMVP(selectedPOCJson, featuresJson, prioritiesJson, risksJson, inputs.hourlyRate);
      
      let mvpDeliverables: Deliverable[] = [];
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.mvpDeliverables && Array.isArray(parsed.mvpDeliverables)) {
          mvpDeliverables = parsed.mvpDeliverables;
        } else if (Array.isArray(parsed)) {
          mvpDeliverables = parsed;
        } else {
          mvpDeliverables = [parsed];
        }
      } catch (parseError) {
        const { mockMVPDeliverables } = await import('../mockData');
        mvpDeliverables = mockMVPDeliverables;
      }

      set((state) => ({
        results: { ...state.results, mvpDeliverables },
        isLoading: false
      }));
      
      nextStep();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'MVP generation failed');
      setLoading(false);
      
      try {
        const { mockMVPDeliverables } = await import('../mockData');
        set((state) => ({
          results: { ...state.results, mvpDeliverables: mockMVPDeliverables }
        }));
        nextStep();
      } catch (fallbackError) {
        // Silent fallback failure
      }
    }
  },

  setMVPDeliverables: (mvpDeliverables: Deliverable[]) => {
    set((state) => ({
      results: { ...state.results, mvpDeliverables }
    }));
  }
}));