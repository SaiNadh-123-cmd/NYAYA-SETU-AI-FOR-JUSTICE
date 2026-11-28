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

### Frontend (Vite + React)

The frontend is a static Vite site. It calls the AI endpoints (`translate`, `summarize`, `legal-query`) exposed as Netlify functions.

```bash
npm install
npm run dev        # local dev (http://localhost:8080)
npm run build      # production build -> dist/
npm run preview    # preview production build
```

### Backend / AI (Netlify serverless functions)

The three AI tools run as Netlify functions under `netlify/functions/` and call Google Gemini directly:

- `netlify/functions/translate.js`
- `netlify/functions/summarize.js`
- `netlify/functions/legal-query.js`

Set `GEMINI_API_KEY` in your Netlify site environment variables (get a free key at [Google AI Studio](https://aistudio.google.com/apikey)).

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_SUPABASE_URL` | No | Supabase project URL (optional auth & saved history) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | No | Supabase anon key (optional auth & saved history) |
| `VITE_API_URL` | No | Custom backend URL (defaults to same origin / Netlify functions) |

Copy `.env.example` to `.env` locally for development.

## Deploy on Netlify

1. Push this repository to GitHub.
2. In [Netlify](https://netlify.com), click **Add new site → Import an existing project** and connect your GitHub repo.
3. Build settings are detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Add the environment variables above (especially `GEMINI_API_KEY`) in **Site settings → Environment variables**.
5. Deploy.

The site will be live on your Netlify URL with the AI tools powered by serverless functions — no Lovable, no vendor lock-in.

### Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify init
netlify deploy --build --prod
```

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
