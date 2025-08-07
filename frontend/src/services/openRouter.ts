interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'file';
    text?: string;
    file?: {
      data: string; // base64 encoded content
      type: string; // MIME type
    };
  }>;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  plugins?: Array<{
    id: string;
    pdf?: {
      engine: 'pdf-text' | 'mistral-ocr' | 'native';
    };
  }>;
  response_format?: {
    type: 'json_schema';
    json_schema: {
      name: string;
      strict: boolean;
      schema: {
        type: string;
        properties: Record<string, unknown>;
        required?: string[];
        additionalProperties?: boolean;
      };
    };
  };
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Set VITE_OPENROUTER_API_KEY environment variable.');
    }
  }

  async chat(messages: OpenRouterMessage[], model = 'google/gemini-2.5-flash'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const request: OpenRouterRequest = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Software Project Scope Tool'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter API call failed:', error);
      throw error;
    }
  }

  async extractFeatures(transcript: string, pdfFiles?: string[]): Promise<string> {
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: 'You are a software project analyst. Extract all features to be built from the provided materials (transcript and PDF documents). Only extract features explicitly mentioned - do not hallucinate or infer features. Analyze the complexity based on typical development effort: low (simple CRUD, basic UI), medium (integrations, complex logic), high (AI/ML, real-time systems, complex architecture).'
    };

    // Create user message content array
    const userContent: Array<{type: 'text' | 'file'; text?: string; file?: {data: string; type: string}}> = [
      {
        type: 'text',
        text: `Project Transcript: ${transcript}`
      }
    ];

    // Add PDF files if provided
    if (pdfFiles && pdfFiles.length > 0) {
      pdfFiles.forEach((base64Data) => {
        userContent.push({
          type: 'file',
          file: {
            data: base64Data,
            type: 'application/pdf'
          }
        });
      });
    }

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: userContent
    };

    const messages = [systemMessage, userMessage];

    return this.chatWithPDFs(messages);
  }

  async chatWithPDFs(messages: OpenRouterMessage[], model = 'google/gemini-2.5-flash'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const request: OpenRouterRequest = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      plugins: [
        {
          id: 'file-parser',
          pdf: {
            engine: 'pdf-text' // Use free text extraction for clear PDFs
          }
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'feature_extraction',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              features: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique identifier for the feature' },
                    title: { type: 'string', description: 'Name of the feature' },
                    description: { type: 'string', description: 'Detailed description of the feature' },
                    complexity: { 
                      type: 'string', 
                      enum: ['low', 'medium', 'high'],
                      description: 'Complexity level of implementing this feature'
                    }
                  },
                  required: ['id', 'title', 'description', 'complexity'],
                  additionalProperties: false
                }
              }
            },
            required: ['features'],
            additionalProperties: false
          }
        }
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Software Project Scope Tool'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter PDF API call failed:', error);
      throw error;
    }
  }

  async analyzePriorities(featuresJson: string, transcript: string): Promise<string> {
    console.log('🤖 Starting priority analysis...');
    console.log('📝 Features for analysis:', featuresJson.substring(0, 200) + '...');
    console.log('📄 Transcript for context:', transcript.substring(0, 100) + '...');
    
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: 'You are a software project analyst specializing in feature prioritization. Analyze the extracted features and project context to determine business priorities. Consider factors like: revenue impact, user value, technical dependencies, development complexity, and risk mitigation. Provide clear reasoning for each priority level.'
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Please analyze these extracted features and provide priority recommendations based on the project context:

EXTRACTED FEATURES:
${featuresJson}

PROJECT CONTEXT:
${transcript}

Consider business impact, technical dependencies, and development sequence when assigning priorities.`
    };

    const messages = [systemMessage, userMessage];

    const request: OpenRouterRequest = {
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'priority_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              priorities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique identifier matching feature ID' },
                    feature: { type: 'string', description: 'Name of the feature being prioritized' },
                    priority: { 
                      type: 'string', 
                      enum: ['high', 'medium', 'low'],
                      description: 'Priority level based on business impact and dependencies'
                    },
                    reasoning: { type: 'string', description: 'Clear explanation for the assigned priority' }
                  },
                  required: ['id', 'feature', 'priority', 'reasoning'],
                  additionalProperties: false
                }
              }
            },
            required: ['priorities'],
            additionalProperties: false
          }
        }
      }
    };

    try {
      console.log('📤 Sending priority analysis request to OpenRouter...');
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Software Project Scope Tool'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const result = data.choices[0]?.message?.content || '';
      console.log('✅ Priority analysis response received');
      return result;
    } catch (error) {
      console.error('❌ Priority analysis API call failed:', error);
      throw error;
    }
  }

  async analyzeRisks(featuresJson: string, prioritiesJson: string, transcript: string): Promise<string> {
    console.log('🛡️ Starting risk analysis...');
    console.log('📝 Features for risk analysis:', featuresJson.substring(0, 200) + '...');
    console.log('🎯 Priorities for context:', prioritiesJson.substring(0, 200) + '...');
    console.log('📄 Transcript for context:', transcript.substring(0, 100) + '...');
    
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: 'You are a software project risk analyst with expertise in identifying technical, timeline, and resource risks. Analyze the features, priorities, and project context to identify potential risks that could impact project success. Focus on dependencies, complexity, uncertainties, and external factors. Provide specific mitigation strategies for each identified risk.'
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Please analyze the following project information and identify potential risks:

EXTRACTED FEATURES:
${featuresJson}

FEATURE PRIORITIES:
${prioritiesJson}

PROJECT CONTEXT:
${transcript}

Analyze risks across these categories:
- Technical: API dependencies, complex integrations, new technologies, scalability concerns
- Timeline: Uncertain estimates, external dependencies, resource availability  
- Resource: Skill gaps, third-party services, infrastructure requirements

For each risk, provide specific impact assessment and actionable mitigation strategies.`
    };

    const messages = [systemMessage, userMessage];

    const request: OpenRouterRequest = {
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'risk_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              risks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique identifier for the risk' },
                    title: { type: 'string', description: 'Concise name of the risk' },
                    description: { type: 'string', description: 'Detailed description of the risk and its potential impact' },
                    severity: { 
                      type: 'string', 
                      enum: ['high', 'medium', 'low'],
                      description: 'Risk severity based on impact and likelihood'
                    },
                    category: {
                      type: 'string',
                      enum: ['technical', 'timeline', 'resource'],
                      description: 'Category of risk for better organization'
                    },
                    impact: { type: 'string', description: 'Specific impact this risk could have on the project' },
                    mitigation: { type: 'string', description: 'Actionable strategies to mitigate or manage this risk' }
                  },
                  required: ['id', 'title', 'description', 'severity', 'category', 'impact', 'mitigation'],
                  additionalProperties: false
                }
              }
            },
            required: ['risks'],
            additionalProperties: false
          }
        }
      }
    };

    try {
      console.log('📤 Sending risk analysis request to OpenRouter...');
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Software Project Scope Tool'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const result = data.choices[0]?.message?.content || '';
      console.log('✅ Risk analysis response received');
      return result;
    } catch (error) {
      console.error('❌ Risk analysis API call failed:', error);
      throw error;
    }
  }

  async generatePOCs(featuresJson: string, prioritiesJson: string, risksJson: string, hourlyRate: number): Promise<string> {
    console.log('🚀 Starting POC generation...');
    console.log('📝 Features for POC analysis:', featuresJson.substring(0, 200) + '...');
    console.log('🎯 Priorities for context:', prioritiesJson.substring(0, 200) + '...');
    console.log('🛡️ Risks for mitigation:', risksJson.substring(0, 200) + '...');
    console.log('💰 Hourly rate for cost calculation:', hourlyRate);
    
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: `You are a software project strategist specializing in POC (Proof of Concept) development. Generate exactly 3 distinct POC versions based on different strategic focuses: 1) Revenue-focused (prioritize features that can generate income quickly), 2) Fundraising-focused (prioritize features that demonstrate market potential and scalability), 3) Risk-mitigation focused (prioritize features that address the highest risks first). Each POC should be a minimal but complete concept that can be built and validated. Calculate realistic costs using the provided hourly rate.`
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Please generate 3 strategic POC versions based on this project analysis:

EXTRACTED FEATURES:
${featuresJson}

FEATURE PRIORITIES:
${prioritiesJson}

IDENTIFIED RISKS:
${risksJson}

HOURLY RATE: $${hourlyRate}

Generate 3 distinct POC approaches:
1. REVENUE-FOCUSED: Features that can generate income/value quickly
2. FUNDRAISING-FOCUSED: Features that demonstrate market potential and scalability to investors
3. RISK-MITIGATION FOCUSED: Features that address the highest-priority risks first

Each POC should include:
- Strategic focus and rationale
- 3-5 core features to build
- Realistic time estimate (in weeks)
- Cost calculation based on the hourly rate
- Clear value proposition for the chosen focus`
    };

    const messages = [systemMessage, userMessage];

    const request: OpenRouterRequest = {
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'poc_generation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              pocVersions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique identifier for the POC version' },
                    title: { type: 'string', description: 'Clear, descriptive title for this POC approach' },
                    focus: { 
                      type: 'string', 
                      enum: ['revenue', 'fundraising', 'risk-mitigation'],
                      description: 'Strategic focus of this POC version'
                    },
                    features: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'List of 3-5 core features to include in this POC'
                    },
                    timeEstimate: { type: 'string', description: 'Estimated timeline (e.g., "4-6 weeks")' },
                    cost: { type: 'number', description: 'Total estimated cost in USD based on hourly rate' }
                  },
                  required: ['id', 'title', 'focus', 'features', 'timeEstimate', 'cost'],
                  additionalProperties: false
                }
              }
            },
            required: ['pocVersions'],
            additionalProperties: false
          }
        }
      }
    };

    try {
      console.log('📤 Sending POC generation request to OpenRouter...');
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Software Project Scope Tool'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const result = data.choices[0]?.message?.content || '';
      console.log('✅ POC generation response received');
      return result;
    } catch (error) {
      console.error('❌ POC generation API call failed:', error);
      throw error;
    }
  }

  async generateMVP(selectedPOCJson: string, featuresJson: string, prioritiesJson: string, risksJson: string, hourlyRate: number): Promise<string> {
    console.log('🏗️ Starting MVP generation...');
    console.log('🚀 Selected POC for MVP:', selectedPOCJson.substring(0, 200) + '...');
    console.log('📝 Features for MVP context:', featuresJson.substring(0, 200) + '...');
    console.log('🎯 Priorities for context:', prioritiesJson.substring(0, 200) + '...');
    console.log('🛡️ Risks for mitigation:', risksJson.substring(0, 200) + '...');
    console.log('💰 Hourly rate for cost calculation:', hourlyRate);
    
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: `You are a senior software project manager specializing in MVP development planning. Generate a comprehensive MVP development plan based on the selected POC approach. The plan should expand the POC into a full production-ready MVP with detailed deliverables, realistic timelines, and accurate cost estimates. Consider technical architecture, user experience, security, scalability, and deployment requirements. Calculate precise costs using the provided hourly rate.`
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Please generate a comprehensive MVP development plan based on this analysis:

SELECTED POC APPROACH:
${selectedPOCJson}

ALL EXTRACTED FEATURES:
${featuresJson}

FEATURE PRIORITIES:
${prioritiesJson}

IDENTIFIED RISKS:
${risksJson}

HOURLY RATE: $${hourlyRate}

Generate a detailed MVP plan that includes:
- Core deliverables expanding the selected POC
- Technical architecture and infrastructure requirements  
- User experience and design deliverables
- Security and compliance considerations
- Testing and quality assurance
- Deployment and DevOps setup
- Documentation and maintenance
- Realistic time estimates for each deliverable
- Accurate cost calculations based on the hourly rate
- Risk mitigation strategies integrated into the plan

The MVP should be production-ready and scalable, building upon the selected POC foundation.`
    };

    const messages = [systemMessage, userMessage];

    const request: OpenRouterRequest = {
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'mvp_generation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              mvpDeliverables: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique identifier for the deliverable' },
                    title: { type: 'string', description: 'Clear, descriptive title for this deliverable' },
                    description: { type: 'string', description: 'Detailed description of what this deliverable includes' },
                    timeEstimate: { type: 'string', description: 'Estimated timeline (e.g., "2-3 weeks")' },
                    cost: { type: 'number', description: 'Total estimated cost in USD based on hourly rate' }
                  },
                  required: ['id', 'title', 'description', 'timeEstimate', 'cost'],
                  additionalProperties: false
                }
              }
            },
            required: ['mvpDeliverables'],
            additionalProperties: false
          }
        }
      }
    };

    try {
      console.log('📤 Sending MVP generation request to OpenRouter...');
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Software Project Scope Tool'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const result = data.choices[0]?.message?.content || '';
      console.log('✅ MVP generation response received');
      return result;
    } catch (error) {
      console.error('❌ MVP generation API call failed:', error);
      throw error;
    }
  }
}

export const openRouter = new OpenRouterClient();