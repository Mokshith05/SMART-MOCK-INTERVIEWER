import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  CHROMA_URL = "http://localhost:8000",
  OLLAMA_URL = "http://localhost:11434",
  PORT = 4000,
} = process.env;

// Supabase client (anon key – fine for local/demo)
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Simple in-memory store for sessions (for end-to-end demo)
const sessions = new Map();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Utility: call Ollama to generate text
async function ollamaGenerate(prompt) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error: ${text}`);
  }
  const data = await res.json();
  return data.response;
}

// Utility: create collection in Chroma if missing
let chromaCollectionId = null;

async function ensureChromaCollection() {
  if (chromaCollectionId) return chromaCollectionId;
  const name = "interview_answers";

  const existing = await fetch(`${CHROMA_URL}/api/v1/collections`);
  if (existing.ok) {
    const data = await existing.json();
    const found = data?.collections?.find((c) => c.name === name);
    if (found) {
      chromaCollectionId = found.id;
      return chromaCollectionId;
    }
  }

  const res = await fetch(`${CHROMA_URL}/api/v1/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chroma create collection error: ${text}`);
  }
  const created = await res.json();
  chromaCollectionId = created.id;
  return chromaCollectionId;
}

// Utility: very simple embedding using Ollama embeddings endpoint (if model installed)
async function embedText(text) {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Embedding error: ${t}`);
  }
  const data = await res.json();
  return data.embedding;
}

async function storeAnswerEmbedding(sessionId, turnIndex, question, answer) {
  try {
    const collectionId = await ensureChromaCollection();
    const embedding = await embedText(answer);
    const id = `${sessionId}-${turnIndex}`;
    const payload = {
      ids: [id],
      embeddings: [embedding],
      metadatas: [
        {
          session_id: sessionId,
          turn_index: turnIndex,
          question,
        },
      ],
      documents: [answer],
    };
    const res = await fetch(
      `${CHROMA_URL}/api/v1/collections/${collectionId}/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const t = await res.text();
      console.error("Chroma add error:", t);
    }
  } catch (err) {
    console.error("Failed to store embedding:", err.message);
  }
}

// POST /start-interview
// body: { name, track, difficulty }
app.post("/start-interview", async (req, res) => {
  const { name, track, difficulty } = req.body || {};
  if (!name || !track || !difficulty) {
    return res
      .status(400)
      .json({ error: "name, track and difficulty are required" });
  }

  const systemPrompt = `You are a technical interviewer for ${track} roles.
Ask one interview question suitable for a ${difficulty} candidate.
Return only the question text, without numbering or extra commentary.`;

  try {
    const question = await ollamaGenerate(systemPrompt);
    const sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const session = {
      id: sessionId,
      name,
      track,
      difficulty,
      createdAt: new Date().toISOString(),
      turns: [
        {
          question,
          answer: null,
          score: null,
          feedback: null,
        },
      ],
      finished: false,
    };
    sessions.set(sessionId, session);

    if (supabase) {
      try {
        await supabase.from("interviews").insert({
          id: sessionId,
          name,
          track,
          difficulty,
          created_at: session.createdAt,
        });
      } catch (err) {
        console.error("Supabase insert interview failed:", err.message);
      }
    }

    res.json({ sessionId, question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

// POST /evaluate-answer
// body: { sessionId, answer }
app.post("/evaluate-answer", async (req, res) => {
  const { sessionId, answer } = req.body || {};
  if (!sessionId || !answer) {
    return res.status(400).json({ error: "sessionId and answer are required" });
  }

  const session = sessions.get(sessionId);
  if (!session || session.finished) {
    return res.status(404).json({ error: "Session not found or already finished" });
  }

  const currentTurnIndex = session.turns.length - 1;
  const currentTurn = session.turns[currentTurnIndex];

  const evalPrompt = `You are evaluating a candidate's answer in a ${session.track} interview.
Question: ${currentTurn.question}
Answer: ${answer}

Evaluate the answer on a scale of 1 to 10.
First line: "Score: X" where X is the number.
Second line: concise feedback with strengths and weaknesses.`;

  try {
    const evaluation = await ollamaGenerate(evalPrompt);
    const scoreMatch = evaluation.match(/Score:\s*([0-9]+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    const feedback = evaluation.replace(/Score:.*\n?/i, "").trim();

    currentTurn.answer = answer;
    currentTurn.score = score;
    currentTurn.feedback = feedback;

    await storeAnswerEmbedding(
      sessionId,
      currentTurnIndex,
      currentTurn.question,
      answer
    );

    const followupPrompt = `You just evaluated a ${session.track} interview answer with score ${score}.
Ask one follow-up technical question for a ${session.difficulty} candidate.
If you think the interview should end because you have enough signal, respond exactly with "END_INTERVIEW".
Otherwise, respond only with the next question.`;

    const followup = await ollamaGenerate(followupPrompt);

    let finished = false;
    let nextQuestion = null;

    if (followup.trim() === "END_INTERVIEW") {
      finished = true;
      session.finished = true;
    } else {
      nextQuestion = followup.trim();
      session.turns.push({
        question: nextQuestion,
        answer: null,
        score: null,
        feedback: null,
      });
    }

    res.json({
      score,
      feedback,
      finished,
      nextQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
});

// GET /results/:sessionId
app.get("/results/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  const scores = session.turns
    .map((t) => t.score)
    .filter((s) => typeof s === "number");
  const averageScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;
  res.json({
    sessionId: session.id,
    name: session.name,
    track: session.track,
    difficulty: session.difficulty,
    createdAt: session.createdAt,
    finished: session.finished,
    turns: session.turns,
    averageScore,
  });
});

app.listen(PORT, () => {
  console.log(`AI service listening on port ${PORT}`);
});

