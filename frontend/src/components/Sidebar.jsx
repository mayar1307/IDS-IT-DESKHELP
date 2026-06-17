import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🎧</div>
        <div>
          <h2>HelpDesk</h2>
          <p>Support Center</p>
        </div>
      </div>

      <div className="user-box">
        <div className="avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <h4>{user?.name || "User"}</h4>
          <p>{user?.role || "Employee"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">📊 Dashboard</NavLink>
        <NavLink to="/tickets">🎫 Tickets</NavLink>
        <NavLink to="/tickets/create">➕ Create Ticket</NavLink>
        <NavLink to="/reports">📈 Reports</NavLink>
        <NavLink to="/notifications">🔔 Notifications</NavLink>
        <NavLink to="/profile">👤 Profile</NavLink>

        {user?.role === "Admin" && (
          <NavLink to="/admin-settings">⚙️ Admin Settings</NavLink>
        )}
      </nav>

      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>
    </aside>
  );
}

export default Sidebar;