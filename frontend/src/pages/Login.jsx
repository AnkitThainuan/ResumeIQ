import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Side */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-icon">🎯</div>
          <div className="auth-hero-title">Land Your Dream Job</div>
          <div className="auth-hero-sub">AI-powered resume analysis to boost your ATS score and stand out from the crowd.</div>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              Instant ATS compatibility score
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              AI-driven improvement suggestions
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              Missing skills identification
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              Actionable feedback in seconds
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="auth-brand">
            <div className="auth-brand-icon">📄</div>
            <span className="auth-brand-name">ResumeIQ</span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to analyze your resume with AI</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className={`form-input ${error ? "error" : ""}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className={`form-input ${error ? "error" : ""}`}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <span className="auth-switch-link" onClick={() => navigate("/register")}>
              Create one free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
