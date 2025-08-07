interface BackendApiResponse<T = any> {
  data: T;
  error?: string;
}

class BackendApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  }

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Backend API error: ${response.status}`);
      }

      const result: BackendApiResponse<T> = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async extractFeatures(transcript: string, pdfFiles?: string[]): Promise<string> {
    return this.makeRequest('/extract-features', {
      transcript,
      pdfFiles
    });
  }

  async analyzePriorities(featuresJson: string, transcript: string): Promise<string> {
    return this.makeRequest('/analyze-priorities', {
      featuresJson,
      transcript
    });
  }

  async analyzeRisks(featuresJson: string, prioritiesJson: string, transcript: string): Promise<string> {
    return this.makeRequest('/analyze-risks', {
      featuresJson,
      prioritiesJson,
      transcript
    });
  }

  async generatePOCs(featuresJson: string, prioritiesJson: string, risksJson: string, hourlyRate: number): Promise<string> {
    return this.makeRequest('/generate-pocs', {
      featuresJson,
      prioritiesJson,
      risksJson,
      hourlyRate
    });
  }

  async generateMVP(selectedPOCJson: string, featuresJson: string, prioritiesJson: string, risksJson: string, hourlyRate: number): Promise<string> {
    return this.makeRequest('/generate-mvp', {
      selectedPOCJson,
      featuresJson,
      prioritiesJson,
      risksJson,
      hourlyRate
    });
  }

  async chat(messages: any[], model?: string): Promise<string> {
    return this.makeRequest('/chat', {
      messages,
      model
    });
  }
}

export const backendApi = new BackendApiService();