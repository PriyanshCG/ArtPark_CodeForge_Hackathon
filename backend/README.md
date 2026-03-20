# ArtPark CodeForge / AI-Adaptive Onboarding Engine — Backend

A high-performance backend service that leverages LLMs and Semantic Analysis to generate personalized, dependency-ordered learning pathways for new hires.

## ✨ Hackathon Features

1. **Intelligent Parsing**: Extracts skills, experience, and seniority from Resume and Job Descriptions (PDF/Text) using GPT-4o.
2. **Dynamic Mapping**: Semantic skill gap analysis using embeddings and cosine similarity to identify matched, missing, and weak skills.
3. **Adaptive Roadmap**: 5-phase algorithm that generates a time-boxed learning journey with dependency-aware ordering.
4. **Reasoning Trace**: Explainable AI traces for every recommendation, documenting *why* a course was included and *why* it's in that specific order.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- MongoDB (local or Atlas)
- LLM API Key (Groq/Gemini/OpenAI)

### Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your API keys
```

### Run
```bash
npm run dev
```

---

## 🛠 API Endpoints (Hackathon Ready)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/analysis/parse/resume` | Parse Resume (PDF/Text) → Structured JSON |
| **POST** | `/api/analysis/parse/jd` | Parse JD (PDF/Text) → Structured JSON |
| **POST** | `/api/analysis/analyze/skill-gap` | Compare Resume vs JD → Skill Gap Data |
| **POST** | `/api/analysis/roadmap/generate` | Generate 3-Stage Adaptive Roadmap |
| **POST** | `/api/analysis/run` | Full async analysis pipeline (Legacy support) |

---

## 🧠 How It Works

### Intelligent Skill Extraction
We use LLMs to extract not just keywords, but the *context* of experience. We distinguish between "heard of" and "expert-level" proficiency.

### Semantic Matching Engine
Uses `text-embedding-3-small` or Gemini embeddings + target similarity threshold (0.75) + a custom **Taxonomy Synonyms Map** to ensure "React.js" matches "React" and "Neural Networks" matches "Deep Learning" with high confidence.

### 5-Phase Adaptive Algorithm
1. **Dependency Analysis**: Builds a graph from our internal 50+ course catalog.
2. **Topological Ordering**: Using Kahn's Algorithm to ensure foundations come before advanced topics.
3. **Learner Personalization**: Skips what you know; adapts course difficulty to your seniority.
4. **LLM Enrichment**: Adds personalized tips, success criteria, and a weekly schedule.
5. **Reasoning Trace**: Injects JSON metadata explaining the logic behind every recommendation.

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/              ← Database & Course Catalog (50+ courses)
│   ├── services/
│   │   ├── resumeParser.js  ← Intelligent Resume Extraction
│   │   ├── jdParser.js      ← Intelligent JD Analysis
│   │   ├── skillMatcher.js  ← Semantic Gap Engine
│   │   └── adaptivePathway.js ← Core 5-Phase Algorithm
│   ├── controllers/         ← Granular Hackathon Handlers
│   ├── utils/
│   │   └── taxonomy.js      ← Deterministic Synonyms Map
│   └── server.js            ← Entry Point
```

---

## 🧪 Testing with cURL

```bash
# Parse a resume text
curl -X POST http://localhost:5000/api/analysis/parse/resume \
  -H "Content-Type: application/json" \
  -d '{"text": "John Doe, Senior React Developer with 5 years of Node.js experience..."}'
```
