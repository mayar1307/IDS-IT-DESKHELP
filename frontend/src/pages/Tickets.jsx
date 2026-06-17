import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/tickets.css";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const response = await api.get("/tickets");
      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function getStatusClass(status) {
    if (status === "Open") return "status-open";
    if (status === "In Progress") return "status-progress";
    if (status === "Pending") return "status-pending";
    if (status === "Resolved") return "status-resolved";
    if (status === "Closed") return "status-closed";
    return "status-default";
  }

  function getPriorityClass(priority) {
    if (priority === "Low") return "priority-low";
    if (priority === "Medium") return "priority-medium";
    if (priority === "High") return "priority-high";
    if (priority === "Critical") return "priority-critical";
    return "priority-medium";
  }

  return (
    <div className="tickets-layout">
      <Sidebar />

      <main className="tickets-content">
        <header className="tickets-header">
          <div>
            <p className="page-label">Ticket Center</p>
            <h1>Support Tickets</h1>
            <p className="page-subtitle">
              Track support requests, priorities, and issue status.
            </p>
          </div>

          <button className="new-ticket-btn" onClick={() => navigate("/tickets/new")}>
            + New Ticket
          </button>
        </header>

        <section className="ticket-summary">
          <div>
            <span>🎫</span>
            <h3>{tickets.length}</h3>
            <p>Total Tickets</p>
          </div>

          <div>
            <span>🔥</span>
            <h3>
              {
                tickets.filter(
                  (ticket) =>
                    ticket.Priority === "High" ||
                    ticket.Priority === "Critical"
                ).length
              }
            </h3>
            <p>Urgent</p>
          </div>

          <div>
            <span>✅</span>
            <h3>
              {
                tickets.filter((ticket) => ticket.Status === "Resolved")
                  .length
              }
            </h3>
            <p>Resolved</p>
          </div>
        </section>

        <section className="tickets-list">
          {tickets.length === 0 ? (
            <div className="empty-state">
              <div>🎧</div>
              <h2>No tickets yet</h2>
              <p>When users submit support requests, they will appear here.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div className="ticket-card" key={ticket.TicketId}>
                <div className="ticket-main">
                  <div className="ticket-icon">🎫</div>

                  <div>
                    <div className="ticket-title-row">
                      <h2>{ticket.Title}</h2>

                      <span className={getStatusClass(ticket.Status)}>
                        {ticket.Status}
                      </span>
                    </div>

                    <p>{ticket.Description}</p>

                    <div className="ticket-meta">
                      <span>📁 {ticket.Category || "General"}</span>

                      <span className={getPriorityClass(ticket.Priority)}>
                        ⚡ {ticket.Priority || "Medium"}
                      </span>

                      <span>
                        🕒{" "}
                        {ticket.CreatedAt
                          ? new Date(ticket.CreatedAt).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="ticket-action-btn" onClick={() => navigate(`/tickets/${ticket.TicketId}`)}>
                  View Details
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Tickets;