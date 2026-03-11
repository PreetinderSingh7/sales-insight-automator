"use client";
import { useState, useRef, DragEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file || !email) {
      setStatus("error");
      setMessage("Please provide both a file and an email address.");
      return;
    }

    setStatus("loading");
    setMessage("");
    setPreview("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const res = await fetch(`${API_URL}/api/v1/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setStatus("success");
      setMessage(data.message);
      setPreview(data.preview || "");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Request failed.");
    }
  };

  const reset = () => {
    setFile(null);
    setEmail("");
    setStatus("idle");
    setMessage("");
    setPreview("");
  };

  return (
    <div style={styles.page}>
      {/* Background glow */}
      <div style={styles.glow} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <span style={styles.logo}>⚡</span>
            <span style={styles.brand}>Rabbitt AI</span>
          </div>
          <h1 style={styles.title}>Sales Insight Automator</h1>
          <p style={styles.subtitle}>
            Drop your quarterly data. Get an executive brief in your inbox — instantly.
          </p>
        </div>

        {status === "success" ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Report Sent!</h2>
            <p style={styles.successText}>{message}</p>
            {preview && (
              <div style={styles.previewBox}>
                <p style={styles.previewLabel}>Preview</p>
                <p style={styles.previewText}>{preview}</p>
              </div>
            )}
            <button style={styles.btn} onClick={reset}>
              Analyse Another File
            </button>
          </div>
        ) : (
          <>
            {/* File Drop Zone */}
            <div
              style={{
                ...styles.dropzone,
                borderColor: dragging ? "var(--accent)" : file ? "var(--success)" : "var(--border)",
                background: dragging ? "rgba(59,130,246,0.05)" : file ? "rgba(16,185,129,0.05)" : "var(--surface-2)",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div style={styles.dropIcon}>{file ? "📄" : "📂"}</div>
              {file ? (
                <>
                  <p style={styles.fileName}>{file.name}</p>
                  <p style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p style={styles.dropText}>Drag & drop your CSV or XLSX file</p>
                  <p style={styles.dropSub}>or click to browse · max 10MB</p>
                </>
              )}
            </div>

            {/* Email Input */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Recipient Email</label>
              <input
                type="email"
                placeholder="executive@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Error */}
            {status === "error" && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {message}
              </div>
            )}

            {/* Submit */}
            <button
              style={{
                ...styles.btn,
                opacity: status === "loading" ? 0.7 : 1,
                cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
              onClick={handleSubmit}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} />
                  Generating Summary...
                </span>
              ) : (
                "Generate & Send Report →"
              )}
            </button>

            <p style={styles.footerNote}>
              Powered by Google Gemini · End-to-end encrypted delivery
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "fixed",
    top: "-20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "700px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "48px 44px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
  },
  header: { marginBottom: "36px" },
  logoRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
  logo: { fontSize: "20px" },
  brand: { fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" },
  title: { fontFamily: "'DM Serif Display', serif", fontSize: "32px", lineHeight: 1.2, color: "var(--text)", marginBottom: "10px" },
  subtitle: { color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 },
  dropzone: {
    border: "2px dashed",
    borderRadius: "12px",
    padding: "36px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "20px",
  },
  dropIcon: { fontSize: "36px", marginBottom: "10px" },
  dropText: { fontSize: "14px", color: "var(--text)", marginBottom: "4px" },
  dropSub: { fontSize: "12px", color: "var(--text-muted)" },
  fileName: { fontSize: "14px", color: "var(--success)", fontWeight: 500, marginBottom: "4px" },
  fileSize: { fontSize: "12px", color: "var(--text-muted)" },
  fieldGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" },
  input: {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "13px 16px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    width: "100%",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "15px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "16px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.2s",
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#fca5a5",
    marginBottom: "16px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  footerNote: { fontSize: "12px", color: "var(--text-muted)", textAlign: "center" },
  successBox: { textAlign: "center" },
  successIcon: { fontSize: "48px", marginBottom: "16px" },
  successTitle: { fontFamily: "'DM Serif Display', serif", fontSize: "26px", marginBottom: "10px" },
  successText: { color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" },
  previewBox: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "left",
    marginBottom: "24px",
  },
  previewLabel: { fontSize: "11px", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" },
  previewText: { fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 },
};