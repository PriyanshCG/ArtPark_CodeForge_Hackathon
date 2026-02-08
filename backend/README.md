# AI-Adaptive Onboarding Engine — Backend API

A backend service that uses AI to generate personalized, dependency-ordered learning pathways for new hires based on their resume and a job description.

## Quick Start

### Prerequisites
- Node.js >= 20
- MongoDB (local or Atlas)
- OpenAI API Key

### Setup

```bash
cd backend
npm install
```

Copy `.env` and fill in your values:
```bash
# Edit .env and set your OPENAI_API_KEY and MONGODB_URI
```

### Run (Development)
```bash
npm run dev
```

### Run (Production)
```bash
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload resume + JD (FormData) |
| POST | `/api/analysis/run` | Run full analysis pipeline |
| GET | `/api/analysis/:sessionId` | Poll analysis status |
| POST | `/api/pathway/generate` | Generate adaptive pathway |
| GET | `/api/pathway/:sessionId` | Get stored pathway |
| GET | `/api/courses` | List all 38 courses |
| GET | `/api/courses/:domain` | Filter by domain |

---

## How It Works

### 5-Phase Adaptive Pathway Algorithm

1. **Phase 1 — Dependency Graph**: Build directed acyclic graph of skills from `courseDatabase.json`
2. **Phase 2 — Topological Sort (Kahn's Algorithm)**: Order skills so prerequisites always come first
3. **Phase 3 — Learner Adaptation**: Skip known skills, adjust proficiency start level based on resume
4. **Phase 4 — LLM Enrichment**: GPT-4o adds learning tips, success criteria, and weekly schedule
5. **Phase 5 — Reasoning Trace**: Every step gets `why_included`, `why_this_order`, `dependency_chain`, `adaptation_note`

### Semantic Skill Matching
Uses OpenAI `text-embedding-3-small` + cosine similarity (threshold: 0.75) to identify synonymous skills across resume and JD (e.g., "PostgreSQL" ≈ "SQL", "Neural Networks" ≈ "Deep Learning").

### Grounding Validation
After every pathway generation, all course IDs are verified against `courseDatabase.json`. Returns a `grounding_score` (aim: 100%).

---

## Project Structure

```
backend/
├── src/
│   ├── server.js            ← Express entry point
│   ├── config/
│   │   ├── db.js            ← MongoDB connection (retry + fallback)
│   │   ├── openai.js        ← OpenAI singleton client
│   │   └── courseDatabase.json  ← 38-course catalog
│   ├── services/
│   │   ├── llm.service.js          ← callLLM, callLLMStructured, getEmbedding
│   │   ├── resumeParser.service.js ← Parse resume PDF → structured profile
│   │   ├── jdParser.service.js     ← Parse JD text → structured requirements
│   │   ├── skillMatcher.service.js ← Semantic gap analysis (embeddings)
│   │   ├── adaptivePathway.service.js ← 5-phase pathway algorithm
│   │   └── reasoningTrace.service.js  ← Grounding validation
│   ├── controllers/
│   │   ├── upload.controller.js
│   │   ├── analysis.controller.js
│   │   └── pathway.controller.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── uploads/
├── .env
└── package.json
```

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/adaptive-onboarding
OPENAI_API_KEY=sk-proj-...
LLM_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-small
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

---

## Sample API Flow

```bash
# 1. Upload files
curl -X POST http://localhost:5000/api/upload \
  -F "resume=@resume.pdf" \
  -F "jobDescriptionText=We need a Senior Full Stack Engineer with React, Node.js, TypeScript, Docker..."

# Response: { "sessionId": "uuid-here", ... }

# 2. Run analysis
curl -X POST http://localhost:5000/api/analysis/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "uuid-here"}'

# 3. Generate pathway
curl -X POST http://localhost:5000/api/pathway/generate \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "uuid-here"}'
```
