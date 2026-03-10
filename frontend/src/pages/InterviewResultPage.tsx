import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL as string;

interface Turn {
  question: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
}

interface ResultData {
  sessionId: string;
  name: string;
  track: string;
  difficulty: string;
  createdAt: string;
  finished: boolean;
  turns: Turn[];
  averageScore: number | null;
}

export function InterviewResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${AI_SERVICE_URL}/results/${sessionId}`);
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Failed to load results");
        }
        const json = (await res.json()) as ResultData;
        setData(json);
      } catch (err: any) {
        setError(err.message ?? "Unexpected error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="container">
        <div className="card">
          <p className="error">Missing session id.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <div className="card">
          <p className="error">No data for this session.</p>
        </div>
      </div>
    );
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const turn of data.turns) {
    if (typeof turn.score === "number" && turn.score >= 7) {
      strengths.push(`Strong answer to: "${turn.question.slice(0, 80)}..."`);
    }
    if (typeof turn.score === "number" && turn.score <= 5) {
      weaknesses.push(`Needs improvement on: "${turn.question.slice(0, 80)}..."`);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Interview Results</h2>
            <p className="muted">
              {data.name} · {data.track} · {data.difficulty}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/", {
                state: { lastSessionId: sessionId, fromResults: location.pathname },
              })
            }
          >
            Back to Home
          </button>
        </div>

        <section className="summary-grid">
          <div className="summary-item">
            <p className="label">Average score</p>
            <p className="value">
              {data.averageScore !== null ? data.averageScore.toFixed(1) : "N/A"} / 10
            </p>
          </div>
          <div className="summary-item">
            <p className="label">Questions answered</p>
            <p className="value">
              {data.turns.filter((t) => t.answer && typeof t.score === "number").length}
            </p>
          </div>
          <div className="summary-item">
            <p className="label">Created at</p>
            <p className="value">
              {new Date(data.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </section>

        <section className="two-column">
          <div>
            <h3>Strengths</h3>
            {strengths.length === 0 ? (
              <p className="muted">No clear strengths identified yet. Keep practicing.</p>
            ) : (
              <ul className="list">
                {strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Areas to improve</h3>
            {weaknesses.length === 0 ? (
              <p className="muted">
                No major weaknesses detected. Try higher difficulty or system design rounds.
              </p>
            ) : (
              <ul className="list">
                {weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h3>Answer breakdown</h3>
          <div className="turns">
            {data.turns.map((turn, index) => (
              <div key={index} className="turn">
                <p className="turn-question">
                  Q{index + 1}. {turn.question}
                </p>
                {turn.answer ? (
                  <>
                    <p className="turn-answer">
                      <strong>Your answer:</strong> {turn.answer}
                    </p>
                    {typeof turn.score === "number" && (
                      <p className="turn-score">Score: {turn.score}/10</p>
                    )}
                    {turn.feedback && (
                      <p className="turn-feedback">
                        <strong>Feedback:</strong> {turn.feedback}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="muted">No answer recorded.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

