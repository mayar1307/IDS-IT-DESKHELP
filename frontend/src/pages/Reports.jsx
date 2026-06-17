import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/app-pages.css";

function Reports() {
  const [stats, setStats] = useState({});

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

  const total = stats.totalTickets || 0;

  function percent(value) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <p className="page-label">Analytics</p>
            <h1>Reports</h1>
            <p className="page-subtitle">
              Ticket analytics and support performance overview.
            </p>
          </div>

          <button className="primary-btn">Export Report</button>
        </div>

        <section className="report-grid">
          <div className="report-card">
            <h3>Open Tickets</h3>
            <p>{stats.openTickets || 0}</p>
            <div className="bar">
              <span style={{ width: `${percent(stats.openTickets || 0)}%` }}></span>
            </div>
          </div>

          <div className="report-card">
            <h3>Pending Tickets</h3>
            <p>{stats.pendingTickets || 0}</p>
            <div className="bar">
              <span style={{ width: `${percent(stats.pendingTickets || 0)}%` }}></span>
            </div>
          </div>

          <div className="report-card">
            <h3>Resolved Tickets</h3>
            <p>{stats.resolvedTickets || 0}</p>
            <div className="bar">
              <span style={{ width: `${percent(stats.resolvedTickets || 0)}%` }}></span>
            </div>
          </div>

          <div className="report-card">
            <h3>Closed Tickets</h3>
            <p>{stats.closedTickets || 0}</p>
            <div className="bar">
              <span style={{ width: `${percent(stats.closedTickets || 0)}%` }}></span>
            </div>
          </div>
        </section>

        <section className="details-card">
          <h2>Monthly Summary</h2>

          <div className="summary-list">
            <div>
              <span>Total Tickets</span>
              <strong>{stats.totalTickets || 0}</strong>
            </div>

            <div>
              <span>Total Users</span>
              <strong>{stats.totalUsers || 0}</strong>
            </div>

            <div>
              <span>Resolution Rate</span>
              <strong>{percent(stats.resolvedTickets || 0)}%</strong>
            </div>

            <div>
              <span>Average Resolution Time</span>
              <strong>Pending Backend</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;