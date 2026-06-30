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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const categoryMap = {
    Hardware: 1,
    Software: 2,
    Network: 3,
    Email: 4,
    "Access Request": 5,
    Other: 6
  };

  const priorityMap = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4
  };

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

  async function analyzeWithAI() {
    if (!formData.description.trim()) {
      setMessage("Write the ticket description first.");
      return;
    }

    setAiLoading(true);
    setMessage("");

    try {
      const response = await api.post("/ai/analyze-ticket", {
        title: formData.title,
        description: formData.description
      });

      const suggestion = response.data;

      setAiSuggestion(suggestion);

      setFormData((prev) => ({
        ...prev,
        title: suggestion.title || prev.title,
        categoryId: categoryMap[suggestion.category] || prev.categoryId,
        priorityId: priorityMap[suggestion.priority] || prev.priorityId
      }));

      setMessage("AI suggestions applied successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "AI analysis failed."
      );
    } finally {
      setAiLoading(false);
    }
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
              Submit a new IT support request with AI-powered suggestions.
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

          <button
            type="button"
            className="ai-analyze-btn"
            onClick={analyzeWithAI}
            disabled={aiLoading}
          >
            {aiLoading ? "Analyzing..." : "✨ Analyze with AI"}
          </button>

          {aiSuggestion && (
            <div className="ai-suggestion-card">
              <h3>AI Suggestion</h3>
              <p><strong>Category:</strong> {aiSuggestion.category}</p>
              <p><strong>Priority:</strong> {aiSuggestion.priority}</p>
              <p><strong>Summary:</strong> {aiSuggestion.summary}</p>
            </div>
          )}

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