# 🚀 Deep Research Platform

A multi-step AI research system that decomposes complex queries, retrieves real-time data, and generates structured reports using an asynchronous pipeline.
---

## 🧠 Overview

Deep Research Platform is designed to handle complex questions by breaking them down into smaller research tasks, gathering relevant information from the web, and producing structured, readable outputs.

Instead of generating a single response, the system processes queries in multiple stages using background workers and a queue-based architecture. 

---

## ✨ Features

- 🔍 **Multi-step research pipeline:** Planning, Researching, Writing, and Critiquing.
- 🌐 **Real-time web search integration:** Powered by Tavily API.
- ⚙️ **Asynchronous processing:** BullMQ + Redis for robust background job handling.
- 🧠 **Vector-based memory:** PostgreSQL + pgvector for storing embeddings.
- 🎨 **Modern Interactive UI:** Next.js frontend featuring Glassmorphism, a Gooey search effect, and real-time progress tracking (Stepper).

<img width="1901" height="865" alt="screen" src="https://github.com/user-attachments/assets/85538139-841f-40db-8f1b-38ab5e02f247" />


- 📄 **Export Options:** Generates structured Markdown reports with 1-click MD or PDF export.

---

## 🏗️ Architecture

The system is built around an asynchronous pipeline with separated responsibilities:

- **Planner Agent:** Decomposes the input query into smaller, focused research tasks.
- **Researcher Agent:** Executes tasks by retrieving and summarizing data from external web sources.
- **Writer & Critic Agents:** Aggregates results into a structured, beautifully formatted final report and verifies quality.
- **Queue System (BullMQ + Redis):** Handles background job processing and orchestration.
- **Vector Memory (pgvector):** Stores embeddings for potential reuse and context enrichment.

---

## 🔄 Pipeline Flow

1. User submits a query via the interactive frontend.
2. Planner splits the query into subtopics.
3. Research tasks are queued in Redis.
4. Workers process tasks asynchronously.
5. Results are stored and optionally embedded.
6. Writer generates the final structured output.

---

## 🧱 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons, React-Markdown.
- **Backend:** Node.js, NestJS, TypeScript.
- **Queue:** BullMQ + Redis.
- **Database:** PostgreSQL + pgvector.
- **AI Models:** Groq API (Llama 3 / Gemma) + HuggingFace Inference.
- **Search:** Tavily API.

---

## ▶️ Getting Started

### 1. Clone the repository

    git clone [https://github.com/bazskos/deep-research-platform.git](https://github.com/bazskos/deep-research-platform.git)
    cd deep-research-platform

### 2. Install dependencies

    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install

### 3. Setup environment variables

Create a .env file in your backend directory:

    GROQ_API_KEY=your_groq_api_key
    TAVILY_API_KEY=your_tavily_api_key
    DATABASE_URL=postgresql://user:password@localhost:5432/your_db
    REDIS_URL=redis://localhost:6379

### 4. Run the application

    # Start the backend services
    npm run start:dev

    # Start the frontend (in a new terminal tab)
    cd frontend
    npm run dev

---

## ⚠️ Limitations

- Output quality heavily depends on the underlying LLM's context window and rate limits.
- Not a fully autonomous agent system (flow is strictly orchestrated).
- Research depth depends on external API (Tavily) search results.

---

## 🧪 Possible Improvements (Roadmap)

- **Validation Layer:** Introduce Zod schema validation for strict Agent contracts.
- **State Machine:** Implement explicit job states and robust retry/fallback strategies for LLM API failures.
- **Observability:** Add structured logging for job lifecycles.
- **Caching:** Optimize search performance and reduce LLM token usage.

---

## 📄 License

This project uses the existing license in the repository.

---

## 💡 Motivation

The goal of this project is to explore how AI systems can move beyond single-step chatbot responses and instead operate as structured, multi-stage pipelines with real data retrieval and memory components.

---

## 🙋‍♂️ Author

Built by **bazskos**
