import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavSearch from "./NavSearch";

export default function Navbar() {
  const { isAuthenticated, logout, username } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <div className="brand-mark">S</div>
          <div className="brand-text">
            <div className="brand-title">Sanvi Shringaar</div>
            <div className="brand-subtitle">&amp; Gift Corner</div>
          </div>
        </NavLink>

        {isAuthenticated && <NavSearch />}

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Catalog
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                Admin ({username})
              </NavLink>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              Family Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
