# 🧠 Deep Research Platform

An advanced, AI-powered multi-agent research system built with Next.js and NestJS. This platform autonomously plans, researches, writes, and reviews comprehensive reports based on any user query.

## ✨ Features

* **Multi-Agent Architecture**: Utilizes specialized AI agents (Planner, Researcher, Writer, Critic) to process complex research tasks.
* **Vector Memory (RAG)**: Integrates `pgvector` and HuggingFace embeddings to remember previous research and avoid redundant work.
* **Asynchronous Processing**: Uses `BullMQ` and Redis to handle multiple deep research jobs in the background without blocking the server.
* **Modern UI**: A beautiful, responsive "Glassmorphism" interface built with Next.js App Router and Tailwind CSS v4.
* **PDF & Markdown Export**: Automatically generates and downloads beautifully formatted research reports.

## 🛠️ Tech Stack

**Frontend**
* Framework: Next.js (React 19)
* Styling: Tailwind CSS v4
* Export: jsPDF, Marked

**Backend**
* Framework: NestJS
* Database: PostgreSQL with `pgvector` (via TypeORM)
* Queue: BullMQ (Redis)
* AI Models: Llama-3.3-70b (via Groq SDK)
* Search Engine: Tavily API
* Embeddings: HuggingFace (all-MiniLM-L6-v2)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
* Node.js (v18 or higher)
* PostgreSQL (with pgvector extension enabled)
* Redis
* API Keys for [Groq](https://groq.com/), [Tavily](https://tavily.com/), and [HuggingFace](https://huggingface.co/)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/bazskos/deep-research-platform.git](https://github.com/bazskos/deep-research-platform.git)
   cd deep-research-platform
2. **Setup the Backend**
   ```bash
   cd deep-research-agent
   npm install
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   npm run start:dev
4. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
6. **Open the app**
   Navigate to http://localhost:3001 in your browser.

🏗️ Architecture
Planner Agent: Breaks down the user's query into 3-6 specific, actionable subtopics.
Researcher Agent: Uses the Tavily API to gather information for each subtopic and summarizes the findings.
Writer Agent: Compiles the summarized data into a cohesive, structured markdown report.
Critic Agent: Reviews the final report against the original query to ensure quality and accuracy.

📝 License
This project is open-source and available under the MIT License.
