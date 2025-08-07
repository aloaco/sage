import type { Feature, Priority, Risk, POCVersion, Deliverable } from './types';

export const mockFeatures: Feature[] = [
  {
    id: 'feat-001',
    title: 'User Authentication',
    description: 'Complete user authentication system with login, registration, password reset, and secure session management',
    source: {
      text: 'users need to create accounts and log in securely with proper authentication',
      startIndex: 45,
      endIndex: 112
    }
  },
  {
    id: 'feat-002', 
    title: 'Dashboard Analytics',
    description: 'Interactive analytics dashboard displaying real-time metrics, charts, and key performance indicators',
    source: {
      text: 'we need analytics and reporting features to track user engagement',
      startIndex: 203,
      endIndex: 268
    }
  },
  {
    id: 'feat-003',
    title: 'Payment Processing',
    description: 'Integrated payment system with Stripe for handling transactions, subscriptions, and billing management',
    source: {
      text: 'payment integration for subscriptions and billing',
      startIndex: 156,
      endIndex: 202
    }
  },
  {
    id: 'feat-004',
    title: 'Mobile App',
    description: 'Cross-platform mobile applications for iOS and Android with full feature parity',
    source: {
      text: 'mobile apps for both iOS and Android platforms',
      startIndex: 301,
      endIndex: 345
    }
  },
  {
    id: 'feat-005',
    title: 'API Integration',
    description: 'RESTful API with third-party service integrations for data synchronization and external platform connectivity',
    source: {
      text: 'API connections to external services and data sync',
      startIndex: 378,
      endIndex: 425
    }
  }
];

export const mockPriorities: Priority[] = [
  {
    id: '1',
    feature: 'User Authentication',
    priority: 'high',
    reasoning: 'Foundation for all user-related features and security'
  },
  {
    id: '2',
    feature: 'Payment Processing',
    priority: 'high', 
    reasoning: 'Critical for revenue generation and business model'
  },
  {
    id: '3',
    feature: 'Dashboard Analytics',
    priority: 'medium',
    reasoning: 'Important for user engagement but not MVP critical'
  },
  {
    id: '4',
    feature: 'API Integration',
    priority: 'medium',
    reasoning: 'Enhances functionality but can be phased in later'
  },
  {
    id: '5',
    feature: 'Mobile App',
    priority: 'low',
    reasoning: 'Nice to have but web app covers core functionality'
  }
];

export const mockRisks: Risk[] = [
  {
    id: '1',
    title: 'Third-party API Dependencies',
    description: 'Reliance on external APIs could cause delays if APIs change or have downtime',
    severity: 'high',
    category: 'technical',
    impact: 'Could cause significant delays and require architecture changes if APIs become unavailable or incompatible',
    mitigation: 'Implement fallback mechanisms, API versioning strategy, and comprehensive error handling. Consider backup API providers.'
  },
  {
    id: '2',
    title: 'Mobile Development Complexity',
    description: 'Native mobile apps require specialized expertise and longer development cycles',
    severity: 'medium',
    category: 'timeline',
    impact: 'May extend project timeline by 4-6 weeks and require additional specialized developers',
    mitigation: 'Consider cross-platform frameworks like React Native, hire experienced mobile developers early, or phase mobile development separately.'
  },
  {
    id: '3',
    title: 'Analytics Performance',
    description: 'Real-time analytics may require complex database optimization and caching',
    severity: 'medium',
    category: 'technical',
    impact: 'Could lead to slow dashboard performance and poor user experience as data volume grows',
    mitigation: 'Implement database indexing, caching layers, and consider using specialized analytics databases like ClickHouse or BigQuery.'
  },
  {
    id: '4',
    title: 'Payment Compliance',
    description: 'PCI compliance and payment security requirements may add complexity',
    severity: 'high',
    category: 'technical',
    impact: 'Non-compliance could prevent launch and require significant rework of payment systems',
    mitigation: 'Use PCI-compliant payment processors like Stripe, implement proper security audits, and follow PCI DSS guidelines from the start.'
  }
];

export const mockPOCVersions: POCVersion[] = [
  {
    id: '1',
    title: 'Revenue-Focused MVP',
    focus: 'revenue',
    features: ['User Authentication', 'Payment Processing', 'Basic Dashboard'],
    timeEstimate: '8-10 weeks',
    cost: 48000
  },
  {
    id: '2', 
    title: 'Fundraising Demo',
    focus: 'fundraising',
    features: ['User Authentication', 'Dashboard Analytics', 'API Integration Demo'],
    timeEstimate: '6-8 weeks', 
    cost: 36000
  },
  {
    id: '3',
    title: 'Risk Mitigation POC',
    focus: 'risk-mitigation', 
    features: ['User Authentication', 'API Integration Testing', 'Payment Processing'],
    timeEstimate: '10-12 weeks',
    cost: 54000
  }
];

export const mockMVPDeliverables: Deliverable[] = [
  {
    id: '1',
    title: 'User Authentication System',
    description: 'Complete login, registration, password reset, and user management',
    timeEstimate: '2 weeks',
    cost: 12000
  },
  {
    id: '2',
    title: 'Payment Integration',
    description: 'Stripe integration with subscription management and billing',
    timeEstimate: '3 weeks', 
    cost: 18000
  },
  {
    id: '3',
    title: 'Core Dashboard',
    description: 'Basic analytics dashboard with key metrics and charts',
    timeEstimate: '3 weeks',
    cost: 18000
  },
  {
    id: '4',
    title: 'API Foundation',
    description: 'RESTful API with authentication and core endpoints',
    timeEstimate: '2 weeks',
    cost: 12000
  }
];

export const mockFinalDeliverables: Deliverable[] = [
  ...mockMVPDeliverables,
  {
    id: '5',
    title: 'Advanced Analytics',
    description: 'Real-time analytics with custom reporting and data export',
    timeEstimate: '4 weeks',
    cost: 24000
  },
  {
    id: '6', 
    title: 'Mobile Applications',
    description: 'Native iOS and Android apps with full feature parity',
    timeEstimate: '8 weeks',
    cost: 48000
  },
  {
    id: '7',
    title: 'Advanced API Integrations',
    description: 'Full third-party integrations with data sync and webhooks',
    timeEstimate: '3 weeks',
    cost: 18000
  }
];