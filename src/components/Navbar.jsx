import { NavLink } from 'react-router-dom';
import logo from "../assets/Logo.png";

function Navbar() {
  const user = localStorage.getItem("user");

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="navbar">
      <div className="logo-section">
        <img src={logo} alt="LabGo Logo" className="logo-img" />
        <span className="logo-text">LabGo</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>

        <NavLink to="/equipment" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Equipment
        </NavLink>

        <NavLink to="/equipment/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Add Equipment
        </NavLink>

        <NavLink to="/lending/issue" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Issue
        </NavLink>

        <NavLink to="/lending/return" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Returns
        </NavLink>

        {user && (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;