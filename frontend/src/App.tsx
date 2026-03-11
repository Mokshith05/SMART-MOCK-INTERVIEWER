import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { InterviewSetupPage } from "./pages/InterviewSetupPage";
import { InterviewLivePage } from "./pages/InterviewLivePage";
import { InterviewResultPage } from "./pages/InterviewResultPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/interview/setup" element={<InterviewSetupPage />} />
      <Route path="/interview/live/:sessionId" element={<InterviewLivePage />} />
      <Route path="/interview/results/:sessionId" element={<InterviewResultPage />} />
    </Routes>
  );
}

