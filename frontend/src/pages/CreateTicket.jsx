import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/app-pages.css";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: 1,
    priorityId: 2,
    assignedTo: "",
    statusId: 1
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name.includes("Id") || e.target.name === "assignedTo"
          ? e.target.value === ""
            ? ""
            : Number(e.target.value)
          : e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/tickets", {
        ...formData,
        assignedTo: formData.assignedTo || null
      });

      setMessage("Ticket created successfully.");

      setTimeout(() => {
        navigate("/tickets");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <p className="page-label">Ticket Center</p>
            <h1>Create Ticket</h1>
            <p className="page-subtitle">
              Submit a new IT support request.
            </p>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <label>Ticket Title</label>
          <input
            name="title"
            placeholder="Example: Laptop is not turning on"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue clearly..."
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="form-grid">
            <div>
              <label>Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="1">Hardware</option>
                <option value="2">Software</option>
                <option value="3">Network</option>
                <option value="4">Email</option>
                <option value="5">Access Request</option>
                <option value="6">Other</option>
              </select>
            </div>

            <div>
              <label>Priority</label>
              <select
                name="priorityId"
                value={formData.priorityId}
                onChange={handleChange}
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Critical</option>
              </select>
            </div>
          </div>

          <button disabled={loading}>
            {loading ? "Creating..." : "Create Ticket"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </main>
    </div>
  );
}

export default CreateTicket;