## SMART Mock Interviewer – Voice‑Driven AI Interview Platform

This project is a **voice‑based AI mock interview platform** that simulates a real technical interview.  
You can start an interview, hear AI‑generated questions out loud, answer by speaking, and get scored feedback and a detailed report.

The stack is designed to be **mostly free and local‑first**:

- **Frontend**: React + Vite (runs on Vercel or locally)
- **Backend**: Node.js + Express (AI service)
- **LLM host**: Ollama (Llama3) running locally
- **Vector DB**: Chroma (Docker)

---

## Core features

- **Interview setup**
  - Choose your **track**: frontend, backend, MERN, system design, etc.
  - Choose **difficulty**: junior, mid, senior.

- **Live voice interview**
  - AI generates questions dynamically with **Llama3** via Ollama.
  - Questions are spoken aloud via **browser text‑to‑speech**.
  - You answer by speaking; browser **speech recognition** converts your voice to text.
  - The backend evaluates your answer, gives a **score (1–10)** and **text feedback**.
  - AI decides whether to **ask a follow‑up question** or **end the interview**.

- **Results and analytics**
  - Per‑question breakdown: question, your answer, AI score, AI feedback.
  - Average score for the session.
  - Simple list of strengths and areas to improve.

- **Vector storage of answers**
  - Each answer is embedded with a local embedding model via Ollama and stored in **ChromaDB**.
  - Prepares the system for more advanced analytics (similar answers, learning paths, etc.).

---

## High‑level architecture

- **Frontend (Vite React app)**
  - Pages:
    - `InterviewSetupPage` – configure and start an interview.
    - `InterviewLivePage` – hear questions, answer by voice or typing.
    - `InterviewResultPage` – see scores, feedback and breakdown.
  - Uses `VITE_AI_SERVICE_URL` to talk to the backend AI service.
  - Uses **Web Speech APIs**:
    - `SpeechSynthesis` to read questions aloud.
    - `SpeechRecognition` / `webkitSpeechRecognition` to transcribe spoken answers.

- **AI service (Node.js + Express)**
  - Endpoints:
    - `POST /start-interview` – creates a session and returns the first question.
    - `POST /evaluate-answer` – evaluates the answer, stores embeddings, returns score/feedback and next question or end signal.
    - `GET /results/:sessionId` – returns the full interview summary.
  - Uses an **in‑memory session store** (a `Map`) to keep track of sessions.
  - Can optionally write basic metadata into **Supabase** if configured.

- **Ollama**
  - Runs locally on your machine.
  - Models used:
    - `llama3` – for generating questions and evaluating answers.
    - `nomic-embed-text` – for generating embeddings of answers.
  - HTTP APIs used:
    - `/api/generate` – question generation, scoring and feedback.
    - `/api/embeddings` – answer embeddings.

- **ChromaDB**
  - Runs as a Docker container.
  - Stores embeddings for each answer in a collection called `interview_answers`.
  - Each record includes metadata like `session_id`, `turn_index`, and the original question.

---

## Repository structure

```text
SMART INTERVIE/
  ai-service/             # Node.js backend AI service
    Dockerfile
    package.json
    .env.example
    src/
      server.js           # Express server + endpoints + Ollama + Chroma integration

  frontend/               # React + Vite frontend
    package.json
    vite.config.ts
    .env.example
    index.html
    tsconfig.json
    src/
      main.tsx            # React entry point
      App.tsx             # Routes + layout
      styles.css          # Modern SaaS-style UI
      pages/
        InterviewSetupPage.tsx
        InterviewLivePage.tsx
        InterviewResultPage.tsx

  docker-compose.yml      # Chroma + AI service
```

---

## How the interview flow works (end‑to‑end)

1. **User opens the app**
   - Frontend runs on `http://localhost:5173` (or a Vercel URL).

2. **Start interview**
   - On the **Interview Setup** page, the user enters name, picks track and difficulty.
   - Frontend sends `POST /start-interview` to the AI service:
     - The backend builds a prompt for Llama3 via Ollama, asking for a single interview question for the given track and difficulty.
     - Llama3 returns a question.
     - The backend creates a session object and returns `{ sessionId, question }`.
   - Frontend navigates to `/interview/live/:sessionId` with the first question.

3. **Play question as audio**
   - On the **Live Interview** page, a `useEffect` runs when the `question` state changes:
     - Builds a `SpeechSynthesisUtterance(question)`.
     - Calls `window.speechSynthesis.speak(utterance)`.
   - The user hears the question spoken aloud.

