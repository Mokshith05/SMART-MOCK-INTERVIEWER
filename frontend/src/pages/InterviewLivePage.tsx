import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL as string;

interface LocationState {
  question: string;
  name: string;
  track: string;
  difficulty: string;
}

export function InterviewLivePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [question, setQuestion] = useState(state.question || "");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!question) return;
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [question]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      return;
    }
    const recognition = new SpeechRecognitionCtor() as SpeechRecognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  function toggleListening() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError(
        "Speech recognition is not available in this browser. Please use Chrome or Edge, or type your answer."
      );
      return;
    }
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setError(null);
      setAnswer("");
      recognition.start();
      setListening(true);
    }
  }

  if (!sessionId) {
    return (
      <div className="container">
        <div className="card">
          <p className="error">Missing session id.</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to evaluate answer");
      }
      const data = await res.json();
      setScore(data.score);
      setFeedback(data.feedback);
      setAnswer("");
      if (data.finished) {
        setFinished(true);
      } else if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
      }
    } catch (err: any) {
      setError(err.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    navigate(`/interview/results/${sessionId}`, { state: { fromLive: true } });
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Live Interview</h2>
            {state.name && (
              <p className="muted">
                Candidate: {state.name} · {state.track} · {state.difficulty}
              </p>
            )}
          </div>
          <button className="btn btn-secondary" onClick={handleFinish}>
            View Results
          </button>
        </div>

        <div className="question-block">
          <h3>Current Question</h3>
          <p className="question-text">{question || "Waiting for question..."}</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Your answer</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder="Type your answer here as if you are speaking to an interviewer..."
            />
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleListening}
            >
              {listening ? "Stop recording" : "Speak answer"}
            </button>
            <span className="muted">
              {listening
                ? "Listening... speak your answer clearly."
                : "You can speak your answer or type it above."}
            </span>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Evaluating..." : "Submit answer"}
          </button>
        </form>

        {score !== null && feedback && (
          <div className="feedback-block">
            <h3>Feedback</h3>
            <p className="score">Score: {score}/10</p>
            <p>{feedback}</p>
            {finished && (
              <p className="muted">
                The AI decided the interview has enough signal. You can view your full
                report.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

