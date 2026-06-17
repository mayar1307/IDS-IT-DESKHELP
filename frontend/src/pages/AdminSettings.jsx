import Sidebar from "../components/Sidebar";
import "../styles/app-pages.css";

function AdminSettings() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "Admin") {
    return (
      <div className="page-layout">
        <Sidebar />

        <main className="page-content">
          <div className="empty-card">
            <h1>Access Denied</h1>
            <p>Only admins can access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <p className="page-label">Admin Panel</p>
            <h1>Admin Settings</h1>
            <p className="page-subtitle">
              Manage system settings, roles, and help desk configuration.
            </p>
          </div>
        </div>

        <section className="settings-grid">
          <div className="settings-card">
            <h2>👥 User Management</h2>
            <p>Manage employees, agents, managers, and admins.</p>
          </div>

          <div className="settings-card">
            <h2>🛡️ Role Management</h2>
            <p>Control permissions and role-based access.</p>
          </div>

          <div className="settings-card">
            <h2>📁 Categories</h2>
            <p>Manage ticket categories such as hardware and software.</p>
          </div>

          <div className="settings-card">
            <h2>📊 Reports</h2>
            <p>Generate system reports and monitor activity logs.</p>
          </div>

          <div className="settings-card">
            <h2>⚙️ System Settings</h2>
            <p>Configure help desk preferences and workflows.</p>
          </div>

          <div className="settings-card">
            <h2>🧾 Audit Logs</h2>
            <p>Review important system actions and changes.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminSettings;