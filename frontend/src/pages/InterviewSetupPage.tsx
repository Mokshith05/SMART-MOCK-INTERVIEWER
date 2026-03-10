import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL as string;

export function InterviewSetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [track, setTrack] = useState("frontend");
  const [difficulty, setDifficulty] = useState("junior");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/start-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, track, difficulty }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to start interview");
      }
      const data = await res.json();
      navigate(`/interview/live/${data.sessionId}`, {
        state: { question: data.question, name, track, difficulty },
      });
    } catch (err: any) {
      setError(err.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Interview Setup</h2>
        <p className="muted">
          Configure your mock interview. You will receive one question at a time with AI
          feedback.
        </p>
        <form onSubmit={handleStart} className="form">
          <label className="field">
            <span>Your name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Developer"
            />
          </label>
          <label className="field">
            <span>Track</span>
            <select value={track} onChange={(e) => setTrack(e.target.value)}>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="mern">MERN</option>
              <option value="system design">System Design</option>
            </select>
          </label>
          <label className="field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </label>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}

