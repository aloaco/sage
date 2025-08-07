# Sage - AI-Powered Project Scope Analysis Tool

A full-stack application that helps analyze software project requirements, extract features, assess priorities and risks, and generate POCs and MVPs with cost estimates.

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend** (`/frontend`) - React + TypeScript + Vite application
- **Backend** (`/backend`) - Express.js API server with OpenRouter AI integration

```
sage/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── services/   # API clients
│   │   ├── store/      # State management
│   │   └── types/      # TypeScript definitions
│   └── ...
├── backend/            # Express backend server
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── ...
└── README.md          # This file
```

## 🚀 Features

### AI-Powered Analysis
- **Feature Extraction**: Analyze project transcripts and documents to extract buildable features
- **Priority Analysis**: Determine feature priorities based on business impact and dependencies
- **Risk Assessment**: Identify technical, timeline, and resource risks with mitigation strategies
- **POC Generation**: Create strategic Proof of Concept versions (Revenue, Fundraising, Risk-mitigation focused)
- **MVP Planning**: Generate comprehensive MVP development plans with cost estimates

### Technical Features
- **Document Processing**: Support for PDF uploads alongside text transcripts
- **Cost Calculation**: Realistic time and cost estimates based on hourly rates
- **Centralized AI Processing**: All AI operations handled by backend for better performance
- **Clean Architecture**: Separation of concerns between frontend UI and backend processing

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **File Upload** support for PDFs

### Backend
- **Express.js** with Node.js
- **OpenRouter API** integration for AI processing
- **Axios** for HTTP requests
- **Comprehensive logging** for monitoring

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sage
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=8080
   NODE_ENV=development
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_BACKEND_URL=http://localhost:8080
   ```

### Development

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:8080`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on `http://localhost:5173`

### Production

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## 📊 API Endpoints

### AI Processing Routes
- `POST /api/ai/extract-features` - Extract features from transcript and PDFs
- `POST /api/ai/analyze-priorities` - Analyze feature priorities
- `POST /api/ai/analyze-risks` - Perform risk analysis
- `POST /api/ai/generate-pocs` - Generate POC versions
- `POST /api/ai/generate-mvp` - Generate MVP deliverables
- `POST /api/ai/chat` - General chat functionality

### Health Check
- `GET /health` - Server health status

## 🔄 Workflow

1. **Input Phase**: Upload project transcript and optional PDF documents
2. **Feature Extraction**: AI analyzes materials and extracts buildable features
3. **Priority Analysis**: Features are prioritized based on business impact
4. **Risk Assessment**: Potential risks are identified with mitigation strategies
5. **POC Generation**: Three strategic POC approaches are generated
6. **MVP Planning**: Comprehensive MVP plan based on selected POC

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📝 Logging

- **Frontend**: Minimal logging focused on essential operations
- **Backend**: Comprehensive logging with request timing, data metrics, and AI processing details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)

---

Built with ❤️ using Claude Code