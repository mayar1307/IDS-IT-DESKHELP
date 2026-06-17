import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {

  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response =
        await api.get("/dashboard/stats");

      setStats(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-content">

        <h1>Dashboard</h1>

        <div className="stats-grid">

          <div className="stat-card">
            <h3>Total Tickets</h3>
            <p>{stats.totalTickets || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Open Tickets</h3>
            <p>{stats.openTickets || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{stats.resolvedTickets || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Users</h3>
            <p>{stats.totalUsers || 0}</p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;