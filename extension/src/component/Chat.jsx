
import { useState } from "react";
import { askQuestion } from "../services/chatService";
import "./Chat.css";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAskQuestion(e) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const data = await askQuestion(question);
      setAnswer(data.answer || "No answer received.");
    } catch (err) {
      setError(err.message || "Failed to get answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <h2 className="chat-title">SummarAI Chat</h2>

      <form className="chat-form" onSubmit={handleAskQuestion}>
        <input
          className="chat-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your document..."
          disabled={loading}
        />

        <button
          className="chat-button"
          type="submit"
          disabled={loading || !question.trim()}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && (
        <p className="chat-error" role="alert">
          {error}
        </p>
      )}

      {answer && (
        <div className="chat-answer">
          <h3>Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
