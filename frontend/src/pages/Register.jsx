import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-icon">🚀</div>
          <div className="auth-hero-title">Start for Free</div>
          <div className="auth-hero-sub">Join thousands of job seekers who use ResumeIQ to get more interviews.</div>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              Free AI resume analysis
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              Detailed ATS score breakdown
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              Personalized improvement tips
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              No credit card required
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="auth-brand">
            <div className="auth-brand-icon">📄</div>
            <span className="auth-brand-name">ResumeIQ</span>
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Get your AI-powered resume analysis in seconds</p>

          {apiError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input ${errors.name ? "error" : ""}`}
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className={`form-input ${errors.email ? "error" : ""}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className={`form-input ${errors.password ? "error" : ""}`}
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
              {!errors.password && <p className="form-hint">Must be at least 6 characters long</p>}
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <span className="auth-switch-link" onClick={() => navigate("/")}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
