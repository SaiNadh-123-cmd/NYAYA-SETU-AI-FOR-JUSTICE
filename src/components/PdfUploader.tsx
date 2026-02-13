import { useState, useRef } from "react";
import { Upload, FileText, Loader2, X } from "lucide-react";

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
}

const PdfUploader = ({ onTextExtracted }: PdfUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const text = await file.text();
      if (!text.trim()) {
        setError("Could not extract text from this PDF. Try pasting the text directly.");
        return;
      }
      onTextExtracted(text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop a PDF here or click to browse
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">Max 10MB</p>
      </div>

      {file && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 border border-border">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <button onClick={() => { setFile(null); setError(""); }} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="gradient-saffron text-primary-foreground px-6 py-2 rounded-lg font-medium text-sm w-full disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting...</> : "Extract Text from PDF"}
        </button>
      )}
    </div>
  );
};

export default PdfUploader;
