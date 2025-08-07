# Sage API - Bruno Collection

This Bruno collection contains pre-configured API requests for testing all Sage backend endpoints.

## Setup

1. **Install Bruno**: Download from [usebruno.com](https://www.usebruno.com/)
2. **Open Collection**: File → Open Collection → Select the `bruno-collection` folder
3. **Start Backend**: Make sure your backend is running on `http://localhost:8080`

## Environment Variables

The collection uses these variables (defined in `environments/Local.bru`):
- `baseUrl`: http://localhost:8080
- `apiPath`: /api/ai

## Available Requests

### Health Check
- **GET** `/health` - Verify backend is running

### AI Endpoints
1. **POST** `/api/ai/extract-features` - Extract features from transcript and PDFs
2. **POST** `/api/ai/analyze-priorities` - Analyze feature priorities 
3. **POST** `/api/ai/analyze-risks` - Perform risk analysis
4. **POST** `/api/ai/generate-pocs` - Generate 3 POC versions
5. **POST** `/api/ai/generate-mvp` - Generate MVP deliverables
6. **POST** `/api/ai/chat` - General chat with AI

## Sample Data

Each request includes realistic sample data:
- **Features**: Social media platform examples (auth, posts, timeline)
- **Priorities**: Business impact and technical dependency analysis
- **Risks**: Technical, timeline, and resource concerns
- **Hourly Rate**: $150 for cost calculations

## Testing Flow

1. Start with **Health Check** to verify backend connectivity
2. Run **Extract Features** with your project transcript
3. Copy the features response to **Analyze Priorities**
4. Copy features + priorities to **Analyze Risks**  
5. Use all previous data for **Generate POCs**
6. Select a POC and use for **Generate MVP**

## Tests Included

Each request includes automatic tests:
- ✅ Status code validation
- ✅ Response structure verification
- ✅ Data type checking
- ✅ Business logic validation

## Customization

- Modify request bodies with your actual project data
- Adjust `hourlyRate` in POC and MVP requests
- Update `baseUrl` in environment for different deployment targets

Happy testing! 🚀