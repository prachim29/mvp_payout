import { Link, useNavigate } from "react-router-dom";

function Layout({ children, showNav = true }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  if (!showNav) return <>{children}</>;

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/vendors">
            <i className="bi bi-wallet2 me-2"></i>Payout Management
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/vendors">
                  <i className="bi bi-people me-1"></i>Vendors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/payouts">
                  <i className="bi bi-credit-card me-1"></i>Payouts
                </Link>
              </li>
            </ul>
            <span className="navbar-text text-white me-3">
              <i className="bi bi-person-badge me-1"></i>
              {role || "User"}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container py-4 flex-grow-1">{children}</main>
    </div>
  );
}

export default Layout;
