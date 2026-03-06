<hr>
</div>

<div align="center">
<a href="https://github.com/HmizR/yes-youtube-summarizer" target="blank">
<img src="./frontend/public/images/logo/logo-kubela2-icon.svg" width="90" alt="Logo" />
</a>

<h2> YES - YouTube Summarizer </h2>

![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)

</div>

## 🎬 Overview

**YES - YouTube Summarizer** is a web application that automatically summarizes YouTube videos using AI and allows users to interact with video content through intelligent conversations.

Instead of watching long videos, users can quickly understand key points and ask questions about the content.

## ✨ Features

* 🎬 Summarize any YouTube video
* 🔐 User authentication system
* 🤖 AI-generated concise summaries
* 💬 Discuss with AI (ask questions about video content)
* 🧠 Context-aware conversation memory
* 🌐 Modern responsive web interface
* 🐳 Fully Dockerized deployment


## 🏗️ Architecture

```id="ax19fd"
Frontend (Next.js)
        ↓
Backend API (Express.js)
        ↓
External Services
   ├── Ollama (AI Processing)
   └── MySQL Database
```

Both **Ollama** and **MySQL** currently run as external services.

The backend connects to them via environment configuration.


> ⚠️ **Note**: Currently, the database service is external and must be started manually.
Future versions may include MySQL as part of Docker Compose for fully automated setup.

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

## 📁 Project Structure

```
yes-youtube-summarizer/
│
├── frontend/     # Next.js client application
├── backend/      # Express.js API server
├── docker-compose.dev.yml
└── docker-compose.yml
```

## 🚀 Getting Started

To get a local copy of this project up and running, follow these steps.

### 📦 Prerequisites

- **Docker** (v20.x or higher) and **Docker Compose**.
- **Ollama** Required as the external AI service.
- **MySQL** (or another compatible SQL database).
- **Node.js** and **npm** (optional)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HmizR/yes-youtube-summarizer.git
   cd yes-youtube-summarizer
   ```

2. **Environment Setup**
   
   Each folder already provides a template:
   
   ```
   frontend/.env.example
   backend/.env.example
   ```

   Create your environment files by copying them:
   
   - **Backend**
   
     ```bash
     cp backend/.env.example backend/.env
     ```
   
   - **Frontend**
   
     ```bash
     cp frontend/.env.example frontend/.env.local
     ```

   Then edit the `.env` and `.env.local` files according to your local configuration.


3. **Ollama Setup (Required)**

   This project uses **Ollama** as an external AI service.
     
   You must install and run Ollama locally before starting the application.

   1. **Install Ollama**

      Download from 
      [here](https://ollama.com).
      
      Verify installation:
      
      ```bash
      ollama --version
      ```
      
      ---

   2. **Pull Required Model**

      Example:
      
      ```bash
      ollama pull llama3
      ```
      
      (Adjust the model name according to your `.env` configuration.)
    
   3. **Start Ollama Service**

      ```bash
      ollama serve
      ```
      
      By default, Ollama runs at:
      
      ```
      http://localhost:11434
      ```
      
      Make sure your backend `.env` matches this URL:
      
      ```
      OLLAMA_HOST=http://localhost:11434
      ```

4. **Database Setup (MySQL)**

   The MySQL database is **not yet managed by Docker Compose**.
   
   You must provide your own running MySQL instance.
   
   This may be containerized in future releases.

   1. **Install MySQL**

      Install MySQL locally or run it using Docker manually.
      
      Example (Docker):
      
      ```bash
      docker run -d \
        --name youtube-mysql \
        -e MYSQL_ROOT_PASSWORD=password \
        -e MYSQL_DATABASE=youtube_summarizer \
        -p 3306:3306 \
        mysql:8
      ```

   2. **Configure Backend Environment**

      Update:
      
      ```
      backend/.env
      ```
      
      Example:
      
      ```env
      DB_HOST=localhost
      DB_PORT=3306
      DB_USER=root
      DB_PASSWORD=password
      DB_NAME=youtube_summarizer
      ```

5. **Start the development server**

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

## 📖 Usage

### 🔨 Build the Services

- **Development mode**

  ```bash
  docker compose -f docker-compose.dev.yml build
  ```

- **Production mode**

  ```bash
  docker compose build
  ```


### ▶️ Running the Services

- **Development mode** 

  ```bash
  docker compose -f docker-compose.dev.yml up
  ```

- **Production mode**

  ```bash
  docker compose up -d
  ```

> Now you can view the app at [http://localhost:3000](http://localhost:3000) on your browser.


### 🛑 Stopping the Services


- **Development mode**

  ```bash
  docker compose -f docker-compose.dev.yml down
  ```

- **Production mode**

  ```bash
  docker compose down
  ```

### 📃 API Documentation

The API documentation can be accessed at [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs).

## 👨‍💻 Author

Developed by **Hamizan Rifqi Afandi**.