# NyaySetu – AI Legal Access for Bharat

## Problem

In India, most Supreme Court and High Court judgments are published in English. Millions of citizens — especially in rural areas — cannot understand their own legal rights due to language barriers. This creates a fundamental inequality in access to justice.

## Solution

NyaySetu bridges this gap using AI:
- **Translate** court judgments into 10+ Indian languages
- **Simplify** complex legal language to an 8th-grade reading level
- **Guide** citizens on their legal rights, next steps, and relevant laws

## Architecture

```
┌─────────────────────────────┐
│     React Frontend          │
│  (Translate / Summarize /   │
│   Legal Query / PDF Upload) │
└──────────┬──────────────────┘
           │ REST API (HTTP)
┌──────────▼──────────────────┐
│     FastAPI Backend          │
│  ┌────────────────────────┐ │
│  │  gemini_service.py     │ │
│  │  (Gemini API calls)    │ │
│  ├────────────────────────┤ │
│  │  pdf_parser.py         │ │
│  │  (pdfplumber)          │ │
│  ├────────────────────────┤ │
│  │  schemas.py            │ │
│  │  (Pydantic models)     │ │
│  └────────────────────────┘ │
└─────────────────────────────┘
```

## Folder Structure

```
nyaysetu-ai-for-bharat/
├── requirements.md
├── design.md
├── tasks.md
├── README.md
├── backend/
│   ├── main.py
│   ├── gemini_service.py
│   ├── schemas.py
│   ├── pdf_parser.py
│   ├── requirements.txt
│   └── .env.example
└── src/                     # React frontend
    ├── pages/Index.tsx
    ├── components/
    │   ├── HeroSection.tsx
    │   ├── TranslatePanel.tsx
    │   ├── SummarizePanel.tsx
    │   ├── LegalQueryPanel.tsx
    │   └── PdfUploader.tsx
    └── lib/api.ts
```

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
uvicorn main:app --reload
```

### Frontend

The React frontend runs on Vite. By default it calls `http://localhost:8000`.

```bash
npm install
npm run dev
```

To set a custom backend URL, set `VITE_API_URL` environment variable.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/translate` | Translate legal text to an Indian language |
| POST | `/summarize` | Simplify legal text into plain language |
| POST | `/legal-query` | Get legal guidance for a citizen's issue |
| POST | `/upload-pdf` | Extract text from a PDF document |

### Example

```bash
curl -X POST http://localhost:8000/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "The court hereby dismisses the appeal.", "target_language": "hindi"}'
```

## Hackathon Alignment

NyaySetu addresses **SDG 16: Peace, Justice, and Strong Institutions** by making legal information accessible to all citizens regardless of language.

## Disclaimer

This is an AI-powered informational tool. It does **not** provide legal advice. Always consult a licensed advocate.

---

Built with ❤️ for Bharat 🇮🇳
