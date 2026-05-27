import { Link, useNavigate } from "react-router-dom";
import { LogOut, Search, ShieldCheck, Stethoscope, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const headerStyles = `
.site-header {
  position: relative;
  z-index: 120;
  padding: 18px 0 14px;
  background:
    radial-gradient(circle at 18% 20%, rgba(20,184,166,.16), transparent 28%),
    radial-gradient(circle at 84% 10%, rgba(37,99,235,.14), transparent 30%),
    linear-gradient(135deg, rgba(255,255,255,.96), rgba(239,246,255,.92));
  backdrop-filter: blur(22px);
  border-bottom: 1px solid rgba(219,234,254,.95);
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
}

.header-content {
  width: 100%;
  max-width: 1720px;
  margin: 0 auto;
  padding: 0 clamp(36px, 6vw, 110px) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.logo-container > svg {
  width: 54px;
  height: 54px;
  padding: 12px;
  border-radius: 20px;
  color: white;
  background: linear-gradient(135deg, #2563eb, #14b8a6);
  box-shadow: 0 16px 34px rgba(37,99,235,.24);
}

.app-title {
  margin: 0;
  font-size: clamp(1.7rem, 2.4vw, 2.35rem);
  line-height: 1;
  letter-spacing: -.055em;
  color: #0f172a;
  font-weight: 950;
}

.app-subtitle {
  margin: 7px 0 0;
  color: #64748b;
  font-weight: 850;
  letter-spacing: .01em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.search-container {
  position: relative;
  width: min(430px, 34vw);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #2563eb;
  pointer-events: none;
}

.search-input {
  width: 100%;
  min-height: 50px;
  border: 1px solid rgba(191,219,254,.95);
  border-radius: 999px;
  padding: 0 18px 0 46px;
  font: inherit;
  font-weight: 800;
  color: #0f172a;
  outline: none;
  background: rgba(255,255,255,.78);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 10px 26px rgba(15,23,42,.06);
  transition: .2s ease;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 5px rgba(37,99,235,.12), 0 14px 28px rgba(15,23,42,.08);
}

.auth-area {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.user-button,
.logout-button {
  min-height: 48px;
  border: none;
  border-radius: 999px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font: inherit;
  font-weight: 950;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: .2s ease;
}

.user-button {
  color: #1e3a8a;
  background: rgba(239,246,255,.95);
  border: 1px solid rgba(191,219,254,.95);
  box-shadow: 0 12px 26px rgba(37,99,235,.09);
}

.user-button:hover {
  transform: translateY(-2px);
  color: white;
  background: linear-gradient(135deg, #2563eb, #14b8a6);
  border-color: transparent;
  box-shadow: 0 16px 34px rgba(37,99,235,.22);
}

.logout-button {
  color: white;
  background: linear-gradient(135deg, #ef4444, #f97316);
  box-shadow: 0 14px 28px rgba(239,68,68,.22);
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(239,68,68,.28);
}

.header-badge {
  min-height: 38px;
  padding: 0 13px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  font-size: .82rem;
  font-weight: 950;
}

@media (max-width: 1050px) {
  .header-content {
    align-items: flex-start;
    flex-direction: column;
    padding: 0 24px !important;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-container {
    width: min(520px, 100%);
    flex: 1;
  }
}

@media (max-width: 720px) {
  .header-actions,
  .auth-area {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .search-container,
  .user-button,
  .logout-button {
    width: 100%;
  }

  .logo-container {
    align-items: flex-start;
  }

  .logo-container > svg {
    width: 48px;
    height: 48px;
  }
}
`;

export default function Header() {
  const navigate = useNavigate();
  const { user, authLoading, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/signin", { replace: true });
  }

  return (
    <header className="site-header">
      <style>{headerStyles}</style>

      <div className="container header-content">
        <Link to="/dashboard" className="logo-container" style={{ textDecoration: "none" }}>
          <Stethoscope size={36} strokeWidth={2.2} />

          <div>
            <h1 className="app-title">HealthCare Service</h1>
            <p className="app-subtitle">Powered by Team Titans</p>
          </div>
        </Link>

        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search hospitals, doctors, medicines..."
            />
          </div>

          {authLoading ? (
            <button className="user-button" type="button">
              Loading...
            </button>
          ) : user ? (
            <div className="auth-area">
              <span className="header-badge">
                <ShieldCheck size={15} />
                Verified User
              </span>

              <button className="user-button" type="button">
                <User size={18} />
                {user.name}
              </button>

              <button className="logout-button" type="button" onClick={handleLogout}>
                <LogOut size={17} />
                Logout
              </button>
            </div>
          ) : (
            <Link className="user-button" to="/signin">
              <User size={18} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}