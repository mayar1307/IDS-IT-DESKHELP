import Sidebar from "../components/Sidebar";
import "../styles/app-pages.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <p className="page-label">Account</p>
            <h1>User Profile</h1>
            <p className="page-subtitle">
              View your account and role information.
            </p>
          </div>
        </div>

        <section className="profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <h2>{user?.name || "User"}</h2>
          <p>{user?.email || "No email"}</p>

          <div className="profile-info">
            <div>
              <span>User ID</span>
              <strong>{user?.userId || "N/A"}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{user?.role || "Employee"}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>Active</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;