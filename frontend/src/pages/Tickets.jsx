import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "../styles/tickets.css";

function Tickets() {

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {

      const response =
        await api.get("/tickets");

      setTickets(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="tickets-layout">

      <Sidebar />

      <main className="tickets-content">

        <h1>Tickets</h1>

        <div className="tickets-list">

          {tickets.map((ticket) => (

            <div
              className="ticket-card"
              key={ticket.TicketId}
            >

              <div className="ticket-header">

                <h2>{ticket.Title}</h2>

                <span>
                  {ticket.Status}
                </span>

              </div>

              <p>
                {ticket.Description}
              </p>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Tickets;