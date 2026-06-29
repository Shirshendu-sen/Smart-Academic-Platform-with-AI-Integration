<p align="center">
  <h1 align="center">🎓 Smart Academic Platform with AI Integration</h1>
  <p align="center">
    An AI-powered Learning Management System built with a microservices architecture
    <br />
    <a href="#-features"><strong>Features</strong></a> · <a href="#-quick-start"><strong>Quick Start</strong></a> · <a href="#-api-reference"><strong>API Docs</strong></a> · <a href="#-deployment"><strong>Deploy</strong></a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Flask-3.1-000000?logo=flask" alt="Flask" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
</p>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Local Setup](#-local-setup)
- [API Reference](#-api-reference)
- [AI Features](#-ai-features)
- [User Roles & Permissions](#-user-roles--permissions)
- [Database Models](#-database-models)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌟 Project Overview

**Smart Academic Platform** is a full-stack Learning Management System that leverages Google's Gemini AI to enhance the educational experience. The platform enables instructors to create courses and auto-generate quizzes from lecture content, while students can enroll in courses, track progress, take AI-generated quizzes, and interact with an AI-powered tutor chatbot.

Built as a **3-service microservices architecture**, the platform separates concerns across a Next.js frontend, an Express.js backend, and a Python Flask AI service — each independently deployable.

---

## ✨ Features

### For Students
- 📚 **Browse & Enroll** — Discover published courses and enroll with one click
- 📝 **AI-Generated Quizzes** — Take quizzes auto-generated from lecture content with instant scoring
- 💬 **AI Tutor Chatbot** — Ask questions about any lesson and get contextual AI-powered answers
- 📊 **Progress Tracking** — Visual progress bars showing lesson completion percentage
- ✅ **Lesson Completion** — Mark lessons as complete and track your learning journey

### For Instructors
- 🎓 **Course Management** — Create, publish, and manage courses
- 📖 **Lesson Builder** — Add lessons with rich text content to any course
- 🤖 **Quiz Generation** — Generate 10-question MCQ quizzes from lecture notes using AI
- 📈 **Student Analytics** — AI-powered analysis of student performance with risk detection

### Platform-wide
- 🔐 **JWT Authentication** — Secure token-based auth with role-based access control
- 🛡️ **Security** — Helmet, CORS, rate limiting, bcrypt password hashing
- 📱 **Responsive Design** — Tailwind CSS-powered UI that works on all devices
- ⚡ **Serverless Ready** — Lazy database connections for Vercel deployment compatibility

---

## 🏗 Architecture

```mermaid
graph TB
    subgraph Client["🌐 Frontend (Next.js)"]
        UI[React Pages & Components]
        Store[Zustand Auth Store]
        RQ[TanStack React Query]
        Axios[Axios + JWT Interceptor]
    end

    subgraph Backend["⚙️ Backend (Express.js)"]
        API[REST API Routes]
        Auth[JWT Auth Middleware]
        RBAC[Role-Based Access Control]
        Models[Mongoose ODM Models]
    end

    subgraph AI["🤖 AI Service (Flask)"]
        Gemini[Google Gemini 2.5 Flash]
        QuizGen[Quiz Generator]
        Summarizer[Content Summarizer]
        Chatbot[AI Tutor]
        Analyzer[Student Analyzer]
    end

    subgraph DB["🗄️ Database"]
        MongoDB[(MongoDB Atlas)]
    end

    UI --> Axios
    Axios -->|"/api/* rewrite"| API
    API --> Auth --> RBAC --> Models
    API -->|"HTTP proxy"| AI
    Models --> MongoDB
    AI --> Gemini

    style Client fill:#e8f4fd,stroke:#2196F3
    style Backend fill:#fff3e0,stroke:#FF9800
    style AI fill:#f3e5f5,stroke:#9C27B0
    style DB fill:#e8f5e9,stroke:#4CAF50
```

### Request Flow

```
Browser → Next.js (rewrites /api/*) → Express Backend → MongoDB
                                          ↓
                                    Flask AI Service → Gemini API
```

> **Key architectural decisions:**
> - Frontend never calls the AI service directly — all AI requests are proxied through the backend
> - Database connections are lazy-initialized per request for serverless compatibility
> - Auth tokens are stored in `localStorage` and restored on page refresh via `restoreAuth()`

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2 | React framework with App Router |
| React | 19.2 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.0 | Client-side auth state management |
| TanStack Query | 5.x | Server state management & caching |
| Axios | 1.18 | HTTP client with JWT interceptors |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express | 5.2 | HTTP server & routing |
| TypeScript | 6.0 | Type safety |
| Mongoose | 9.7 | MongoDB ODM |
| JWT | 9.0 | Token-based authentication |
| bcryptjs | 3.0 | Password hashing |
| Helmet | 8.2 | Security headers |
| express-rate-limit | 8.5 | API rate limiting |
| Cloudinary | 2.10 | Image storage (configured) |

### AI Service
| Technology | Version | Purpose |
|---|---|---|
| Flask | 3.1 | Python web framework |
| Google Generative AI | 0.8 | Gemini API client |
| Gunicorn | 26.0 | Production WSGI server |
| flask-cors | 6.0 | CORS support |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted document database |

---

## 📁 Folder Structure

```
Smart-Academic-Platform/
├── frontend/                    # Next.js 16 application
│   ├── app/
│   │   ├── layout.tsx           # Root layout with Providers
│   │   ├── page.tsx             # Landing page
│   │   ├── login/page.tsx       # Login form
│   │   ├── register/page.tsx    # Registration with password validation
│   │   ├── dashboard/page.tsx   # Protected user dashboard
│   │   ├── instructor/page.tsx  # Course & lesson management
│   │   ├── courses/
│   │   │   ├── page.tsx         # Course listing grid
│   │   │   └── [id]/page.tsx    # Course detail with lessons & AI
│   │   └── globals.css          # Tailwind imports
│   ├── components/
│   │   ├── AIQuiz.tsx           # Role-aware quiz component
│   │   ├── AIChatbot.tsx        # Floating AI tutor chatbot
│   │   ├── ProgressBar.tsx      # Animated progress bar
│   │   └── Providers.tsx        # TanStack Query provider
│   ├── lib/
│   │   ├── api.ts               # Axios instance with JWT interceptor
│   │   └── store.ts             # Zustand auth store
│   ├── next.config.ts           # API rewrites & Cloudinary config
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # Express.js API server
│   ├── src/
│   │   ├── app.ts               # Express app setup (CORS, middleware, routes)
│   │   ├── index.ts             # Server entry point (port 3001)
│   │   ├── db.ts                # Lazy MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authenticate & authorize middleware
│   │   ├── models/
│   │   │   ├── User.ts          # User model (student/instructor/admin)
│   │   │   ├── Course.ts        # Course model with publish status
│   │   │   ├── Lesson.ts        # Lesson model with ordered content
│   │   │   ├── Enrollment.ts    # Student-Course enrollment
│   │   │   ├── Progress.ts      # Lesson completion tracking
│   │   │   ├── Quiz.ts          # AI-generated quiz storage
│   │   │   ├── QuizAttempt.ts   # Student quiz submissions
│   │   │   └── Certificate.ts   # Course completion certificates
│   │   └── routes/
│   │       ├── auth.ts          # Register, login, profile
│   │       ├── courses.ts       # CRUD, publish, enroll, progress
│   │       ├── lessons.ts       # CRUD, completion, quiz attempts
│   │       └── ai.ts            # AI proxy routes
│   ├── api/index.ts             # Vercel serverless entry point
│   ├── vercel.json              # Vercel deployment config
│   ├── package.json
│   └── tsconfig.json
│
├── ai-service/                  # Python Flask AI microservice
│   ├── app.py                   # Flask app with 4 Gemini endpoints
│   ├── render.yaml              # Render.com deployment config
│   └── requirements.txt         # Python dependencies
│
├── .gitignore
└── CHANGES.md                   # Documented deviations from guide
```

---

## 📦 Installation

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | >= 20.x |
| Python | >= 3.11 |
| npm | >= 10.x |
| MongoDB | Atlas (cloud) or local |
| Git | Any recent version |

### Clone the Repository

```bash
git clone https://github.com/Shirshendu-sen/Smart-Academic-Platform-with-AI-Integration.git
cd Smart-Academic-Platform-with-AI-Integration
```

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai-service
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/smartlms` |
| `JWT_SECRET` | Secret key for JWT signing (64+ chars recommended) | `your-64-char-random-string` |
| `AI_SERVICE_URL` | URL of the Flask AI service | `http://localhost:5001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-cloudinary-secret` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |

### AI Service — `ai-service/.env`

| Variable | Description | Example |
|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key ([Get one here](https://aistudio.google.com/app/apikey)) | `AQ.your-gemini-key` |
| `PORT` | Service port | `5001` |

### Frontend — `frontend/.env.local`

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL (client-side) | `http://localhost:3001` |
| `BACKEND_URL` | Backend URL (server-side rewrites) | `http://localhost:3001` |

> **Important:** Never commit `.env` files. They are already in `.gitignore`.

---

## 🚀 Local Setup

Start all three services in separate terminals:

```bash
# Terminal 1 — AI Service (port 5001)
cd ai-service
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
python app.py

# Terminal 2 — Backend (port 3001)
cd backend
npm run dev

# Terminal 3 — Frontend (port 3000)
cd frontend
npm run dev
```

### Verify Services

```bash
# AI Service
curl http://localhost:5001/health
# → {"status":"ok"}

# Backend
curl http://localhost:3001/api/health
# → {"status":"ok","timestamp":"..."}

# Frontend
# Open http://localhost:3000 in your browser
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Register a new user |
| `POST` | `/api/auth/login` | None | Log in and receive JWT |
| `GET` | `/api/auth/me` | Bearer | Get current user profile |

<details>
<summary><strong>POST /api/auth/register</strong></summary>

```json
// Request
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Test@1234",
  "role": "student"         // "student" | "instructor"
}

// Response 201
{
  "user": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Password requirements:** minimum 8 characters, at least 1 uppercase letter, at least 1 number.
</details>

<details>
<summary><strong>POST /api/auth/login</strong></summary>

```json
// Request
{
  "email": "jane@example.com",
  "password": "Test@1234"
}

// Response 200
{
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "student" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
</details>

### Courses

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/courses` | None | Any | List all published courses |
| `GET` | `/api/courses/:id` | None | Any | Get course with lessons |
| `POST` | `/api/courses` | Bearer | Instructor/Admin | Create a course |
| `PATCH` | `/api/courses/:id/publish` | Bearer | Instructor/Admin | Publish/unpublish a course |
| `POST` | `/api/courses/:id/enroll` | Bearer | Student | Enroll in a course |
| `GET` | `/api/courses/:id/progress` | Bearer | Any | Get enrollment & progress |

<details>
<summary><strong>POST /api/courses</strong></summary>

```json
// Request (requires instructor/admin token)
{
  "title": "Introduction to AI",
  "description": "Learn the fundamentals of artificial intelligence"
}

// Response 201
{
  "_id": "...",
  "title": "Introduction to AI",
  "description": "Learn the fundamentals of artificial intelligence",
  "instructorId": "...",
  "isPublished": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```
</details>

<details>
<summary><strong>GET /api/courses/:id/progress</strong></summary>

```json
// Response 200
{
  "totalLessons": 5,
  "completedLessons": 3,
  "percentage": 60,
  "isEnrolled": true
}
```
</details>

### Lessons

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/lessons` | Bearer | Instructor/Admin | Create a lesson |
| `GET` | `/api/lessons/:id` | Bearer | Any | Get lesson with quiz |
| `POST` | `/api/lessons/:id/complete` | Bearer | Student | Mark lesson complete |
| `POST` | `/api/lessons/:id/quiz-attempt` | Bearer | Student | Submit quiz answers |

### AI Endpoints

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/ai/generate-quiz` | Bearer | Instructor/Admin | Generate quiz from notes |
| `POST` | `/api/ai/summarize` | Bearer | Any | Summarize lecture content |
| `POST` | `/api/ai/chat` | Bearer | Any | Ask AI tutor a question |
| `POST` | `/api/ai/analyze-student` | Bearer | Any | Analyze student performance |

<details>
<summary><strong>POST /api/ai/generate-quiz</strong></summary>

```json
// Request (requires instructor/admin token)
{
  "lessonId": "6a42c3330f0152eaee9c9086",
  "lecture_notes": "Integration testing verifies that different modules work together..."
}

// Response 200
{
  "_id": "...",
  "lessonId": "...",
  "questions": [
    {
      "question": "What is the primary purpose of integration testing?",
      "options": [
        "A) To test individual components in isolation",
        "B) To verify that different modules work together correctly",
        "C) To test the user interface",
        "D) To check code formatting"
      ],
      "correct_answer": "B) To verify that different modules work together correctly",
      "explanation": "Integration testing focuses on verifying the interactions between modules."
    }
  ]
}
```
</details>

<details>
<summary><strong>POST /api/ai/chat</strong></summary>

```json
// Request
{
  "question": "What is integration testing?",
  "lessonId": "6a42c3330f0152eaee9c9086",
  "history": [
    { "role": "user", "content": "previous question" },
    { "role": "assistant", "content": "previous answer" }
  ]
}

// Response 200
{
  "answer": "Integration testing is a type of software testing where..."
}
```
</details>

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend health |
| `GET` | `http://localhost:5001/health` | AI service health |

---

## 🤖 AI Features

All AI features are powered by **Google Gemini 2.5 Flash** through the Flask microservice.

| Feature | Endpoint | Input | Output |
|---|---|---|---|
| **Quiz Generation** | `/generate-quiz` | Lecture notes text | 10 MCQs with options, answers, and explanations |
| **Content Summarization** | `/summarize` | Lecture content | Overview, key points, important terms |
| **AI Tutor Chat** | `/chat` | Question + lesson context + history | Contextual educational answer |
| **Student Analysis** | `/analyze-student` | Student performance data | Assessment, strengths, areas to improve, risk flag |

### AI Architecture Pattern

```
Frontend Component → Backend Proxy Route → Flask AI Service → Gemini API
                         ↓
                   Saves to MongoDB
                   (quizzes collection)
```

> The backend enriches AI requests with data from MongoDB (e.g., lesson content for chat, student metrics for analysis) before forwarding to the AI service. Quiz results are persisted in MongoDB for student access.

---

## 👥 User Roles & Permissions

| Permission | Student | Instructor | Admin |
|---|:---:|:---:|:---:|
| Browse courses | ✅ | ✅ | ✅ |
| Enroll in courses | ✅ | ❌ | ❌ |
| Mark lessons complete | ✅ | ❌ | ❌ |
| Take quizzes | ✅ | ❌ | ❌ |
| Use AI chatbot | ✅ | ✅ | ✅ |
| Summarize content | ✅ | ✅ | ✅ |
| Create courses | ❌ | ✅ | ✅ |
| Create lessons | ❌ | ✅ | ✅ |
| Publish courses | ❌ | ✅ | ✅ |
| Generate AI quizzes | ❌ | ✅ | ✅ |

---

## 🗄 Database Models

The application uses **8 Mongoose models** with MongoDB:

```mermaid
erDiagram
    User ||--o{ Course : "teaches (instructorId)"
    User ||--o{ Enrollment : "enrolls (studentId)"
    User ||--o{ Progress : "tracks (studentId)"
    User ||--o{ QuizAttempt : "attempts (studentId)"
    User ||--o{ Certificate : "earns (studentId)"
    Course ||--o{ Lesson : "contains (courseId)"
    Course ||--o{ Enrollment : "has (courseId)"
    Course ||--o{ Certificate : "awards (courseId)"
    Lesson ||--o| Quiz : "has (lessonId)"
    Lesson ||--o{ Progress : "tracked by (lessonId)"
    Quiz ||--o{ QuizAttempt : "attempted (quizId)"

    User {
        string name
        string email
        string password
        enum role "student|instructor|admin"
        string avatarUrl
    }
    Course {
        string title
        string description
        ObjectId instructorId
        string thumbnailUrl
        boolean isPublished
    }
    Lesson {
        ObjectId courseId
        string title
        string content
        string videoUrl
        number orderIndex
    }
    Enrollment {
        ObjectId studentId
        ObjectId courseId
        date enrolledAt
    }
    Progress {
        ObjectId studentId
        ObjectId lessonId
        boolean completed
        date completedAt
    }
    Quiz {
        ObjectId lessonId
        array questions
    }
    QuizAttempt {
        ObjectId quizId
        ObjectId studentId
        number score
        number totalQ
        mixed answers
        date attemptedAt
    }
    Certificate {
        ObjectId studentId
        ObjectId courseId
        string certUrl
        date issuedAt
    }
```

---

## 🧪 Testing

### TypeScript Type Check

```bash
# Backend
cd backend && npx tsc --noEmit

# Frontend
cd frontend && npx tsc --noEmit
```

### Build Verification

```bash
# Frontend production build
cd frontend && npm run build
```

### API Integration Tests

With all services running, test the complete flow:

```bash
# 1. Register a student
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","email":"test@example.com","password":"Test@1234","role":"student"}'

# 2. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'

# 3. List courses (no auth required)
curl http://localhost:3001/api/courses

# 4. Create a course (instructor token required)
curl -X POST http://localhost:3001/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN" \
  -d '{"title":"Test Course","description":"A test course"}'
```

### Full Integration Checklist

- [ ] All three services start without errors
- [ ] Registration with strong password succeeds
- [ ] Registration with weak password is rejected
- [ ] Login returns JWT token
- [ ] Instructor can create and publish courses
- [ ] Student can enroll and track progress
- [ ] AI quiz generation produces valid questions
- [ ] AI chatbot responds with lesson-relevant answers
- [ ] Student progress updates on lesson completion
- [ ] Page refresh preserves login state
- [ ] No CORS errors in browser console

---

## 🌍 Deployment

### Deployment Architecture

| Service | Platform | Reason |
|---|---|---|
| **AI Service** | Render.com | Flask needs long-running processes (Gemini API calls > 10s) |
| **Backend** | Vercel | Serverless Node.js with lazy DB connections |
| **Frontend** | Vercel | Native Next.js support |

### Deploy AI Service to Render

1. Create a **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory**: `ai-service`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `gunicorn app:app`
6. Add environment variable: `GEMINI_API_KEY`

### Deploy Backend to Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory**: `backend`
4. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `AI_SERVICE_URL` (Render URL), `FRONTEND_URL`, `CLOUDINARY_*`, `NODE_ENV=production`

### Deploy Frontend to Vercel

1. Create another project on Vercel
2. Set **Root Directory**: `frontend`
3. Add environment variables: `NEXT_PUBLIC_BACKEND_URL` and `BACKEND_URL` (backend Vercel URL)

### Post-Deployment

1. Update `FRONTEND_URL` on the backend Vercel project to the actual frontend URL
2. Redeploy the backend
3. Verify no CORS errors on the live site

---

## 📸 Screenshots

> Screenshots can be added by placing images in a `docs/screenshots/` directory.

| Page | Description |
|---|---|
| ![Landing Page](docs/screenshots/landing.png) | Landing page with feature cards |
| ![Dashboard](docs/screenshots/dashboard.png) | User dashboard with role-based navigation |
| ![Course Detail](docs/screenshots/course-detail.png) | Course page with lessons, quiz, and chatbot |
| ![AI Quiz](docs/screenshots/quiz.png) | AI-generated quiz with scoring |
| ![AI Chatbot](docs/screenshots/chatbot.png) | Floating AI tutor chatbot |
| ![Instructor Panel](docs/screenshots/instructor.png) | Course and lesson creation |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Code Style

- TypeScript strict mode for frontend and backend
- ESLint with Next.js config for frontend
- Use meaningful variable names and keep functions focused
- Follow the existing project structure when adding new features

---

## 📄 License

This project is licensed under the **ISC License**. See the backend `package.json` for details.

---

## 👤 Author

**Shirshendu Sen**

- GitHub: [@Shirshendu-sen](https://github.com/Shirshendu-sen)
- Repository: [Smart-Academic-Platform-with-AI-Integration](https://github.com/Shirshendu-sen/Smart-Academic-Platform-with-AI-Integration)

---

<p align="center">
  Built with ❤️ using Next.js, Express, Flask, and Google Gemini AI
</p>
