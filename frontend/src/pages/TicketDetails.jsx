import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/app-pages.css";

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, []);

  async function fetchTicket() {
    try {
      const response = await api.get("/tickets");
      const foundTicket = response.data.find(
        (item) => Number(item.TicketId) === Number(id)
      );

      setTicket(foundTicket);
    } catch (error) {
      setMessage("Failed to load ticket.");
    }
  }

  async function fetchComments() {
    try {
      const response = await api.get(`/comments/ticket/${id}`);
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addComment(e) {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      await api.post("/comments", {
        ticketId: Number(id),
        message: newComment
      });

      setNewComment("");
      fetchComments();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add comment.");
    }
  }

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <p className="page-label">Ticket Details</p>
            <h1>{ticket?.Title || "Loading ticket..."}</h1>
            <p className="page-subtitle">
              View ticket information, status, and comments.
            </p>
          </div>
        </div>

        {message && <p className="form-message">{message}</p>}

        {ticket && (
          <section className="details-card">
            <div className="details-top">
              <span>🎫 #{ticket.TicketId}</span>
              <span>{ticket.Status}</span>
            </div>

            <h2>{ticket.Title}</h2>
            <p>{ticket.Description}</p>

            <div className="details-grid">
              <div>
                <strong>Category</strong>
                <span>{ticket.Category || "General"}</span>
              </div>

              <div>
                <strong>Priority</strong>
                <span>{ticket.Priority || "Medium"}</span>
              </div>

              <div>
                <strong>Status</strong>
                <span>{ticket.Status || "Open"}</span>
              </div>

              <div>
                <strong>Created</strong>
                <span>
                  {ticket.CreatedAt
                    ? new Date(ticket.CreatedAt).toLocaleString()
                    : "No date"}
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="details-card">
          <h2>Comments</h2>

          <form className="comment-form" onSubmit={addComment}>
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <button>Add Comment</button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="muted-text">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div className="comment-item" key={comment.CommentId}>
                  <strong>{comment.UserName}</strong>
                  <p>{comment.Message}</p>
                  <span>
                    {new Date(comment.CreatedAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default TicketDetails;