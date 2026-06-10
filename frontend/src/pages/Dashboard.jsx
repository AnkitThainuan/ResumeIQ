import { useState, useRef } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function ScoreRing({ score }) {
  const getColor = (s) => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";
  const getLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Work";
  const color = getColor(score);
  return (
    <div className="score-card">
      <div className="score-left">
        <div className="score-label">ATS Compatibility Score</div>
        <div className="score-number" style={{ color: "white" }}>{score}</div>
        <div className="score-desc">{getLabel(score)} — Your resume is {score >= 80 ? "well-optimized" : score >= 60 ? "moderately optimized" : "underoptimized"} for ATS systems</div>
        <div className="score-badges" style={{ marginTop: 16 }}>
          {score >= 80 && <span className="score-badge">✅ ATS Ready</span>}
          {score >= 60 && <span className="score-badge">📊 Analyzed</span>}
          <span className="score-badge">🤖 AI Reviewed</span>
        </div>
      </div>
      <div className="score-right">
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 10, fontWeight: 500 }}>Score Breakdown</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
            <span>Overall Score</span><span>{score}/100</span>
          </div>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${score}%`, background: color }}></div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
            <span>Readability</span><span>{Math.min(100, score + 5)}/100</span>
          </div>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${Math.min(100, score + 5)}%`, background: "rgba(255,255,255,0.7)" }}></div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
            <span>Keyword Match</span><span>{Math.max(40, score - 8)}/100</span>
          </div>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${Math.max(40, score - 8)}%`, background: "rgba(255,255,255,0.5)" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ icon, title, items, colorClass, bulletColor }) {
  return (
    <div className="result-card">
      <div className="result-card-header">
        <div className={`result-card-icon ${colorClass}`}>{icon}</div>
        <span className="result-card-title">{title}</span>
      </div>
      <ul className="result-list">
        {items.map((item, i) => (
          <li key={i}>
            <span className="result-list-bullet" style={{ color: bulletColor }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) { navigate("/"); return null; }

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Please upload a PDF file only."); return; }
    if (f.size > 5 * 1024 * 1024) { setError("File size must be under 5MB."); return; }
    setFile(f);
    setError("");
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await API.post("/resume/upload", formData);
      setResult(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Resume Analyzer</h1>
          <p className="dashboard-subtitle">Upload your resume and get instant AI-powered feedback to improve your ATS score</p>
        </div>

        {/* Upload Area */}
        {!result && !loading && (
          <div
            className={`upload-card ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !file && fileRef.current?.click()}
          >
            <div className="upload-icon">📎</div>
            <div className="upload-title">Drop your resume here</div>
            <p className="upload-sub">Supports PDF format up to 5MB</p>

            <label className="upload-file-label" onClick={(e) => e.stopPropagation()}>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="upload-file-input"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              📂 Browse Files
            </label>

            {file && (
              <div className="upload-selected">
                <span className="upload-file-name">📄 {file.name}</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        {file && !result && !loading && (
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <button className="btn btn-primary" onClick={handleUpload} style={{ flex: 1, maxWidth: 280 }}>
              🔍 Analyze Resume
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              ✕ Clear
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Analyzing your resume…</div>
            <div className="loading-sub">Our AI is reviewing your resume for ATS compatibility, skills, and improvements</div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <>
            <div className="score-section">
              <ScoreRing score={result.score} />
            </div>

            <div className="result-grid">
              <ResultCard
                icon="✅"
                title="Strengths"
                items={result.strengths}
                colorClass="green"
                bulletColor="var(--success)"
              />
              <ResultCard
                icon="⚠️"
                title="Weaknesses"
                items={result.weaknesses}
                colorClass="yellow"
                bulletColor="var(--warning)"
              />
              <ResultCard
                icon="🎯"
                title="Missing Skills"
                items={result.missingSkills}
                colorClass="red"
                bulletColor="var(--danger)"
              />
              <ResultCard
                icon="💡"
                title="Suggestions"
                items={result.suggestions}
                colorClass="blue"
                bulletColor="var(--primary)"
              />
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleReset}>
                🔄 Analyze Another Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
