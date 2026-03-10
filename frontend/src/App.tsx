import React from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { InterviewSetupPage } from "./pages/InterviewSetupPage";
import { InterviewLivePage } from "./pages/InterviewLivePage";
import { InterviewResultPage } from "./pages/InterviewResultPage";

export function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <Link to="/" className="logo">
          AI Interview Assistant
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview/setup" element={<InterviewSetupPage />} />
          <Route path="/interview/live/:sessionId" element={<InterviewLivePage />} />
          <Route path="/interview/results/:sessionId" element={<InterviewResultPage />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastSessionId = (location.state as any)?.lastSessionId as string | undefined;

  return (
    <div className="container">
      <section className="hero">
        <h1>Practice Technical Interviews with AI</h1>
        <p>
          Start a mock interview, answer questions, and get instant feedback and a detailed
          report of your performance.
        </p>
        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/interview/setup")}
          >
            Start New Interview
          </button>
          {lastSessionId && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/interview/results/${lastSessionId}`)}
            >
              View Last Results
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

