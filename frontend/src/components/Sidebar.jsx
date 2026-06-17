import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <h2>Help Desk</h2>

      <nav>
        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/tickets">
          Tickets
        </Link>
      </nav>

      <button onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;