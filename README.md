<div align="center">

# 🎓 Smart Academic Platform - AI-Powered LMS

### AI-Powered Smart Academic Platform

**Where Intelligence Meets Education — A full-stack, AI-driven Learning Management System built with modern microservice architecture**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://flask.palletsprojects.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com/)

</div>

<br/>

---

<br/>

## 🎯 Overview

**Smart Academic Platform** is a production-grade, AI-integrated Learning Management System that reimagines how students learn and how instructors teach. Built with a **microservice architecture** spanning three independent services, it combines the power of **Google Gemini AI** with a modern full-stack web application to deliver intelligent, personalized education at scale.

> 💡 This isn't just another LMS — it's an **AI-first academic platform** where quizzes generate themselves, lectures get summarized instantly, a context-aware chatbot resolves doubts in real-time, and students receive personalized performance insights.

<br/>

---

<br/>

## ✨ Feature Highlights

### 🎓 Core LMS Platform

| Feature | Description |
|:--------|:------------|
| 🔐 **Authentication & RBAC** | JWT-based auth with three distinct roles — Student, Instructor, Admin — each with granular permission controls |
| 📚 **Course Management** | Full CRUD for courses with publish/draft workflow, search, and pagination |
| 📖 **Lesson System** | Structured lessons with rich content, video embeds, and ordered sequencing |
| 📝 **Enrollment Engine** | One-click enrollment with duplicate prevention and enrollment tracking |
| 📊 **Progress Tracking** | Per-lesson completion tracking with real-time percentage calculations |
| 🏆 **Certificates** | Auto-issued certificates upon course completion |
| 🖼️ **Cloudinary Media** | Cloud-based image and video management for thumbnails and avatars |

<br/>

### 🤖 AI-Powered Features

| Feature | Endpoint | What It Does |
|:--------|:---------|:-------------|
| ✨ **AI Quiz Generator** | `/api/ai/generate-quiz` | Generates 10 MCQs with explanations from lesson content — cached after first generation |
| 📋 **AI Lecture Summarizer** | `/api/ai/summarize` | Produces overview, key points, and glossary terms from any lecture |
| 💬 **AI Doubt Chatbot** | `/api/ai/chat` | Context-aware, multi-turn tutor that only answers from course material — zero hallucination |
| 📈 **AI Progress Analyzer** | `/api/ai/analyze-student` | Analyzes real student data to deliver performance level, personalized message, and actionable recommendations |

<br/>

---

<br/>

## 🏗️ Architecture Overview

Smart Academic Platform follows a **decoupled microservice architecture** with three independently deployable services communicating via REST APIs:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                   Next.js + React 19 + Tailwind                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS / API Calls
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND SERVICE                             │
│              Next.js 16 · React 19 · TypeScript                 │
│         React Query · Zustand · Zod · Recharts                  │
│              Deployed on → Vercel (Edge)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │  REST API (Axios)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICE                             │
│            Express.js 5 · TypeScript · Prisma ORM               │
│       JWT Auth · RBAC · Helmet · Rate Limiting · CORS           │
│              Deployed on → Render                                │
└──────┬───────────────────────────────────────┬──────────────────┘
       │                                       │
       │  Prisma Client                        │  HTTP (Axios)
       ▼                                       ▼
