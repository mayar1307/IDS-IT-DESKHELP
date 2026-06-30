import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/aiChatbot.css";

function AIChatbot() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I’m your Gemini IT Assistant. Tell me your technical issue and I’ll suggest a category, priority, and what to do next."
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: userMessage
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            error.response?.data?.message ||
            "Sorry, I could not reach the AI assistant right now."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function createTicketFromChat() {
    navigate("/tickets/create");
    setOpen(false);
  }

  return (
    <>
      <button
        className="ai-floating-button"
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "🤖"}
      </button>

      {open && (
        <div className="ai-chatbot">
          <div className="ai-chat-header">
            <div>
              <h3>Gemini IT Assistant</h3>
              <p>Smart help desk support</p>
            </div>

            <div className="ai-status">
              <span></span>
              Online
            </div>
          </div>

          <div className="ai-suggestions">
            <button
              onClick={() =>
                setInput("My laptop is not connecting to Wi-Fi")
              }
            >
              Wi-Fi issue
            </button>

            <button
              onClick={() =>
                setInput("My Outlook keeps crashing")
              }
            >
              Outlook crash
            </button>

            <button
              onClick={() =>
                setInput("I need access to a shared folder")
              }
            >
              Access request
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "user"
                    ? "ai-message user"
                    : "ai-message bot"
                }
              >
                <p>{message.text}</p>
              </div>
            ))}

            {loading && (
              <div className="ai-message bot">
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="ai-ticket-box">
            <p>Need human support?</p>
            <button onClick={createTicketFromChat}>
              + Create Ticket
            </button>
          </div>

          <form className="ai-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Describe your IT issue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIChatbot;