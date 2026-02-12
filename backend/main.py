from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import TranslateRequest, TranslateResponse, SummarizeRequest, SummarizeResponse, LegalQueryRequest, LegalQueryResponse, PdfResponse
from gemini_service import GeminiService
from pdf_parser import extract_text_from_pdf
import tempfile
import os

app = FastAPI(title="NyaySetu API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini = GeminiService()


@app.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    try:
        result = gemini.translate(request.text, request.target_language)
        return TranslateResponse(translated_text=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    try:
        result = gemini.summarize(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/legal-query", response_model=LegalQueryResponse)
async def legal_query(request: LegalQueryRequest):
    try:
        result = gemini.legal_query(request.user_issue, request.language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-pdf", response_model=PdfResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        text = extract_text_from_pdf(tmp_path)
        os.unlink(tmp_path)

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        return PdfResponse(extracted_text=text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {"message": "NyaySetu API is running"}