┌──────────────────────┐            ┌─────────────────────────────┐
│   NeonDB (PostgreSQL)│            │      AI SERVICE              │
│                      │            │  Python Flask · Gemini 1.5   │
│  • users             │            │  • Quiz Generation           │
│  • courses           │            │  • Lecture Summarizer        │
│  • lessons           │            │  • Doubt Chatbot             │
│  • enrollments       │            │  • Progress Analyzer         │
│  • progress          │            │  Deployed on → Render        │
│  • quizzes           │            └─────────────────────────────┘
│  • quiz_attempts     │
│  • certificates      │
└──────────────────────┘
```

<br/>

---

<br/>

## 🔄 System Workflow

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  Student     │───▶│  Frontend    │───▶│  Backend     │───▶│  AI Service │
│  Registers   │    │  Validates   │    │  Hashes PWD  │    │             │
│  / Logs In   │    │  with Zod    │    │  Issues JWT  │    │             │
└─────────────┘    └──────────────┘    └──────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  Instructor │───▶│  Frontend    │───▶│  Backend     │───▶│  NeonDB     │
│  Creates    │    │  Form Submit │    │  RBAC Check  │    │  Persist    │
│  Course     │    │  via RHF     │    │  Prisma Save │    │  Course     │
└─────────────┘    └──────────────┘    └──────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  Student    │───▶│  Frontend    │───▶│  Backend     │───▶│  AI Service │
│  Opens      │    │  AIQuiz      │    │  Auth Check  │    │  Gemini AI  │
│  Lesson     │    │  Component   │    │  Proxy Req   │    │  Generate   │
│             │    │              │    │  Cache Quiz  │◀───│  10 MCQs    │
└─────────────┘    └──────────────┘    └──────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  Student    │───▶│  Frontend    │───▶│  Backend     │───▶│  AI Service │
│  Asks       │    │  Chat UI     │    │  Auth +      │    │  Gemini AI  │
│  Doubt      │    │  Multi-turn  │    │  Context     │    │  Context-   │
│             │    │  History     │    │  Forward     │    │  Aware Reply│
└─────────────┘    └──────────────┘    └──────────────┘    └─────────────┘
```

<br/>

---

