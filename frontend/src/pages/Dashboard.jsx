import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [notifications] = useState([
    "New high priority ticket assigned",
    "Server access request pending",
    "Ticket #104 resolved successfully"
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const totalTickets = stats.totalTickets || 0;
  const openTickets = stats.openTickets || 0;
  const pendingTickets = stats.pendingTickets || 0;
  const resolvedTickets = stats.resolvedTickets || 0;
  const inProgressTickets = stats.inProgressTickets || 0;
  const closedTickets = stats.closedTickets || 0;
  const totalUsers = stats.totalUsers || 0;

  const resolvedPercent =
    totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

  const openPercent =
    totalTickets > 0 ? Math.round((openTickets / totalTickets) * 100) : 0;

  const pendingPercent =
    totalTickets > 0 ? Math.round((pendingTickets / totalTickets) * 100) : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <header className="topbar">
          <div>
            <p className="page-label">IT Help Desk System</p>
            <h1>Support Dashboard</h1>
            <p className="page-subtitle">
              Monitor tickets, users, activity, and support performance.
            </p>
          </div>

          <div className="topbar-actions">
            <div className="notification-bell">
              🔔
              <span>{notifications.length}</span>
            </div>

            <div className="profile-pill">
              <span>Online</span>
              <div className="profile-dot"></div>
            </div>
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <h2>Welcome back 👋</h2>
            <p>
              Your help desk command center is ready. Track urgent issues,
              assign support tasks, and keep your users updated.
            </p>
          </div>

          <div className="hero-ticket">
            <span>🎫</span>
            <h3>{totalTickets}</h3>
            <p>Total Tickets</p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">🎫</div>
            <h3>Total Tickets</h3>
            <p>{totalTickets}</p>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">🟠</div>
            <h3>Open Tickets</h3>
            <p>{openTickets}</p>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">⏳</div>
            <h3>In Progress</h3>
            <p>{inProgressTickets}</p>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <h3>Resolved</h3>
            <p>{resolvedTickets}</p>
          </div>

          <div className="stat-card yellow">
            <div className="stat-icon">🕒</div>
            <h3>Pending</h3>
            <p>{pendingTickets}</p>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">🔒</div>
            <h3>Closed</h3>
            <p>{closedTickets}</p>
          </div>

          <div className="stat-card cyan">
            <div className="stat-icon">👥</div>
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="glass-card">
            <div className="section-header">
              <h2>Ticket Overview</h2>
              <span>Live Status</span>
            </div>

            <div className="chart-row">
              <div
                className="circle-chart"
                style={{
                  background: `conic-gradient(#22c55e ${resolvedPercent}%, rgba(255,255,255,0.12) 0)`
                }}
              >
                <div>
                  <strong>{resolvedPercent}%</strong>
                  <span>Resolved</span>
                </div>
              </div>

              <div className="chart-info">
                <div>
                  <span className="legend green-dot"></span>
                  Resolved {resolvedPercent}%
                </div>

                <div>
                  <span className="legend orange-dot"></span>
                  Open {openPercent}%
                </div>

                <div>
                  <span className="legend yellow-dot"></span>
                  Pending {pendingPercent}%
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="section-header">
              <h2>Notifications</h2>
              <span>{notifications.length} New</span>
            </div>

            <div className="notification-list">
              {notifications.map((item, index) => (
                <div className="notification-item" key={index}>
                  <div>🔔</div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card activity-card">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <span>Today</span>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <span></span>
              <div>
                <h4>New ticket created</h4>
                <p>A user submitted a new technical support request.</p>
              </div>
            </div>

            <div className="timeline-item">
              <span></span>
              <div>
                <h4>Status updated</h4>
                <p>One ticket was moved to In Progress.</p>
              </div>
            </div>

            <div className="timeline-item">
              <span></span>
              <div>
                <h4>Ticket resolved</h4>
                <p>A support agent completed a request successfully.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;