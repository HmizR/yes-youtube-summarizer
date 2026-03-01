# 🎬 YES YouTube Summarizer

**YES YouTube Summarizer** is a web application that automatically summarizes YouTube videos using AI and allows users to interact with video content through intelligent conversations.

Instead of watching long videos, users can quickly understand key points and ask questions about the content.

---

## ✨ Features

* 🎬 Summarize any YouTube video
* 🔐 User authentication system
* 🤖 AI-generated concise summaries
* 💬 Discuss with AI (ask questions about video content)
* 🧠 Context-aware conversation memory
* 🌐 Modern responsive web interface
* 🐳 Fully Dockerized deployment

---

## 🏗️ Architecture

```
Frontend (Next.js)
        ↓
Backend API (Express.js)
        ↓
AI Service (Ollama)
```

The system separates presentation, business logic, and AI processing for better scalability and maintainability.

---

## 🧰 Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Sequelize ORM
* MySQL

### AI & Processing

* Ollama (Local LLM)
* YouTube Transcript Extraction

### DevOps

* Docker
* Docker Compose

---

## 📁 Project Structure

```
yes-youtube-summarizer/
│
├── frontend/     # Next.js client application
├── backend/      # Express.js API server
├── docker-compose.dev.yml
└── docker-compose.yml
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-username/yes-youtube-summarizer.git
cd yes-youtube-summarizer
```

### 2. Run with Docker

```bash
docker compose up --build
```

The application will start all required services automatically.

---

## ⚙️ Environment Variables

Create `.env` files inside both `frontend/` and `backend/`.

Example backend configuration:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=youtube_summarizer
OLLAMA_URL=http://ollama:11434
JWT_SECRET=your_secret_key
```

---

## 🧠 How It Works

1. User submits a YouTube URL
2. Backend extracts video transcript
3. Transcript is processed by Ollama
4. AI generates a concise summary
5. Users can continue discussing the video with contextual AI chat

---

## 📸 Future Improvements

* Video history dashboard
* Multiple AI model support
* Summary export (PDF / Markdown)
* Streaming AI responses
* Cloud deployment support

---

## 📄 License

This project is licensed under the MIT License.

---