<br/>

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|:-----------|:--------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router & SSR |
| [React 19](https://react.dev/) | Component-based UI with latest features |
| [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [React Query](https://tanstack.com/query) | Server state management & caching |
| [Zustand](https://zustand.docs.pmnd.rs/) | Lightweight client state management |
| [React Hook Form](https://react-hook-form.com/) | Performant form handling |
| [Zod](https://zod.dev/) | Schema validation |
| [Recharts](https://recharts.org/) | Data visualization & charts |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |

### Backend

| Technology | Purpose |
|:-----------|:--------|
| [Express.js 5](https://expressjs.com/) | REST API framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe server code |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database access |
| [PostgreSQL (NeonDB)](https://neon.tech/) | Serverless relational database |
| [JWT](https://jwt.io/) | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing (cost factor 12) |
| [Helmet](https://helmetjs.github.io/) | Security HTTP headers |
| [express-rate-limit](https://github.com/nfriedly/express-rate-limit) | Brute-force protection |
| [Cloudinary](https://cloudinary.com/) | Media storage & transformation |
| [Multer](https://github.com/expressjs/multer) | File upload handling |

### AI Service

| Technology | Purpose |
|:-----------|:--------|
| [Python Flask](https://flask.palletsprojects.com/) | Lightweight AI microservice |
| [Google Gemini 1.5 Flash](https://ai.google.dev/) | Large Language Model for AI features |
| [Flask-CORS](https://flask-cors.readthedocs.io/) | Cross-origin request handling |
| [Gunicorn](https://gunicorn.org/) | Production WSGI server |

<br/>

---

<br/>

## 📁 Folder Structure

```
Smart-Academic-Platform-with-AI-Integration/
├── 📂 frontend/                    # Next.js 16 Frontend
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── globals.css             # Global styles
│   │   └── dashboard/
│   │       └── page.tsx            # Student dashboard with React Query
│   ├── components/
│   │   └── AIQuiz.tsx              # AI quiz generation & submission UI
│   ├── lib/
│   │   └── api.ts                  # Axios instance with JWT interceptors
│   └── public/                     # Static assets
│
├── 📂 backend/                     # Express.js 5 Backend
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (7 models)
│   │   └── migrations/             # Prisma migration history
│   ├── src/
│   │   ├── app.ts                  # Express app — Helmet, CORS, rate limit, routes
│   │   ├── index.ts                # Server entry point
│   │   ├── lib/
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   ├── middleware/
│   │   │   └── auth.ts             # JWT authenticate + RBAC authorize
│   │   └── routes/
│   │       ├── auth.ts             # Register, Login, Me
│   │       ├── courses.ts          # CRUD, enroll, progress, publish
│   │       ├── lessons.ts          # Create, complete
│   │       └── ai.ts               # AI proxy — quiz, summarize, chat, analyze
│   └── api/
│       └── index.ts                # Vercel serverless entry
│
└── 📂 ai-service/                  # Python Flask AI Microservice
    ├── app.py                      # 4 AI endpoints + Gemini integration
    ├── requirements.txt            # Python dependencies
    └── vercel.json                 # Vercel deployment config
```

<br/>

---

<br/>

## 🔌 API & System Highlights

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/auth/register` | — | Register with name, email, password, role |
| `POST` | `/api/auth/login` | — | Login with timing-attack protection |
| `GET` | `/api/auth/me` | 🔒 | Get current user profile |

### Course Endpoints

| Method | Endpoint | Auth | Role | Description |
|:-------|:---------|:-----|:-----|:------------|
| `GET` | `/api/courses` | — | Public | List published courses (search + pagination) |
| `GET` | `/api/courses/my/enrolled` | 🔒 | Student | Get enrolled courses |
| `GET` | `/api/courses/:id` | — | Public | Single course with lessons |
| `POST` | `/api/courses` | 🔒 | Instructor/Admin | Create a course |
| `PATCH` | `/api/courses/:id/publish` | 🔒 | Instructor/Admin | Toggle publish status |
| `POST` | `/api/courses/:id/enroll` | 🔒 | Student | Enroll in a course |
| `GET` | `/api/courses/:id/progress` | 🔒 | Any | Get course progress percentage |

### Lesson Endpoints

| Method | Endpoint | Auth | Role | Description |
|:-------|:---------|:-----|:-----|:------------|
| `POST` | `/api/lessons` | 🔒 | Instructor/Admin | Create a lesson |
| `PATCH` | `/api/lessons/:id/complete` | 🔒 | Student | Mark lesson as completed |

### AI Endpoints

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/ai/generate-quiz` | 🔒 | Generate & cache AI quiz for a lesson |
| `POST` | `/api/ai/submit-quiz` | 🔒 | Submit quiz answers, get score |
| `POST` | `/api/ai/summarize` | 🔒 | AI-powered lecture summarization |
| `POST` | `/api/ai/chat` | 🔒 | Context-aware doubt chatbot |
| `POST` | `/api/ai/analyze-student` | 🔒 | AI performance analysis & recommendations |

<br/>

---

<br/>

## 🗄️ Database & AI Integration

### Database Schema (Prisma + PostgreSQL)

```
User ──────────────────────────────────────────────────────
  ├── coursesCreated  → Course[]     (InstructorCourses)
  ├── enrollments     → Enrollment[]
  ├── progress        → Progress[]
  ├── quizAttempts    → QuizAttempt[]
  └── certificates    → Certificate[]

Course ────────────────────────────────────────────────────
  ├── instructor      → User          (InstructorCourses)
  ├── lessons         → Lesson[]
  ├── enrollments     → Enrollment[]
  └── certificates    → Certificate[]

Lesson ────────────────────────────────────────────────────
  ├── course          → Course
  ├── quiz            → Quiz?         (one per lesson)
  └── progress        → Progress[]

Quiz ──────────────────────────────────────────────────────
  ├── lesson          → Lesson
  ├── questions       → Json          (AI-generated MCQs)
  └── attempts        → QuizAttempt[]

Enrollment · Progress · QuizAttempt · Certificate
```

### AI Integration Flow

```
User Action          Backend Processing              AI Service (Gemini 1.5 Flash)
─────────            ──────────────────              ─────────────────────────────
"Generate Quiz"  →   Auth check → Check cache   →   Prompt with lesson content
                     → If cached, return          →   Returns 10 MCQs + explanations
                     → If new, call AI            →   JSON parsed & validated
                     → Save to DB (cache)         →   Clean markdown wrappers

"Summarize"      →   Auth check → Validate      →   Prompt with lecture text
                     → Forward to AI              →   Returns overview + key points
                                                  →   + glossary terms

"Ask Doubt"      →   Auth check → Attach        →   Multi-turn chat session
                     context + history            →   Context-grounded response
                     → Forward to AI              →   Zero hallucination design

"Analyze Me"     →   Auth check → Query DB      →   Prompt with real student data
                     → Compute stats              →   Returns performance level
                     → Forward to AI              →   + personalized recommendations
```

<br/>

---

<br/>

## 🔒 Security & Scalability

### Security Measures

| Layer | Implementation |
|:------|:---------------|
| **Authentication** | JWT with 7-day expiry, Bearer token pattern |
| **Password Security** | bcrypt hashing with cost factor 12 |
| **Timing Attack Prevention** | Constant-time password comparison on login |
| **HTTP Headers** | Helmet middleware for secure headers |
| **Rate Limiting** | 100 requests / 15 minutes on auth endpoints |
| **CORS** | Origin validation — Vercel domains + configured origins |
| **RBAC** | Three-tier role system — Student, Instructor, Admin |
| **Input Validation** | Server-side validation on all endpoints |
| **Token Expiry Handling** | Auto-redirect on 401 via Axios interceptor |
| **AI Isolation** | AI service only accessible from backend, not exposed publicly |

### Scalability Design

| Aspect | Approach |
|:-------|:---------|
| **Microservice Architecture** | Three independently deployable services |
| **Serverless Database** | NeonDB auto-scales based on demand |
| **AI Response Caching** | Quizzes cached in PostgreSQL after first generation |
| **Stateless Backend** | JWT-based auth — no server-side sessions |
| **Pagination** | Course listing with page/limit support |
| **Concurrent Queries** | `Promise.all` for parallel DB queries |
| **Edge Deployment** | Frontend on Vercel Edge Network |

<br/>

---

<br/>

## 📸 Screenshots & Demo

> 🖼️ **Screenshots coming soon** — The platform UI is under active development.

| Page | Preview |
|:-----|:--------|
| Landing Page | `Coming Soon` |
| Student Dashboard | `Coming Soon` |
| AI Quiz Interface | `Coming Soon` |
| AI Chatbot | `Coming Soon` |
| Course View | `Coming Soon` |
| Instructor Panel | `Coming Soon` |

<br/>

---

<br/>

## 🗺️ Future Roadmap

- [ ] 🎥 **Video Streaming** — Integrated video player with progress tracking
- [ ] 📝 **Assignment System** — Instructor-created assignments with AI grading
- [ ] 🏆 **Gamification** — Badges, streaks, and leaderboard
- [ ] 📊 **Instructor Analytics Dashboard** — Course performance metrics with Recharts
- [ ] 🔔 **Real-time Notifications** — WebSocket-based push notifications
- [ ] 🌐 **Multi-language Support** — i18n for global accessibility
- [ ] 📱 **Mobile App** — React Native companion app
- [ ] 🗣️ **Voice-to-Text Doubts** — Ask questions via speech
- [ ] 🤖 **AI Course Generator** — Auto-generate entire course structure from a topic
- [ ] 📧 **Email Notifications** — Enrollment confirmations, certificate delivery

<br/>

---

<br/>

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

Please ensure your code follows the existing patterns and includes appropriate type definitions.

<br/>

---

<br/>

## 👤 Author

**Shirshendu Sen**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shirshendu-sen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/)

<br/>

---

<br/>

<div align="center">

**Built with ❤️ and AI**

*Smart Academic Platform — Intelligent Learning, Infinite Possibilities*

</div>
