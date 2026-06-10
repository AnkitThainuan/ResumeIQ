import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <a className="navbar-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        <div className="navbar-brand-icon">📄</div>
        <span className="navbar-brand-name">ResumeIQ</span>
      </a>
      <div className="navbar-right">
        {user.name && (
          <span className="navbar-user">
            Welcome, <strong>{user.name}</strong>
          </span>
        )}
        <button className="btn btn-outline btn-sm" onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
