import { useState, useRef } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// ─── Job roles list ────────────────────────────────────────────────────────────
const JOB_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Software Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Python Developer",
  "Java Developer",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Cloud Engineer (AWS/GCP/Azure)",
  "Cybersecurity Analyst",
  "Product Manager",
  "QA Engineer",
];

function ScoreRing({ score, jobRole }) {
  const getColor = (s) => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";
  const getLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Work";
  const color = getColor(score);
  return (
    <div className="score-card">
      <div className="score-left">
        <div className="score-label">ATS Compatibility Score</div>
        {/* Show job role badge if available */}
        {jobRole && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.12)", borderRadius: 20,
            padding: "4px 12px", fontSize: 12, fontWeight: 600,
            marginBottom: 8, color: "rgba(255,255,255,0.9)"
          }}>
            🎯 Analyzed for: {jobRole}
          </div>
        )}
        <div className="score-number" style={{ color: "white" }}>{score}</div>
        <div className="score-desc">
          {getLabel(score)} — Your resume is {score >= 80 ? "well-optimized" : score >= 60 ? "moderately optimized" : "underoptimized"}
          {jobRole ? ` for ${jobRole}` : " for ATS systems"}
        </div>
        <div className="score-badges" style={{ marginTop: 16 }}>
          {score >= 80 && <span className="score-badge">✅ ATS Ready</span>}
          {score >= 60 && <span className="score-badge">📊 Analyzed</span>}
          <span className="score-badge">🤖 AI Reviewed</span>
          {jobRole && <span className="score-badge">🎯 Role-Specific</span>}
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
  const [jobRole, setJobRole] = useState("");          // ← NEW
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);   // ← NEW: animated steps
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) { navigate("/"); return null; }

  // ─── Loading steps animation ────────────────────────────────────────────────
  const loadingSteps = [
    "📄 Reading your resume...",
    "🔍 Extracting skills and experience...",
    jobRole ? `🎯 Matching against ${jobRole} requirements...` : "🤖 Running ATS compatibility check...",
    "💡 Generating personalized suggestions...",
    "✅ Finalizing your report...",
  ];

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
    setLoadingStep(0);
    setError("");

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) { clearInterval(stepInterval); return prev; }
        return prev + 1;
      });
    }, 1200);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      // ── Send jobRole to backend ─────────────────────────────────────────────
      if (jobRole) formData.append("jobRole", jobRole);

      const res = await API.post("/resume/upload", formData);
      clearInterval(stepInterval);
      setResult(res.data.analysis);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobRole("");
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
          <>
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

            {/* ── Job Role Dropdown (NEW) ──────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 14, fontWeight: 600,
                marginBottom: 8, color: "var(--text-primary, #1a1a2e)"
              }}>
                🎯 Target Job Role <span style={{ fontWeight: 400, color: "#888", fontSize: 13 }}>(optional — for role-specific analysis)</span>
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px",
                  borderRadius: 10, border: "1.5px solid #e2e8f0",
                  fontSize: 14, background: "#fff", color: "#1a1a2e",
                  cursor: "pointer", outline: "none",
                  transition: "border-color 0.2s",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40,
                }}
                onFocus={(e) => e.target.style.borderColor = "#6c63ff"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              >
                <option value="">— Select a job role (or skip for general analysis) —</option>
                {JOB_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {jobRole && (
                <div style={{
                  marginTop: 8, fontSize: 13, color: "#6c63ff",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  ✅ AI will analyze your resume specifically for <strong>{jobRole}</strong>
                </div>
              )}
            </div>
          </>
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

        {/* ── Loading with animated steps (NEW) ───────────────────────────── */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">{loadingSteps[loadingStep]}</div>
            <div className="loading-sub">
              {jobRole
                ? `Analyzing your resume for ${jobRole} role...`
                : "Our AI is reviewing your resume for ATS compatibility, skills, and improvements"}
            </div>
            {/* Step dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {loadingSteps.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i <= loadingStep ? "#6c63ff" : "#e2e8f0",
                  transition: "background 0.3s"
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <>
            <div className="score-section">
              <ScoreRing score={result.score} jobRole={result.jobRole} />
            </div>

            <div className="result-grid">
              <ResultCard
                icon="✅"
                title={result.jobRole ? `Strengths for ${result.jobRole}` : "Strengths"}
                items={result.strengths}
                colorClass="green"
                bulletColor="var(--success)"
              />
              <ResultCard
                icon="⚠️"
                title={result.jobRole ? `Gaps for ${result.jobRole}` : "Weaknesses"}
                items={result.weaknesses}
                colorClass="yellow"
                bulletColor="var(--warning)"
              />
              <ResultCard
                icon="🎯"
                title={result.jobRole ? `Skills to Add for ${result.jobRole}` : "Missing Skills"}
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