4. **Capture answer via microphone**
   - When the user clicks **“Speak answer”**, the page:
     - Creates a `SpeechRecognition` / `webkitSpeechRecognition` instance (if supported by the browser).
     - Starts listening to the microphone.
     - As partial results arrive, it concatenates all transcripts into a single string and updates the `answer` textarea in real time.
   - When the user clicks **“Stop recording”** or recognition ends, the transcription is frozen in the textarea for review.
   - If speech recognition is not available, the user can still type the answer manually.

5. **Evaluate answer**
   - Clicking **“Submit answer”** sends `POST /evaluate-answer` with `{ sessionId, answer }`.
   - The backend:
     - Retrieves the current question from the in‑memory session.
     - Builds an evaluation prompt for Llama3 that includes:
       - the interview track and difficulty,
       - the original question,
       - the user’s answer.
     - Asks Llama3 to:
       - output a line `Score: X` (1–10),
       - followed by short feedback on strengths and weaknesses.
     - Parses the score and feedback.
     - Updates the current turn in the session with `answer`, `score`, `feedback`.

6. **Store embeddings in ChromaDB**
   - After evaluating, the backend:
     - Calls Ollama’s `/api/embeddings` endpoint with the answer text and the `nomic-embed-text` model.
     - Sends the resulting vector to ChromaDB with metadata:
       - `session_id`, `turn_index`, and `question`.
   - This makes each answer searchable and forms the basis for advanced analytics.

7. **Generate follow‑up or end**
   - The backend builds a follow‑up prompt for Llama3:
     - It includes the track, difficulty, and the just‑computed score.
     - It asks Llama3 to either:
       - return a follow‑up question, or
       - respond exactly with `END_INTERVIEW`.
   - If the model responds with `END_INTERVIEW`:
     - The session is marked as finished.
     - The frontend is told that the interview is over.
   - If it returns a follow‑up question:
     - The backend appends a new turn (with that question and empty answer/score).
     - The frontend sets this as the new `question`, which is then spoken aloud again.

8. **Show results**
   - At any point, or once finished, the frontend can navigate to `/interview/results/:sessionId`.
   - The page calls `GET /results/:sessionId`:
     - The backend aggregates all turns and computes an `averageScore`.
     - Returns the full session: questions, answers, scores and feedback.
   - The frontend displays:
     - Average score.
     - Number of questions answered.
     - List of strengths and areas to improve based on which questions had high/low scores.
     - Answer‑by‑answer breakdown.

---

## Running the project locally (for demos and interviews)

### 1. Prerequisites

- Node.js 18+ installed on your machine.
- Docker and Docker Compose installed.
- Ollama installed and running locally.

### 2. Start Ollama and pull models

```bash
ollama pull llama3
ollama pull nomic-embed-text
ollama serve
```

This runs the LLM server on `http://localhost:11434`.

### 3. Configure backend environment

Create `ai-service/.env`:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
CHROMA_URL=http://chroma:8000
OLLAMA_URL=http://host.docker.internal:11434
PORT=4000
```

Supabase values are optional for this basic flow; leave them empty or set them if you connect a real database.

### 4. Start Chroma and AI service (Docker)

From the project root:

```bash
docker compose up --build
```

This will:

- start **ChromaDB** at `http://localhost:8000`
- start the **AI service** at `http://localhost:4000`

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 6. Run a demo interview

1. Go to **“Start New Interview”**.
2. Enter your name, pick track and difficulty, and click **Start Interview**.
3. On the **Live Interview** page:
   - Allow microphone access when prompted.
   - Listen to the spoken question.
   - Click **“Speak answer”**, talk, then stop recording.
   - Review the transcript and click **“Submit answer”**.
4. See your **score and feedback**, then repeat for follow‑up questions.
5. Go to the **Results** page to see the full summary.

---

## Deployment notes (for your resume)

- The frontend can be deployed to **Vercel free tier** directly from this repository.
- The backend AI service, Chroma and Ollama are designed to run **locally**:
  - This keeps everything free, avoids GPU/API bills, and is perfect for interviews and portfolio demos.
  - For a cloud‑hosted version, you can deploy the AI service and Chroma to a free platform (Render/Railway) and replace Ollama with a hosted LLM.

When describing this project on your resume, you can highlight:

- Voice‑driven AI interview experience (TTS + STT).
- Dynamic question generation and adaptive follow‑ups using Llama3.
- Scoring and feedback, with answer embeddings stored in Chroma.
- Clean separation between frontend, AI orchestration service, and model/vector infrastructure.

