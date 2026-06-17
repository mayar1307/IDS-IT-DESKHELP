import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/app-pages.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const response = await api.get("/notifications/my");
      setNotifications(response.data);
    } catch (error) {
      setMessage("No notifications available yet.");
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      setMessage("Failed to update notification.");
    }
  }

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <p className="page-label">Notification Center</p>
            <h1>Notifications</h1>
            <p className="page-subtitle">
              Track ticket alerts and system updates.
            </p>
          </div>
        </div>

        {message && <p className="form-message">{message}</p>}

        <section className="notification-page-list">
          {notifications.length === 0 ? (
            <div className="empty-card">
              <h2>🔔 No notifications</h2>
              <p>Your ticket updates will appear here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div className="notification-page-item" key={item.NotificationId}>
                <div>
                  <h3>{item.Title || "Notification"}</h3>
                  <p>{item.Message}</p>
                </div>

                {!item.IsRead && (
                  <button onClick={() => markAsRead(item.NotificationId)}>
                    Mark Read
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;