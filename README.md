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
External AI Service (Ollama)
```

The AI processing layer is handled by **Ollama**, which runs as an external service.
The backend communicates with Ollama through its HTTP API.

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

### 📦 Clone Repository

```bash
git clone https://github.com/your-username/yes-youtube-summarizer.git
cd yes-youtube-summarizer
```

---

## ⚙️ Environment Setup

Both **frontend** and **backend** require environment variables.

Each folder already provides a template:

```
frontend/.env.example
backend/.env.example
```

Create your environment files by copying them:

### Backend

```bash
cp backend/.env.example backend/.env
```

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Then edit the `.env` files according to your local configuration.

---

## 🤖 Ollama Setup (Required)

This project uses **Ollama** as an external AI service.

You must install and run Ollama locally before starting the application.

### 1. Install Ollama

Download from:
https://ollama.com

Verify installation:

```bash
ollama --version
```

---

### 2. Pull Required Model

Example:

```bash
ollama pull llama3
```

(Adjust the model name according to your `.env` configuration.)

---

### 3. Start Ollama Service

```bash
ollama serve
```

By default, Ollama runs at:

```
http://localhost:11434
```

Make sure your backend `.env` matches this URL:

```
OLLAMA_URL=http://localhost:11434
```

---

## 🧪 Development Mode

Development mode enables hot reload and is intended for local development.

Run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

This will start:

* Next.js frontend (development server)
* Express.js backend API
* Database service

After startup:

* Frontend → http://localhost:3000
* Backend API → http://localhost:5000

---

## 🚀 Production Mode

Production mode runs optimized containers similar to real deployment.

Run:

```bash
docker compose up --build -d
```

This uses:

```
docker-compose.yml
```

Production containers run in detached mode for better performance.

---

## 🛑 Stop Services

```bash
docker compose down
```

For development setup:

```bash
docker compose -f docker-compose.dev.yml down
```

---

## 🐳 Docker Overview

| Mode        | File Used              | Purpose                        |
| ----------- | ---------------------- | ------------------------------ |
| Development | docker-compose.dev.yml | Local development & hot reload |
| Production  | docker-compose.yml     | Optimized deployment           |

---

## ✅ Requirements

Make sure you have installed:

* Docker
* Docker Compose
* Git

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

## 👨‍💻 Author

Developed by **Hamizan Rifqi Afandi**