# AI Agent Execution Guide — Smart Academic Platform (LMS)

> **Project:** Smart Academic Platform — AI-Powered Learning Management System
> **Author:** Shirshendu Sen
> **Document Type:** Production AI Agent Execution Guide
> **Version:** 2.0 — Single Source of Truth

---

## Document Purpose

This guide instructs an autonomous AI agent on how to build the Smart Academic Platform from scratch, phase by phase. It is not a tutorial. It is a structured execution protocol. Every phase contains explicit goals, required human actions, agent responsibilities, step-by-step instructions, mandatory inline tests, and completion checklists. The agent must not deviate from this structure.

---

## ⚠️ AI Agent Rules — Read Before Starting Any Phase

The AI agent **MUST** follow all rules below unconditionally, throughout the entire project.

### Sequential Execution
1. Phases must be executed in order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10.
2. No phase may begin until the previous phase's Completion Checklist is fully satisfied.
3. No steps within a phase may be skipped or reordered.

### Architecture Integrity
4. Never replace, rename, or swap any technology in the tech stack without explicit written approval from the project owner.
5. Never change the service topology (Frontend / Backend / AI Service) or the communication pattern (Frontend → Backend → AI Service).
6. Never move the AI service to Vercel. It must remain on Render.com due to Vercel's 10-second serverless timeout.
7. Never call the AI service directly from the frontend. All AI calls must go through the backend proxy.

### Credentials and Secrets
8. **STOP immediately** and ask the user to provide any required credential before proceeding. Required credentials per phase are listed in each phase's **User Action Required** section.
9. Never invent, guess, fabricate, or hardcode secrets, API keys, MongoDB URIs, JWT secrets, Cloudinary credentials, or OAuth tokens.
10. Never commit `.env` files to git. Verify `.gitignore` covers them before every commit.
11. If a credential is missing from the user's response, do not proceed. Ask again.

### Mandatory Testing Protocol
12. After completing each numbered implementation step, run the test listed for that step immediately.
13. If a step's test fails, diagnose and fix the issue before moving to the next step.
14. Do not proceed to the next step while any test is failing.
15. Do not proceed to the next phase while any item on the Completion Checklist is unchecked.
16. Never claim a test passed without actually running the command and observing the expected output.

### Documentation
17. If a fix or deviation from the guide is required, document it in a `CHANGES.md` file at the project root before applying the change.
18. Update the Completion Checklist in the guide after finishing each phase.

---

## Project Overview

The Smart Academic Platform is a 3-service microservices application — a full-stack LMS with AI at its core.

| Service | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js + TypeScript + Tailwind CSS | Student and instructor web interface |
| **Backend** | Node.js + Express + TypeScript + MongoDB | REST API, authentication, data persistence |
| **AI Service** | Python + Flask + Google Gemini | Quiz generation, chatbot, summarizer, progress analysis |

**Three user roles:** Student · Instructor · Admin

**Four AI features:** Quiz Generator · Doubt Chatbot · Lecture Summarizer · Progress Analyzer

---

## Full Tech Stack (Frozen — Do Not Change Without Approval)

### Frontend
- **Next.js (latest)** — React framework with App Router (file-based routing, SSR)
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS** — Utility-first CSS framework
- **Zustand** — Global state management with localStorage persistence
- **TanStack Query v5** — Server state management, caching, loading/error handling
- **Axios** — HTTP client with JWT interceptors
- **React Hook Form + Zod** — Form handling and schema validation
- **Recharts** — Progress dashboard charts
- **Lucide React** — Icon library

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **TypeScript** — Type safety on the server
- **Mongoose ODM** — Schema-based MongoDB client (v6+ ships its own types; do NOT install `@types/mongoose`)
- **MongoDB Atlas** — Cloud-hosted document database
- **JWT (jsonwebtoken)** — Stateless authentication tokens
- **bcryptjs** — Password hashing
- **Helmet** — HTTP security headers
- **express-rate-limit** — Brute-force protection on auth routes
- **Multer + Cloudinary** — File upload pipeline
- **Axios** — Backend-to-AI-service HTTP calls

### AI Service
- **Python 3.10+** — Runtime
- **Flask** — Lightweight HTTP framework
- **flask-cors** — Cross-origin request support
- **google-generativeai** — Official Gemini AI SDK
- **python-dotenv** — `.env` loader
- **Gunicorn** — Production WSGI server for Render.com

### Infrastructure
- **Vercel** — Hosts frontend and backend (serverless Node.js)
- **Render.com** — Hosts AI Python service (no timeout limit on free tier)
- **MongoDB Atlas** — M0 free tier, 512 MB
- **GitHub Actions** — CI/CD pipeline
- **Cloudinary** — Cloud storage for images and files (25 GB free)

> **Critical constraint:** Vercel free tier enforces a 10-second request timeout. Gemini API calls take 3–8 seconds. The AI service MUST be on Render.com.

---

## Roadmap at a Glance

| Phase | What Gets Built | Produces |
|---|---|---|
| 0 | Environment setup, accounts, folder structure | Initialized repo |
| 1 | Database schemas and models | 8 Mongoose models |
| 2 | Express server + authentication | `/api/auth/*` endpoints |
| 3 | Course and lesson REST APIs | `/api/courses/*`, `/api/lessons/*` |
| 4 | Python AI microservice | `/generate-quiz`, `/summarize`, `/chat`, `/analyze-student` |
| 5 | AI bridge (backend proxy) | `/api/ai/*` endpoints |
| 6 | Frontend setup and routing | Next.js app with Zustand + Axios |
| 7 | Frontend pages and AI components | All UI pages and React components |
| 8 | Full local integration test | Verified end-to-end flow |
| 9 | Deploy (Render + Vercel) | 3 live URLs |
| 10 | CI/CD pipeline | GitHub Actions workflow |

---

---

# PHASE 0 — Environment Setup

## Goal
Establish a working local development environment with all required software, accounts, credentials, and the initial project folder structure. No code is written in this phase. This phase produces a git-initialized, correctly structured project root.

## Prerequisites
- A computer with internet access
- Ability to install software (admin/sudo privileges)
- A GitHub account (create one at github.com if needed)

## User Action Required

> **The AI agent must STOP and request all of the following before proceeding.**

The agent must collect and confirm each item before writing any code:

1. **GitHub account** — confirm username
2. **MongoDB Atlas account** — create at mongodb.com/atlas (free)
   - Create a new project
   - Create a free M0 cluster
   - Create a database user with a username and password
   - Set Network Access to Allow Access from Anywhere (`0.0.0.0/0`)
   - Copy the full connection string: `mongodb+srv://username:password@cluster.mongodb.net/smart-lms`
3. **Google Gemini API key** — get at aistudio.google.com/app/apikey → Create API Key
4. **Cloudinary account** — create at cloudinary.com (free)
   - Copy `Cloud Name`, `API Key`, and `API Secret` from the dashboard
5. **Vercel account** — create at vercel.com (free, sign in with GitHub)
6. **Render account** — create at render.com (free, sign in with GitHub)

**The agent must verify the user has provided:** MongoDB URI, Gemini API key, Cloudinary cloud name, Cloudinary API key, Cloudinary API secret.

## AI Agent Responsibilities
- Verify software is installed at required versions
- Create the folder structure
- Create the root `.gitignore`
- Make the initial git commit
- Do NOT proceed until all credentials above are confirmed

---

## Step-by-Step Implementation

### Step 0.1 — Verify required software

Run each command and check the output against the minimum version:

```bash
node --version     # Required: v18.0.0 or higher (v20 recommended)
npm --version      # Required: v9.0.0 or higher
python --version   # Required: v3.10.0 or higher
git --version      # Required: any version
```

**Mandatory test after Step 0.1:**
```bash
node --version | grep -E "^v(1[89]|[2-9][0-9])" && echo "✅ Node OK" || echo "❌ Node too old"
python --version | grep -E "3\.(1[0-9]|[2-9][0-9])" && echo "✅ Python OK" || echo "❌ Python too old"
```
> Both lines must print `✅`. If Node or Python are missing or too old, instruct the user to install from nodejs.org and python.org and re-run Step 0.1 before continuing.

---

### Step 0.2 — Create the project folder structure

```bash
mkdir smart-lms
cd smart-lms
mkdir frontend backend ai-service
mkdir -p .github/workflows
git init
```

**Mandatory test after Step 0.2:**
```bash
ls -la smart-lms/
# Must show: frontend/  backend/  ai-service/  .github/  .git/
git -C smart-lms status
# Must show: "On branch master" or "On branch main" and "No commits yet"
```

---

### Step 0.3 — Create root `.gitignore`

**File to create:** `smart-lms/.gitignore`

```gitignore
node_modules/
dist/
.env
.env.local
venv/
__pycache__/
*.pyc
*.pyo
.DS_Store
.next/
```

**Mandatory test after Step 0.3:**
```bash
cd smart-lms
cat .gitignore
# Must show all 9 lines above
git status
# .env must NOT appear under "Untracked files" after you create one
```

---

### Step 0.4 — Make the initial commit

```bash
cd smart-lms
git add .
git commit -m "phase 0: initial project structure"
```

**Mandatory test after Step 0.4:**
```bash
git log --oneline
# Must show exactly 1 commit with message "phase 0: initial project structure"
```

---

## Commands Reference (Phase 0)

```bash
# Check all versions
node --version && npm --version && python --version && git --version

# Create structure
mkdir smart-lms && cd smart-lms && mkdir frontend backend ai-service && mkdir -p .github/workflows && git init

# Initial commit
git add . && git commit -m "phase 0: initial project structure"
```

## Files Created in Phase 0

| File | Location | Purpose |
|---|---|---|
| `.gitignore` | `smart-lms/.gitignore` | Prevents secrets and binaries from being committed |

## Common Issues and Fixes

| Issue | Symptom | Fix |
|---|---|---|
| Node not found after install | `node: command not found` | Close and reopen the terminal; on Windows restart PC |
| Git says "not a git repository" | `fatal: not a git repository` | Run `git init` inside `smart-lms/`, not outside it |
| Python version too old | `3.9.x` shown | Install Python 3.10+ from python.org; use `python3` instead of `python` on Linux |
| `.env` appears in git status | Listed under "Untracked files" | Verify `.env` is spelled correctly in `.gitignore` (no leading space) |

## Completion Checklist — Phase 0

- [ ] `node --version` shows v18 or higher
- [ ] `python --version` shows v3.10 or higher
- [ ] `git --version` works
- [ ] VS Code installed (recommended: ESLint, Prettier, Tailwind IntelliSense, Python, MongoDB extensions)
- [ ] All 6 accounts created: GitHub, MongoDB Atlas, Vercel, Render, Cloudinary, Google AI Studio
- [ ] MongoDB Atlas connection string obtained (with real password replacing `<password>`)
- [ ] Gemini API key saved
- [ ] Cloudinary Cloud Name, API Key, and API Secret saved
- [ ] `smart-lms/` folder created with `frontend/`, `backend/`, `ai-service/`, `.github/workflows/`
- [ ] Root `.gitignore` created and contains all 9 entries
- [ ] Initial git commit made (`git log --oneline` shows 1 commit)

---

---

# PHASE 1 — Database Design

## Goal
Install all backend Node.js dependencies, configure TypeScript, create the MongoDB connection utility using the lazy-connection pattern, and define all 8 Mongoose data models. At the end of this phase, the agent must verify that a connection to MongoDB Atlas succeeds.

## Prerequisites
- Phase 0 Completion Checklist: fully satisfied
- MongoDB Atlas connection string available (collected in Phase 0)

## User Action Required

> **The AI agent must STOP and confirm before proceeding.**

The agent needs to confirm receipt of:
1. **MongoDB Atlas connection string** in the format:
   `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/smart-lms`
   (with `<password>` already replaced by the real password)

If the user has not yet provided the MongoDB URI, ask now and wait.

## AI Agent Responsibilities
- Install all npm runtime and dev dependencies
- Create `tsconfig.json` with correct `rootDir`/`outDir` settings
- Set the correct `start` script in `package.json`
- Create `.env` with the provided credentials
- Create `src/db.ts` using the lazy-connection pattern
- Create all 8 Mongoose model files
- Run the database connection test and confirm success

---

## Step-by-Step Implementation

### Step 1.1 — Install all backend npm packages

```bash
cd smart-lms/backend
npm init -y
npm install express cors helmet express-rate-limit bcryptjs jsonwebtoken multer axios cloudinary dotenv mongoose
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer
```

> **Important:** `mongoose` is a runtime package. Do NOT install `@types/mongoose` — Mongoose v6+ ships its own TypeScript types.

**Mandatory test after Step 1.1:**
```bash
ls node_modules | grep -E "^(express|mongoose|mongoose|bcryptjs|jsonwebtoken|dotenv|helmet)$"
# All 7 package names must appear
cat package.json | grep '"mongoose"'
# Must appear under "dependencies", NOT "devDependencies"
```

---

### Step 1.2 — Create `backend/tsconfig.json`

**File to create:** `smart-lms/backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "api/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Mandatory test after Step 1.2:**
```bash
npx tsc --showConfig 2>/dev/null | grep -E '"outDir"|"rootDir"'
# Must show: "outDir": "./dist" and "rootDir": "./src"
```

---

### Step 1.3 — Set `package.json` scripts

Open `backend/package.json` and replace the `"scripts"` section with:

```json
"scripts": {
  "dev":   "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

> **Critical:** The `start` script must point to `dist/index.js` (NOT `dist/src/index.js`). Because `rootDir` is `./src` and `outDir` is `./dist`, TypeScript compiles `src/index.ts` directly to `dist/index.js`.

**Mandatory test after Step 1.3:**
```bash
cat package.json | grep '"start"'
# Must show: "start": "node dist/index.js"
# Must NOT contain "dist/src/index.js"
```

---

### Step 1.4 — Create `backend/.env`

**File to create:** `smart-lms/backend/.env`

First generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output. Then create the file:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/smart-lms
JWT_SECRET=PASTE_THE_64_CHAR_HEX_STRING_HERE
AI_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3001
NODE_ENV=development
```

Replace every placeholder with the real values provided by the user.

**Mandatory test after Step 1.4:**
```bash
cat .env | grep "MONGODB_URI"
# Must contain the real Atlas URI (not the placeholder text)
cat .env | grep "JWT_SECRET" | awk -F= '{print length($2)}'
# Must print 128 (the hex string is 128 characters)
git status | grep ".env"
# Must show nothing — .env must NOT be tracked by git
```

---

### Step 1.5 — Create `backend/src/db.ts`

**File to create:** `smart-lms/backend/src/db.ts`

> This uses the lazy-connection pattern. `connectDB()` caches the connection and skips reconnection if already connected. This is required for Vercel serverless cold starts.

```typescript
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
```

**Mandatory test after Step 1.5:**
```bash
npx ts-node -e "import { connectDB } from './src/db'; connectDB().then(() => process.exit(0))" 2>&1 | head -5
# Must print: ✅ MongoDB connected
# Must NOT print any error about the URI or authentication
```

---

### Step 1.6 — Create the 8 Mongoose model files

Create the directory first:
```bash
mkdir -p smart-lms/backend/src/models
```

---

**File to create:** `smart-lms/backend/src/models/User.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name:      string;
  email:     string;
  password:  string;
  role:      'student' | 'instructor' | 'admin';
  avatarUrl?: string;
}

const UserSchema = new Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role: {
    type:    String,
    enum:    ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatarUrl: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
```

---

**File to create:** `smart-lms/backend/src/models/Course.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title:        string;
  description?: string;
  instructorId: mongoose.Types.ObjectId;
  thumbnailUrl?: string;
  isPublished:  boolean;
}

const CourseSchema = new Schema<ICourse>({
  title:        { type: String, required: true },
  description:  { type: String },
  instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnailUrl: { type: String },
  isPublished:  { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
```

---

**File to create:** `smart-lms/backend/src/models/Lesson.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  courseId:   mongoose.Types.ObjectId;
  title:      string;
  content?:   string;
  videoUrl?:  string;
  orderIndex: number;
}

const LessonSchema = new Schema<ILesson>({
  courseId:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title:      { type: String, required: true },
  content:    { type: String },
  videoUrl:   { type: String },
  orderIndex: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ILesson>('Lesson', LessonSchema);
```

---

**File to create:** `smart-lms/backend/src/models/Enrollment.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  studentId:  mongoose.Types.ObjectId;
  courseId:   mongoose.Types.ObjectId;
  enrolledAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
  studentId:  { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now }
});

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
```

---

**File to create:** `smart-lms/backend/src/models/Progress.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  studentId:    mongoose.Types.ObjectId;
  lessonId:     mongoose.Types.ObjectId;
  completed:    boolean;
  completedAt?: Date;
}

const ProgressSchema = new Schema<IProgress>({
  studentId:   { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  lessonId:    { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date }
});

ProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
```

---

**File to create:** `smart-lms/backend/src/models/Quiz.ts`

> `QuestionSchema` validates AI-generated data at the database level. `questions: any[]` is NOT acceptable.

```typescript
import mongoose, { Document, Schema } from 'mongoose';

const QuestionSchema = new Schema({
  question:       { type: String, required: true },
  options:        { type: [String], required: true },
  correct_answer: { type: String, required: true },
  explanation:    { type: String }
}, { _id: false });

export interface IQuizQuestion {
  question:       string;
  options:        string[];
  correct_answer: string;
  explanation?:   string;
}

export interface IQuiz extends Document {
  lessonId:  mongoose.Types.ObjectId;
  questions: IQuizQuestion[];
}

const QuizSchema = new Schema<IQuiz>({
  lessonId:  { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, unique: true },
  questions: { type: [QuestionSchema], required: true }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
```

---

**File to create:** `smart-lms/backend/src/models/QuizAttempt.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  quizId:      mongoose.Types.ObjectId;
  studentId:   mongoose.Types.ObjectId;
  score:       number;
  totalQ:      number;
  answers:     Record<string, string>;
  attemptedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId:      { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score:       { type: Number, required: true },
  totalQ:      { type: Number, required: true },
  answers:     { type: Schema.Types.Mixed },
  attemptedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
```

---

**File to create:** `smart-lms/backend/src/models/Certificate.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId:  mongoose.Types.ObjectId;
  certUrl?:  string;
  issuedAt:  Date;
}

const CertificateSchema = new Schema<ICertificate>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  certUrl:   { type: String },
  issuedAt:  { type: Date, default: Date.now }
});

CertificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
```

**Mandatory test after Step 1.6:**
```bash
ls smart-lms/backend/src/models/
# Must show exactly 8 files:
# Certificate.ts  Course.ts  Enrollment.ts  Lesson.ts  Progress.ts  Quiz.ts  QuizAttempt.ts  User.ts

npx tsc --noEmit 2>&1
# Must produce no output (zero TypeScript errors)
```

---

### Step 1.7 — Run the database connection test

**Temporary file to create, then delete:** `smart-lms/backend/src/test-db.ts`

```typescript
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => { console.log('✅ MongoDB connected!'); process.exit(0); })
  .catch(err => { console.error('❌ Connection failed:', err.message); process.exit(1); });
```

```bash
cd smart-lms/backend
npx ts-node src/test-db.ts
```

**Mandatory test after Step 1.7:**
```
# Terminal output must show EXACTLY:
✅ MongoDB connected!

# If it shows "Authentication failed" → wrong password in the URI
# If it shows "IP not whitelisted" → Atlas Network Access not set to 0.0.0.0/0
```

After the test passes, delete the test file:
```bash
rm smart-lms/backend/src/test-db.ts
```

---

## Files Created in Phase 1

| File | Purpose |
|---|---|
| `backend/package.json` | Updated with correct scripts |
| `backend/tsconfig.json` | TypeScript compiler configuration |
| `backend/.env` | Environment variables (never committed) |
| `backend/src/db.ts` | Lazy MongoDB connection utility |
| `backend/src/models/User.ts` | User schema with typed role enum |
| `backend/src/models/Course.ts` | Course schema |
| `backend/src/models/Lesson.ts` | Lesson schema |
| `backend/src/models/Enrollment.ts` | Student-course enrollment (compound unique index) |
| `backend/src/models/Progress.ts` | Per-student lesson completion (compound unique index) |
| `backend/src/models/Quiz.ts` | AI-generated quiz with typed QuestionSchema |
| `backend/src/models/QuizAttempt.ts` | Student quiz submission record |
| `backend/src/models/Certificate.ts` | Course completion certificate |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `Authentication failed` connecting to Atlas | Double-check the password in the URI. Special characters like `@` must be URL-encoded (`%40`) |
| `IP not whitelisted` | Atlas → Network Access → Add IP Address → Allow Access from Anywhere |
| TypeScript error on `createdAt` missing | Verify `createdAt`/`updatedAt` are NOT in the interfaces; `timestamps: true` handles them |
| `Cannot find module 'mongoose'` | Run `npm install mongoose` inside the `backend/` folder |
| `dist/src/index.js not found` | The `start` script must be `node dist/index.js`, not `dist/src/index.js` |

## Completion Checklist — Phase 1

- [ ] `npm install` completed — all runtime and dev packages installed
- [ ] `tsconfig.json` created with `rootDir: "./src"` and `outDir: "./dist"`
- [ ] `package.json` `start` script uses `dist/index.js` (not `dist/src/index.js`)
- [ ] `.env` created with real MongoDB URI, generated JWT secret, and Cloudinary credentials
- [ ] `.env` is NOT tracked by git (`git status` shows nothing for `.env`)
- [ ] `src/db.ts` uses the lazy-connection pattern (`let isConnected = false`)
- [ ] All 8 model files exist in `src/models/`
- [ ] `User.ts` has role as `'student' | 'instructor' | 'admin'` union type with `enum` validation
- [ ] `Quiz.ts` uses `QuestionSchema` (NOT `questions: any[]`)
- [ ] `npx tsc --noEmit` produces zero errors
- [ ] `npx ts-node src/test-db.ts` prints `✅ MongoDB connected!`
- [ ] `src/test-db.ts` deleted after successful test

---

---

# PHASE 2 — Backend Server + Authentication

## Goal
Build the Express.js server with security middleware, create JWT authentication middleware for protecting routes, and implement the three auth endpoints: register, login, and get-current-user. At the end of this phase, the backend must run locally and all three auth endpoints must pass their curl tests.

## Prerequisites
- Phase 1 Completion Checklist: fully satisfied
- `src/db.ts` and all 8 models exist

## User Action Required
No new credentials required. All secrets were collected in Phase 0/1 and are already in `.env`.

## AI Agent Responsibilities
- Create `src/app.ts` with the lazy DB connection middleware
- Create `src/index.ts` (local dev server entry)
- Create `api/index.ts` (Vercel serverless entry)
- Create `vercel.json`
- Create `src/middleware/auth.ts`
- Create `src/routes/auth.ts` with password validation
- Start the dev server and run all curl tests

---

## Step-by-Step Implementation

### Step 2.1 — Create `backend/src/app.ts`

**File to create:** `smart-lms/backend/src/app.ts`

> `connectDB()` is called inside a per-request middleware, NOT at module top-level. This ensures the database connects before every request, including on cold starts.

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './db';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy DB connection — connects before every request (safe for Vercel serverless cold starts)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
```

**Mandatory test after Step 2.1:**
```bash
npx tsc --noEmit 2>&1
# Must produce no output
```

---

### Step 2.2 — Create `backend/src/index.ts`

**File to create:** `smart-lms/backend/src/index.ts`

```typescript
import app from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
```

---

### Step 2.3 — Create `backend/api/index.ts`

```bash
mkdir -p smart-lms/backend/api
```

**File to create:** `smart-lms/backend/api/index.ts`

```typescript
import app from '../src/app';
export default app;
```

---

### Step 2.4 — Create `backend/vercel.json`

**File to create:** `smart-lms/backend/vercel.json`

```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }],
  "env": { "NODE_ENV": "production" }
}
```

---

### Step 2.5 — Create `backend/src/middleware/auth.ts`

```bash
mkdir -p smart-lms/backend/src/middleware
```

**File to create:** `smart-lms/backend/src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role:   'student' | 'instructor' | 'admin';
    email:  string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden: insufficient role' });
    }
    next();
  };
};
```

---

### Step 2.6 — Create `backend/src/routes/auth.ts`

```bash
mkdir -p smart-lms/backend/src/routes
```

**File to create:** `smart-lms/backend/src/routes/auth.ts`

> Password must be validated both on the backend (authoritative) and on the frontend (fast feedback). The backend check here is authoritative and cannot be bypassed. The `/me` route uses the `authenticate` middleware — it does NOT manually decode the JWT.

```typescript
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must contain at least one uppercase letter and one number'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user:  { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user:  { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).select('name email role avatarUrl');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
```

**Mandatory test after Step 2.6:**
```bash
npx tsc --noEmit 2>&1
# Must produce no output (zero TypeScript errors across all files)
```

---

### Step 2.7 — Start the backend and run auth endpoint tests

Start the backend in one terminal:
```bash
cd smart-lms/backend
npm run dev
# Must print: ✅ Backend running on http://localhost:3001
# MongoDB will connect on the first incoming request
```

In a second terminal, run each curl test and verify the expected output:

**Test 1 — Health check:**
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

**Test 2 — Register a student:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","email":"student@test.com","password":"Test@1234","role":"student"}'
# Expected: {"user":{"id":"...","name":"Test Student","email":"student@test.com","role":"student"},"token":"eyJ..."}
# Save the token value as STUDENT_TOKEN for Phase 3 tests
```

**Test 3 — Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Test@1234"}'
# Expected: {"user":{...},"token":"eyJ..."}
```

**Test 4 — Weak password rejection:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bad","email":"bad@test.com","password":"abc"}'
# Expected: {"error":"Password must be at least 8 characters"}
```

**Test 5 — Get current user:**
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer PASTE_STUDENT_TOKEN_HERE"
# Expected: {"_id":"...","name":"Test Student","email":"student@test.com","role":"student"}
```

**Mandatory test after Step 2.7:**
- All 5 curl tests must return the expected responses
- Open MongoDB Atlas → Browse Collections → the `smart-lms` database → `users` collection must contain 1 document
- The `password` field must start with `$2b$` (bcrypt hash), never plain text

---

## Files Created in Phase 2

| File | Purpose |
|---|---|
| `backend/src/app.ts` | Express app with all middleware |
| `backend/src/index.ts` | Local dev server entry point |
| `backend/api/index.ts` | Vercel serverless entry point |
| `backend/vercel.json` | Vercel deployment configuration |
| `backend/src/middleware/auth.ts` | JWT `authenticate` and `authorize` middleware |
| `backend/src/routes/auth.ts` | Register, login, /me endpoints |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `JWT_SECRET is undefined` | Verify `.env` was created in the `backend/` folder and `dotenv.config()` runs at the top of `app.ts` |
| JWT token decodes to wrong data | Do NOT hash the password twice; hash only in the register handler |
| `Cannot POST /api/auth/register` | Verify `app.use('/api/auth', authRoutes)` is present in `app.ts` |
| Backend crashes on start | Read the error message in the terminal; most likely a TypeScript import error — run `npx tsc --noEmit` |

## Completion Checklist — Phase 2

- [ ] `npm run dev` starts without errors and prints the listening message
- [ ] `GET /api/health` returns `{"status":"ok"}`
- [ ] `POST /api/auth/register` returns a user object and JWT token
- [ ] `POST /api/auth/login` with correct password returns a token
- [ ] `POST /api/auth/login` with wrong password returns 401
- [ ] Weak password (under 8 chars) is rejected by the backend
- [ ] Password without uppercase + number is rejected by the backend
- [ ] User document appears in MongoDB Atlas `users` collection
- [ ] Password in Atlas starts with `$2b$` (bcrypt hash, never plain text)
- [ ] `GET /api/auth/me` with a valid Bearer token returns the user profile
- [ ] `npx tsc --noEmit` produces zero errors

---

---

# PHASE 3 — Course & Lesson APIs

## Goal
Add REST API endpoints for course management, lesson management, enrollment, and progress tracking. Implement Role-Based Access Control (RBAC) so only instructors can create courses and only students can enroll. At the end of this phase, both route files must exist, all RBAC rules must be enforced, and all curl tests must pass.

## Prerequisites
- Phase 2 Completion Checklist: fully satisfied
- `src/middleware/auth.ts` (`authenticate`, `authorize`) must exist
- Backend dev server running from Phase 2

## User Action Required
No new credentials required.

## AI Agent Responsibilities
- Create `src/routes/courses.ts`
- Create `src/routes/lessons.ts`
- Update `src/app.ts` to register both new route groups
- Run all RBAC enforcement tests

---

## Step-by-Step Implementation

### Step 3.1 — Create `backend/src/routes/courses.ts`

**File to create:** `smart-lms/backend/src/routes/courses.ts`

> `instructorId` must always come from `req.user!.userId` (the verified JWT payload), never from the request body. This prevents users from impersonating other instructors. The progress route returns an `isEnrolled` field so the frontend can correctly show/hide the enroll button.

```typescript
import { Router, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';
import Enrollment from '../models/Enrollment';
import Progress from '../models/Progress';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/courses — list all published courses (no auth required)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructorId', 'name')
      .lean();

    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const lessonCount = await Lesson.countDocuments({ courseId: course._id });
        return { ...course, instructor: course.instructorId, _count: { lessons: lessonCount } };
      })
    );

    res.json(coursesWithCount);
  } catch {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id — get a single course with its lessons
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name')
      .lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const lessons = await Lesson.find({ courseId: req.params.id })
      .sort({ orderIndex: 1 })
      .lean();

    res.json({ ...course, instructor: course.instructorId, lessons });
  } catch {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses — create a course (instructors and admins only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const course = await Course.create({
      title,
      description,
      instructorId: req.user!.userId  // Always from JWT, never from request body
    });
    res.status(201).json(course);
  } catch {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PATCH /api/courses/:id/publish
router.patch('/:id/publish', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isPublished: req.body.isPublished },
      { new: true }
    );
    res.json(course);
  } catch {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// POST /api/courses/:id/enroll — student enrolls in a course
router.post('/:id/enroll', authenticate, authorize('student'), async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await Enrollment.create({
      studentId: req.user!.userId,
      courseId:  req.params.id
    });
    res.status(201).json(enrollment);
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ error: 'Already enrolled' });
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// GET /api/courses/:id/progress
router.get('/:id/progress', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id }).lean();
    const lessonIds = lessons.map(l => l._id);

    const completedCount = await Progress.countDocuments({
      studentId: req.user!.userId,
      lessonId:  { $in: lessonIds },
      completed: true
    });

    const enrollment = await Enrollment.findOne({
      studentId: req.user!.userId,
      courseId:  req.params.id
    }).lean();

    res.json({
      totalLessons:     lessons.length,
      completedLessons: completedCount,
      percentage:       lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0,
      isEnrolled:       !!enrollment
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
```

**Mandatory test after Step 3.1:**
```bash
npx tsc --noEmit 2>&1
# Must produce no output
```

---

### Step 3.2 — Create `backend/src/routes/lessons.ts`

**File to create:** `smart-lms/backend/src/routes/lessons.ts`

```typescript
import { Router, Response } from 'express';
import Lesson from '../models/Lesson';
import Quiz from '../models/Quiz';
import QuizAttempt from '../models/QuizAttempt';
import Progress from '../models/Progress';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/lessons — create a lesson (instructors only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, content, videoUrl, orderIndex } = req.body;
    if (!courseId || !title) return res.status(400).json({ error: 'courseId and title are required' });

    const lesson = await Lesson.create({ courseId, title, content, videoUrl, orderIndex: orderIndex || 0 });
    res.status(201).json(lesson);
  } catch {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// GET /api/lessons/:id — get a lesson with its quiz
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).lean();
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const quiz = await Quiz.findOne({ lessonId: req.params.id }).lean();
    res.json({ ...lesson, quiz });
  } catch {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// POST /api/lessons/:id/complete — student marks lesson done
router.post('/:id/complete', authenticate, authorize('student'), async (req: AuthRequest, res: Response) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { studentId: req.user!.userId, lessonId: req.params.id },
      { completed: true, completedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch {
    res.status(500).json({ error: 'Failed to mark complete' });
  }
});

// POST /api/lessons/:id/quiz-attempt — student submits quiz answers
router.post('/:id/quiz-attempt', authenticate, authorize('student'), async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.id });
    if (!quiz) return res.status(404).json({ error: 'No quiz for this lesson' });

    const { answers, score } = req.body;
    const attempt = await QuizAttempt.create({
      quizId:    quiz._id,
      studentId: req.user!.userId,
      score,
      totalQ:    quiz.questions.length,
      answers
    });
    res.status(201).json(attempt);
  } catch {
    res.status(500).json({ error: 'Failed to save quiz attempt' });
  }
});

export default router;
```

---

### Step 3.3 — Update `backend/src/app.ts` (add course and lesson routes)

Replace the full content of `backend/src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './db';
import authRoutes   from './routes/auth';
import courseRoutes from './routes/courses';
import lessonRoutes from './routes/lessons';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
```

After saving, restart the backend (`Ctrl+C` then `npm run dev`).

**Mandatory test after Step 3.3:**
```bash
npx tsc --noEmit 2>&1
# Must produce no output
curl http://localhost:3001/api/courses
# Must return [] (empty array — no courses yet)
```

---

### Step 3.4 — Run all RBAC and route tests

Register an instructor account first, then run all tests in order:

```bash
# 1. Register an instructor (save the token as INSTRUCTOR_TOKEN)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Instructor","email":"jane@test.com","password":"Test@1234","role":"instructor"}'

# 2. Create a course with instructor token
curl -X POST http://localhost:3001/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -d '{"title":"Intro to Python","description":"Learn Python from scratch"}'
# Save the returned "_id" as COURSE_ID

# 3. Publish the course
curl -X PATCH http://localhost:3001/api/courses/COURSE_ID/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -d '{"isPublished":true}'
# Expected: course object with "isPublished": true

# 4. List published courses (no auth)
curl http://localhost:3001/api/courses
# Expected: array containing the course with "_count": {"lessons": 0}

# 5. RBAC test — student must be forbidden from creating a course
curl -X POST http://localhost:3001/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{"title":"Hacked Course"}'
# Expected: {"error":"Access forbidden: insufficient role"}

# 6. No token test
curl -X POST http://localhost:3001/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"No Auth"}'
# Expected: {"error":"No token provided"}

# 7. Create a lesson
curl -X POST http://localhost:3001/api/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -d '{"courseId":"COURSE_ID","title":"Lesson 1: Variables","content":"In Python, variables are created with assignment statements."}'
# Save the returned "_id" as LESSON_ID

# 8. Get progress for the course (student token)
curl http://localhost:3001/api/courses/COURSE_ID/progress \
  -H "Authorization: Bearer STUDENT_TOKEN"
# Expected: {"totalLessons":1,"completedLessons":0,"percentage":0,"isEnrolled":false}
```

**Mandatory test after Step 3.4:**
All 8 curl commands must return their expected responses. The `isEnrolled` field must be present in the progress response.

---

## Files Created in Phase 3

| File | Purpose |
|---|---|
| `backend/src/routes/courses.ts` | Course CRUD, enrollment, and progress endpoints |
| `backend/src/routes/lessons.ts` | Lesson CRUD, completion, and quiz attempt endpoints |
| `backend/src/app.ts` | Updated — registers course and lesson route groups |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| 401 on protected routes | Include `Authorization: Bearer <token>` in the request header |
| `Cast to ObjectId failed` | The ID is not a valid MongoDB ObjectId — check for copy-paste typos |
| Student successfully creates a course | Verify `authorize('instructor', 'admin')` is on the POST `/` route |
| `isEnrolled` field missing from progress response | Verify the `Enrollment.findOne` query and `!!enrollment` spread are in the route |

## Completion Checklist — Phase 3

- [ ] `POST /api/courses` with instructor token creates a course and returns it
- [ ] `GET /api/courses` returns published courses with lesson count
- [ ] `PATCH /api/courses/:id/publish` toggles `isPublished`
- [ ] `POST /api/courses/:id/enroll` lets a student enroll (returns 409 if already enrolled)
- [ ] `GET /api/courses/:id/progress` returns `isEnrolled`, `percentage`, `totalLessons`, `completedLessons`
- [ ] `POST /api/lessons` creates a lesson with an instructor token
- [ ] `GET /api/lessons/:id` returns the lesson (with `quiz: null` before any quiz is generated)
- [ ] Student token on an instructor route returns 403
- [ ] No token on a protected route returns 401
- [ ] `npx tsc --noEmit` produces zero errors

---

---

# PHASE 4 — AI Microservice (Python + Flask + Gemini)

## Goal
Build the standalone Python AI microservice with four endpoints: quiz generation, summarization, chatbot, and student analysis. This service runs independently of the backend and database. At the end of this phase, all four AI endpoints must respond correctly to curl tests.

## Prerequisites
- Phase 0 Completion Checklist: fully satisfied (Gemini API key must be available)
- Python 3.10+ installed

## User Action Required

> **The AI agent must STOP and confirm the Gemini API key before creating `ai-service/.env`.**

Required from the user:
1. **Gemini API key** — from aistudio.google.com/app/apikey

If not yet provided, ask now and wait.

## AI Agent Responsibilities
- Create and activate a Python virtual environment
- Install all Python packages
- Generate `requirements.txt`
- Create `ai-service/.env` with the provided API key
- Create `ai-service/app.py` with startup validation
- Create `ai-service/.gitignore`
- Create `ai-service/render.yaml`
- Start the service and run all curl tests

---

## Step-by-Step Implementation

### Step 4.1 — Create Python virtual environment and install packages

```bash
cd smart-lms/ai-service
python -m venv venv

# Activate on macOS/Linux:
source venv/bin/activate
# Activate on Windows:
# venv\Scripts\activate

# Terminal prompt must now start with (venv)
pip install flask flask-cors google-generativeai python-dotenv gunicorn
pip freeze > requirements.txt
```

**Mandatory test after Step 4.1:**
```bash
python -c "import flask; import flask_cors; import google.generativeai; print('✅ All packages installed')"
# Must print: ✅ All packages installed
cat requirements.txt | grep -E "^(Flask|flask-cors|google-generativeai|gunicorn|python-dotenv)"
# Must show all 5 packages
```

---

### Step 4.2 — Create `ai-service/.env`

**File to create:** `smart-lms/ai-service/.env`

```env
GEMINI_API_KEY=paste-your-actual-gemini-api-key-here
PORT=5001
```

**Mandatory test after Step 4.2:**
```bash
cat .env | grep "GEMINI_API_KEY" | awk -F= '{print length($2) > 20 ? "✅ Key looks valid" : "❌ Key too short"}'
# Must print: ✅ Key looks valid
```

---

### Step 4.3 — Create `ai-service/.gitignore`

**File to create:** `smart-lms/ai-service/.gitignore`

```gitignore
venv/
__pycache__/
*.pyc
*.pyo
.env
.DS_Store
```

---

### Step 4.4 — Create `ai-service/app.py`

**File to create:** `smart-lms/ai-service/app.py`

> The `GEMINI_API_KEY` is validated at startup. If missing, the process exits immediately with a clear error. The `CI=true` environment variable skips this check in GitHub Actions so tests pass with a placeholder key.

```python
import os
import sys
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
is_ci   = os.environ.get("CI") == "true"

if not api_key and not is_ci:
    print("❌ ERROR: GEMINI_API_KEY is not set in your .env file", file=sys.stderr)
    print("   Get a free key at: https://aistudio.google.com/app/apikey", file=sys.stderr)
    sys.exit(1)

if api_key:
    genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel("gemini-1.5-flash") if api_key else None


def clean_json_response(text: str) -> str:
    """Remove markdown code fences that Gemini sometimes wraps around JSON."""
    text = text.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```\s*',     '', text)
    text = re.sub(r'\s*```$',     '', text)
    return text.strip()


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data          = request.get_json()
    lecture_notes = data.get('lecture_notes', '')
    num_questions = data.get('num_questions', 10)

    if not lecture_notes:
        return jsonify({"error": "lecture_notes is required"}), 400

    prompt = f"""
You are an expert educator. Generate {num_questions} multiple-choice questions based on the following lecture notes.

LECTURE NOTES:
{lecture_notes}

Return ONLY a JSON array with no extra text. Format:
[
  {{
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct_answer": "A) ...",
    "explanation": "..."
  }}
]
"""
    try:
        response  = model.generate_content(prompt)
        cleaned   = clean_json_response(response.text)
        questions = json.loads(cleaned)
        return jsonify({"questions": questions})
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to parse AI response: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/summarize', methods=['POST'])
def summarize():
    data    = request.get_json()
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "content is required"}), 400

    prompt = f"""
Summarize the following lecture content. Return ONLY a JSON object with no extra text:
{{
  "overview": "2-3 sentence high-level summary",
  "key_points": ["point 1", "point 2"],
  "important_terms": ["term: definition"]
}}

CONTENT:
{content}
"""
    try:
        response = model.generate_content(prompt)
        cleaned  = clean_json_response(response.text)
        return jsonify(json.loads(cleaned))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    data           = request.get_json()
    question       = data.get('question', '')
    lesson_context = data.get('lesson_context', '')
    history        = data.get('history', [])

    if not question:
        return jsonify({"error": "question is required"}), 400

    history_text = "\n".join(
        [f"{m['role'].upper()}: {m['content']}" for m in history[-6:]]
    )

    prompt = f"""
You are a helpful AI tutor. Answer ONLY based on the lesson content provided.
If the question is not covered in the lesson, say so clearly.

LESSON CONTENT:
{lesson_context}

CONVERSATION HISTORY:
{history_text}

STUDENT QUESTION: {question}

Provide a clear, educational answer:
"""
    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/analyze-student', methods=['POST'])
def analyze_student():
    data         = request.get_json()
    student_data = data.get('student_data', {})

    if not student_data:
        return jsonify({"error": "student_data is required"}), 400

    prompt = f"""
You are an academic advisor AI. Analyze this student's performance data and return ONLY a JSON object:
{{
  "overall_assessment": "...",
  "strengths": ["..."],
  "areas_to_improve": ["..."],
  "recommendations": ["..."],
  "risk_flag": "none"
}}
risk_flag must be one of: "none", "low", "medium", "high"

STUDENT DATA:
{json.dumps(student_data, indent=2)}
"""
    try:
        response = model.generate_content(prompt)
        cleaned  = clean_json_response(response.text)
        return jsonify(json.loads(cleaned))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, port=port)
```

---

### Step 4.5 — Create `ai-service/render.yaml`

**File to create:** `smart-lms/ai-service/render.yaml`

> This file tells Render.com how to build and run the AI service. The AI service deploys to Render (NOT Vercel) because Vercel's free tier has a 10-second timeout and Gemini API calls take 3–8 seconds.

```yaml
services:
  - type: web
    name: smart-lms-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

---

### Step 4.6 — Start the AI service and run all endpoint tests

```bash
# In ai-service/ with venv activated:
python app.py
# Must print: Running on http://127.0.0.1:5001
```

In a second terminal (with venv activated):

**Test 1 — Health:**
```bash
curl http://localhost:5001/health
# Expected: {"status":"ok"}
```

**Test 2 — Quiz generation:**
```bash
curl -X POST http://localhost:5001/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"lecture_notes":"Photosynthesis converts sunlight into glucose using chlorophyll in plant cells."}'
# Expected: {"questions":[{"question":"...","options":["A)...","B)...","C)...","D)..."],"correct_answer":"...","explanation":"..."},...]}
```

**Test 3 — Summarizer:**
```bash
curl -X POST http://localhost:5001/summarize \
  -H "Content-Type: application/json" \
  -d '{"content":"The water cycle involves evaporation, condensation, and precipitation. Water evaporates from oceans, forms clouds, and falls as rain."}'
# Expected: {"overview":"...","key_points":["...","..."],"important_terms":["..."]}
```

**Test 4 — Chatbot:**
```bash
curl -X POST http://localhost:5001/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is photosynthesis?","lesson_context":"Photosynthesis converts sunlight into glucose.","history":[]}'
# Expected: {"answer":"..."}
```

**Test 5 — Student analyzer:**
```bash
curl -X POST http://localhost:5001/analyze-student \
  -H "Content-Type: application/json" \
  -d '{"student_data":{"totalEnrollments":2,"completedLessons":3,"quizAttempts":[{"score":7,"totalQ":10}],"averageQuizScore":70}}'
# Expected: {"overall_assessment":"...","strengths":["..."],"areas_to_improve":["..."],"recommendations":["..."],"risk_flag":"none"}
```

**Mandatory test after Step 4.6:**
All 5 tests must return valid JSON responses. The quiz must contain a `questions` array. The summary must contain `overview`, `key_points`, and `important_terms`. The analysis must contain `risk_flag`.

---

## Files Created in Phase 4

| File | Purpose |
|---|---|
| `ai-service/venv/` | Python virtual environment (not committed) |
| `ai-service/requirements.txt` | Pinned Python dependencies |
| `ai-service/.env` | Gemini API key (not committed) |
| `ai-service/.gitignore` | Excludes venv, .env, and pycache |
| `ai-service/app.py` | Flask app with 4 AI endpoints + startup validation |
| `ai-service/render.yaml` | Render.com deployment configuration |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `ModuleNotFoundError: flask` | Virtual environment not activated — run `source venv/bin/activate` |
| `❌ ERROR: GEMINI_API_KEY is not set` | Check `.env` is in `ai-service/`, not in the project root |
| AI returns malformed JSON | The `clean_json_response()` function removes code fences; if still failing, print `response.text` to debug the raw AI output |
| Port 5001 already in use | Run `lsof -i :5001` (Mac/Linux) to find and kill the process |
| `json.JSONDecodeError` | Gemini returned non-JSON text; increase specificity in the prompt or retry |

## Completion Checklist — Phase 4

- [ ] `venv/` created and activatable
- [ ] All packages installed: `flask`, `flask-cors`, `google-generativeai`, `python-dotenv`, `gunicorn`
- [ ] `requirements.txt` generated with `pip freeze`
- [ ] `ai-service/.env` contains the real Gemini API key
- [ ] `ai-service/.gitignore` lists `venv/`, `.env`, `__pycache__/`
- [ ] Missing `GEMINI_API_KEY` causes immediate startup error with a clear message
- [ ] `GET /health` returns `{"status":"ok"}`
- [ ] `POST /generate-quiz` returns a `questions` array with `question`, `options`, `correct_answer`, `explanation`
- [ ] `POST /summarize` returns `overview`, `key_points`, `important_terms`
- [ ] `POST /chat` returns an `answer` field
- [ ] `POST /analyze-student` returns `risk_flag` (one of: `none`, `low`, `medium`, `high`)
- [ ] `render.yaml` created with correct build and start commands

---

---

# PHASE 5 — AI Bridge (Backend ↔ AI Service)

## Goal
Add a set of authenticated backend proxy routes that sit between the frontend and the AI service. The frontend must never call the AI service directly. All AI calls must pass through the backend, which validates the JWT, fetches any required database context, and forwards the request to the AI service. At the end of this phase, the AI bridge routes must work end-to-end and AI-generated quizzes must be saved to MongoDB.

## Prerequisites
- Phase 3 Completion Checklist: fully satisfied (backend auth and course/lesson routes working)
- Phase 4 Completion Checklist: fully satisfied (AI service running on port 5001)
- Both the backend (port 3001) and AI service (port 5001) must be running simultaneously

## User Action Required
No new credentials required.

## AI Agent Responsibilities
- Create `src/routes/ai.ts` with 4 proxy routes
- Update `src/app.ts` to register the AI route group (this is the final version of `app.ts`)
- Test all 4 AI bridge routes end-to-end with a running AI service
- Verify quiz documents appear in MongoDB Atlas

---

## Step-by-Step Implementation

### Step 5.1 — Create `backend/src/routes/ai.ts`

**File to create:** `smart-lms/backend/src/routes/ai.ts`

> The `AI_TIMEOUT` is set to 25 seconds because Gemini can be slow on the free tier. Quiz generation uses `findOneAndUpdate` with `upsert: true` so re-generating a quiz overwrites the previous one rather than creating duplicates. The student analyzer always analyzes the calling user's own data — the `studentId` comes from `req.user!.userId`, never from the request body.

```typescript
import { Router, Response } from 'express';
import axios from 'axios';
import Lesson      from '../models/Lesson';
import Quiz        from '../models/Quiz';
import Enrollment  from '../models/Enrollment';
import Progress    from '../models/Progress';
import QuizAttempt from '../models/QuizAttempt';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router     = Router();
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:5001';
const AI_TIMEOUT = 25000;

// POST /api/ai/generate-quiz — instructor only
router.post('/generate-quiz', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, lecture_notes } = req.body;
    if (!lessonId || !lecture_notes) {
      return res.status(400).json({ error: 'lessonId and lecture_notes are required' });
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/generate-quiz`,
      { lecture_notes },
      { timeout: AI_TIMEOUT }
    );
    const { questions } = aiResponse.data;

    const quiz = await Quiz.findOneAndUpdate(
      { lessonId },
      { questions },
      { upsert: true, new: true }
    );

    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

// POST /api/ai/summarize — any logged-in user
router.post('/summarize', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const aiResponse = await axios.post(
      `${AI_SERVICE}/summarize`,
      { content },
      { timeout: AI_TIMEOUT }
    );
    res.json(aiResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Summarization failed' });
  }
});

// POST /api/ai/chat — any logged-in user
router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { question, lessonId, history } = req.body;

    let lesson_context = '';
    if (lessonId) {
      const lesson = await Lesson.findById(lessonId).select('content title');
      lesson_context = lesson?.content || '';
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/chat`,
      { question, lesson_context, history: history || [] },
      { timeout: AI_TIMEOUT }
    );
    res.json(aiResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

// POST /api/ai/analyze-student — any logged-in user (analyzes own data only)
router.post('/analyze-student', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user!.userId;

    const enrollments  = await Enrollment.find({ studentId }).lean();
    const progress     = await Progress.find({ studentId }).lean();
    const quizAttempts = await QuizAttempt.find({ studentId })
      .sort({ attemptedAt: -1 })
      .limit(20)
      .lean();

    const student_data = {
      totalEnrollments: enrollments.length,
      completedLessons: progress.filter(p => p.completed).length,
      quizAttempts:     quizAttempts.map(a => ({ score: a.score, totalQ: a.totalQ })),
      averageQuizScore: quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, a) => sum + (a.score / a.totalQ * 100), 0) / quizAttempts.length
          )
        : 0
    };

    const aiResponse = await axios.post(
      `${AI_SERVICE}/analyze-student`,
      { student_data },
      { timeout: AI_TIMEOUT }
    );
    res.json(aiResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

export default router;
```

**Mandatory test after Step 5.1:**
```bash
npx tsc --noEmit 2>&1
# Must produce no output
```

---

### Step 5.2 — Update `backend/src/app.ts` — final version

This is the **final version** of `app.ts`. It will not be modified again after this step.

Replace the full content of `backend/src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB }  from './db';
import authRoutes     from './routes/auth';
import courseRoutes   from './routes/courses';
import lessonRoutes   from './routes/lessons';
import aiRoutes       from './routes/ai';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/ai',      aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
```

Restart the backend: `Ctrl+C` then `npm run dev`.

**Mandatory test after Step 5.2:**
```bash
npx tsc --noEmit 2>&1
# Must produce no output
curl http://localhost:3001/api/health
# Must return: {"status":"ok","timestamp":"..."}
```

---

### Step 5.3 — Run end-to-end AI bridge tests

Make sure both services are running:
- Terminal A: `cd backend && npm run dev`
- Terminal B: `cd ai-service && source venv/bin/activate && python app.py`

Run tests with real tokens from Phase 3:

**Test 1 — Quiz generation via backend (saves to MongoDB):**
```bash
curl -X POST http://localhost:3001/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -d '{"lessonId":"LESSON_ID","lecture_notes":"DNA is the molecule that carries genetic information in all living organisms."}'
# Expected: Quiz document with _id, lessonId, and questions array
```

After this test, open MongoDB Atlas → Browse Collections → `quizzes` collection — 1 document must appear with the AI-generated questions.

**Test 2 — Summarize:**
```bash
curl -X POST http://localhost:3001/api/ai/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{"content":"The mitochondria is the powerhouse of the cell. It produces ATP through cellular respiration."}'
# Expected: {"overview":"...","key_points":[...],"important_terms":[...]}
```

**Test 3 — Chat (with lessonId for context):**
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{"question":"What does DNA stand for?","lessonId":"LESSON_ID","history":[]}'
# Expected: {"answer":"..."}
```

**Test 4 — Student analysis:**
```bash
curl -X POST http://localhost:3001/api/ai/analyze-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN"
# Expected: {"overall_assessment":"...","strengths":[...],"areas_to_improve":[...],"recommendations":[...],"risk_flag":"none"}
```

**Test 5 — Unauthenticated AI request must return 401:**
```bash
curl -X POST http://localhost:3001/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"content":"test"}'
# Expected: {"error":"No token provided"}
```

**Mandatory test after Step 5.3:**
All 5 tests must return expected responses. A `quizzes` document must exist in MongoDB Atlas.

---

## Files Created in Phase 5

| File | Purpose |
|---|---|
| `backend/src/routes/ai.ts` | Backend proxy for all 4 AI endpoints |
| `backend/src/app.ts` | Final version — registers all 4 route groups |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `ECONNREFUSED` when calling AI | AI service is not running — start it with `python app.py` (venv activated) |
| 403 on `/api/ai/generate-quiz` | This route requires instructor or admin role — use an instructor token |
| Quiz not appearing in Atlas | Verify the `lessonId` in the request matches an actual `_id` in the `lessons` collection |
| AI request times out | Gemini can be slow; the 25-second timeout handles most cases. If it consistently times out, check your Gemini API quota |

## Completion Checklist — Phase 5

- [ ] `POST /api/ai/generate-quiz` calls the AI service and saves the quiz document to MongoDB `quizzes` collection
- [ ] `POST /api/ai/summarize` returns a summary object with `overview`, `key_points`, `important_terms`
- [ ] `POST /api/ai/chat` fetches lesson content from the database and returns an AI answer
- [ ] `POST /api/ai/analyze-student` aggregates the student's data and returns AI feedback with `risk_flag`
- [ ] Unauthenticated requests to all 4 AI routes return 401
- [ ] Student token on `/api/ai/generate-quiz` returns 403
- [ ] Quiz document appears in MongoDB Atlas `quizzes` collection after generation
- [ ] `npx tsc --noEmit` produces zero errors

---

---

# PHASE 6 — Frontend Setup + Routing

## Goal
Initialize the Next.js application with the full tech stack, configure Axios with JWT interceptors, set up the Zustand auth store with `restoreAuth()` for persistence, configure the backend proxy rewrite in `next.config.ts`, and create the landing page. At the end of this phase, the frontend must start without errors and the landing page must be visible in the browser.

## Prerequisites
- Phase 2 Completion Checklist: fully satisfied
- Backend running on port 3001

## User Action Required
No new credentials required. The frontend reads credentials via `NEXT_PUBLIC_BACKEND_URL` from `.env.local`.

## AI Agent Responsibilities
- Run `create-next-app` with the correct flags
- Install all additional npm packages
- Create `.env.local` with both backend URL variables
- Update `next.config.ts` to use `BACKEND_URL` (not `NEXT_PUBLIC_`) in rewrites, and `remotePatterns` for Cloudinary images
- Create `lib/api.ts` with `localStorage` SSR guard
- Create `lib/store.ts` with `restoreAuth()` action
- Create `components/Providers.tsx`
- Update `app/layout.tsx`
- Create `app/page.tsx` landing page
- Verify the app starts and the landing page renders

---

## Step-by-Step Implementation

### Step 6.1 — Initialize Next.js

```bash
cd smart-lms/frontend
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

> On Windows, run as a single line:
> `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`

Then install additional packages:
```bash
npm install axios zustand @tanstack/react-query react-hook-form zod @hookform/resolvers recharts lucide-react date-fns
```

**Mandatory test after Step 6.1:**
```bash
ls frontend/
# Must show: app/  components/  lib/  node_modules/  package.json  tailwind.config.ts  tsconfig.json  next.config.ts (or .js)

cat package.json | grep -E '"(axios|zustand|@tanstack|react-hook-form|zod)"'
# Must show all 5 packages
```

---

### Step 6.2 — Create `frontend/.env.local`

**File to create:** `smart-lms/frontend/.env.local`

> Two separate variables are required: `NEXT_PUBLIC_BACKEND_URL` is accessible in browser code; `BACKEND_URL` is used only on the server in `next.config.ts` rewrites.

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3001
```

**Mandatory test after Step 6.2:**
```bash
grep "BACKEND_URL" frontend/.env.local | wc -l
# Must return 2 (one NEXT_PUBLIC_, one without)
git status | grep ".env.local"
# Must show nothing — .env.local must be in .gitignore
```

---

### Step 6.3 — Update `frontend/next.config.ts`

Replace the full content of the existing `next.config.ts` (or `next.config.js`):

> The rewrite must use `process.env.BACKEND_URL` — NOT `process.env.NEXT_PUBLIC_BACKEND_URL`. Using `NEXT_PUBLIC_` in server-side rewrites is a common mistake that causes silent failures on Vercel. Image patterns must use `remotePatterns` (the `domains` array is deprecated).

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source:      '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/:path*`
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
```

**Mandatory test after Step 6.3:**
```bash
grep "BACKEND_URL" frontend/next.config.ts
# Must show: process.env.BACKEND_URL (NOT NEXT_PUBLIC_BACKEND_URL)
grep "remotePatterns" frontend/next.config.ts
# Must show the remotePatterns config
```

---

### Step 6.4 — Create `frontend/lib/api.ts`

```bash
mkdir -p smart-lms/frontend/lib
```

**File to create:** `smart-lms/frontend/lib/api.ts`

> The `localStorage` access is guarded by `typeof window !== 'undefined'` to prevent crashes during Next.js server-side rendering.

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Step 6.5 — Create `frontend/lib/store.ts`

**File to create:** `smart-lms/frontend/lib/store.ts`

> `restoreAuth()` reads both `token` and `user` from localStorage on page reload. It must be called in a `useEffect` on every page that requires authentication. This prevents the "flash of Loading..." on every refresh.

```typescript
import { create } from 'zustand';

interface User {
  id:    string;
  name:  string;
  email: string;
  role:  'student' | 'instructor' | 'admin';
}

interface AuthStore {
  user:        User | null;
  token:       string | null;
  setAuth:     (user: User, token: string) => void;
  logout:      () => void;
  restoreAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:  null,
  token: null,

  restoreAuth: () => {
    if (typeof window === 'undefined') return;
    const token   = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  }
}));
```

---

### Step 6.6 — Create `frontend/components/Providers.tsx`

```bash
mkdir -p smart-lms/frontend/components
```

**File to create:** `smart-lms/frontend/components/Providers.tsx`

```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000 }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

### Step 6.7 — Update `frontend/app/layout.tsx`

Replace the full content of `frontend/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title:       'Smart Academic Platform',
  description: 'AI-powered learning management system'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### Step 6.8 — Create `frontend/app/page.tsx`

**File to create:** `smart-lms/frontend/app/page.tsx`

```tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700">SmartLMS</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
            Log In
          </Link>
          <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Learn Smarter with <span className="text-indigo-600">AI-Powered</span> Education
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          AI-generated quizzes, instant doubt resolution, personalized progress analysis — all in one platform.
        </p>
        <Link href="/courses" className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700">
          Browse Courses →
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 pb-24">
        {[
          { title: '🤖 AI Quiz Generator', desc: 'Auto-generate MCQs from lecture notes in seconds.' },
          { title: '💬 AI Doubt Chatbot',  desc: 'Get instant answers grounded in your course material.' },
          { title: '📊 Progress Analyzer', desc: 'Personalized feedback and risk detection from your AI advisor.' }
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
```

---

### Step 6.9 — Start frontend and verify landing page

```bash
cd smart-lms/frontend
npm run dev
# Must print: ready started server on 0.0.0.0:3000
```

Open http://localhost:3000 in the browser.

**Mandatory test after Step 6.9:**
- The landing page must render with the SmartLMS navbar, hero text, and 3 feature cards
- No TypeScript or Tailwind errors in the terminal
- The "Log In" and "Get Started" links may show 404 — that is expected (pages built in Phase 7)
- Run: `npm run build 2>&1 | tail -5` — must show "Build finished" with no errors

---

## Files Created in Phase 6

| File | Purpose |
|---|---|
| `frontend/.env.local` | Frontend environment variables (never committed) |
| `frontend/next.config.ts` | Next.js config with API rewrite and Cloudinary image patterns |
| `frontend/lib/api.ts` | Axios instance with JWT interceptors and SSR guard |
| `frontend/lib/store.ts` | Zustand store with `restoreAuth()`, `setAuth()`, `logout()` |
| `frontend/components/Providers.tsx` | TanStack Query client provider |
| `frontend/app/layout.tsx` | Updated root layout with Providers wrapper |
| `frontend/app/page.tsx` | Landing page |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `Cannot find module '@/components/Providers'` | The `@/*` alias is in `tsconfig.json` — verify it was set by `create-next-app` |
| Landing page shows unstyled HTML | Tailwind config issue — run `npm install` again and check `globals.css` imports Tailwind |
| `next.config.ts` not found | `create-next-app` may have created `next.config.js` — rename it or convert the export syntax |
| `.env.local` not loading | The file must be in `frontend/` (same level as `package.json`), not in the project root |

## Completion Checklist — Phase 6

- [ ] `npm run dev` starts without TypeScript or Tailwind errors
- [ ] `http://localhost:3000` renders the landing page with 3 feature cards
- [ ] `lib/api.ts` has `typeof window !== 'undefined'` guard in the request interceptor
- [ ] `lib/store.ts` has `restoreAuth()` action and saves `user` to localStorage in `setAuth`
- [ ] `next.config.ts` uses `process.env.BACKEND_URL` (NOT `NEXT_PUBLIC_`) in rewrites
- [ ] `next.config.ts` uses `remotePatterns` (NOT deprecated `domains`)
- [ ] `components/Providers.tsx` wraps children with `QueryClientProvider`
- [ ] `.env.local` has both `NEXT_PUBLIC_BACKEND_URL` and `BACKEND_URL`
- [ ] `.env.local` is NOT tracked by git
- [ ] `npm run build` completes without errors

---

---

# PHASE 7 — Frontend Pages + AI Components

## Goal
Build all remaining pages and React components: login, register, dashboard, instructor panel, course list, course detail with AI quiz and chatbot, and the three shared AI components. At the end of this phase, the complete user journey from registration to quiz completion must work in the browser with all three services running.

## Prerequisites
- Phase 6 Completion Checklist: fully satisfied (frontend starts and shows landing page)
- Phase 2–5: backend and AI service running locally

## User Action Required
No new credentials required.

## AI Agent Responsibilities
- Create `components/AIQuiz.tsx` (role-aware: generate for instructors, fetch for students)
- Create `components/AIChatbot.tsx`
- Create `components/ProgressBar.tsx`
- Create `app/login/page.tsx` with password strength feedback
- Create `app/register/page.tsx` with client-side password validation
- Create `app/dashboard/page.tsx` with `restoreAuth()` call
- Create `app/instructor/page.tsx` with course and lesson creation UI
- Create `app/courses/page.tsx` with course listing
- Create `app/courses/[id]/page.tsx` with full lesson, quiz, and chatbot integration
- Run the complete end-to-end UI flow test

---

## Step-by-Step Implementation

### Step 7.1 — Create `frontend/components/AIQuiz.tsx`

**File to create:** `smart-lms/frontend/components/AIQuiz.tsx`

> Students **fetch** a pre-generated quiz via `GET /api/lessons/:id`. Only instructors **generate** a new one via `POST /api/ai/generate-quiz`. Never mix these up — generating is instructor-only on the backend.

```tsx
'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Question {
  question:       string;
  options:        string[];
  correct_answer: string;
  explanation:    string;
}

export default function AIQuiz({ lessonId, lessonContent, role }: {
  lessonId:      string;
  lessonContent: string;
  role:          'student' | 'instructor' | 'admin';
}) {
  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [selected,   setSelected]   = useState<Record<number, string>>({});
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [score,      setScore]      = useState(0);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-quiz', { lessonId, lecture_notes: lessonContent });
      setQuestions(res.data.questions);
      setSelected({});
      setSubmitted(false);
    } catch {
      alert('Failed to generate quiz. Make sure you are logged in as an instructor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lessons/${lessonId}`);
      if (res.data.quiz?.questions?.length > 0) {
        setQuestions(res.data.quiz.questions);
      } else {
        alert('No quiz available for this lesson yet. Ask your instructor to generate one first.');
      }
    } catch {
      alert('Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const correctCount = questions.filter((q, i) => selected[i] === q.correct_answer).length;
    setScore(correctCount);
    setSubmitted(true);
    try {
      await api.post(`/lessons/${lessonId}/quiz-attempt`, {
        answers: selected,
        score:   correctCount
      });
    } catch { /* Score display is more important than saving */ }
  };

  if (questions.length === 0) {
    return (
      <div className="mt-6 p-6 bg-indigo-50 rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-4">
          {role === 'student' ? '📝 Test Your Knowledge' : '🤖 Generate a Quiz for Students'}
        </h3>
        <button
          onClick={role === 'student' ? fetchQuiz : generateQuiz}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading
            ? '⏳ Loading...'
            : role === 'student' ? 'Load Quiz' : 'Generate AI Quiz'}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-bold">📝 AI-Generated Quiz</h3>
      {submitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-700">
            Score: {score}/{questions.length} ({Math.round(score / questions.length * 100)}%)
          </p>
        </div>
      )}
      {questions.map((q, i) => (
        <div key={i} className="p-5 bg-white border rounded-xl shadow-sm">
          <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => {
              let cls = 'w-full text-left px-4 py-2 rounded-lg border ';
              if (submitted) {
                if (opt === q.correct_answer)   cls += 'bg-green-100 border-green-400';
                else if (opt === selected[i])   cls += 'bg-red-100 border-red-400';
                else                            cls += 'border-gray-200';
              } else {
                cls += selected[i] === opt ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-50 border-gray-200';
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => !submitted && setSelected(p => ({ ...p, [i]: opt }))}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              💡 {q.explanation}
            </p>
          )}
        </div>
      ))}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selected).length < questions.length}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          Submit Answers
        </button>
      )}
      {submitted && (
        <button
          onClick={() => role === 'student' ? fetchQuiz() : generateQuiz()}
          className="w-full py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50"
        >
          🔄 {role === 'student' ? 'Reload Quiz' : 'Generate New Quiz'}
        </button>
      )}
    </div>
  );
}
```

**Mandatory test after Step 7.1:**
```bash
npx tsc --noEmit 2>&1 | head -5
# Must produce no output
```

---

### Step 7.2 — Create `frontend/components/AIChatbot.tsx`

**File to create:** `smart-lms/frontend/components/AIChatbot.tsx`

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function AIChatbot({ lessonId }: { lessonId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', {
        question: input,
        lessonId,
        history: messages
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg text-2xl hover:bg-indigo-700 z-50"
        title="Open AI Tutor"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border z-50">
      <div className="flex justify-between items-center p-4 bg-indigo-600 rounded-t-2xl">
        <span className="font-semibold text-white">🤖 AI Tutor</span>
        <button onClick={() => setOpen(false)} className="text-white hover:opacity-75">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">Ask me anything about this lesson!</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-xl text-sm text-gray-500">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Ask a question..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
        >
          →
        </button>
      </div>
    </div>
  );
}
```

---

### Step 7.3 — Create `frontend/components/ProgressBar.tsx`

**File to create:** `smart-lms/frontend/components/ProgressBar.tsx`

```tsx
export default function ProgressBar({ percentage, label }: { percentage: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
```

**Mandatory test after Step 7.3:**
```bash
npx tsc --noEmit 2>&1 | head -5
# Must produce no output
```

---

### Step 7.4 — Create `frontend/app/login/page.tsx`

```bash
mkdir -p smart-lms/frontend/app/login
```

**File to create:** `smart-lms/frontend/app/login/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router        = useRouter();
  const { setAuth }   = useAuthStore();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-indigo-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Log in to SmartLMS</h1>
        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          No account?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">Register here</Link>
        </p>
      </div>
    </main>
  );
}
```

---

### Step 7.5 — Create `frontend/app/register/page.tsx`

```bash
mkdir -p smart-lms/frontend/app/register
```

**File to create:** `smart-lms/frontend/app/register/page.tsx`

> Client-side password validation provides immediate feedback. The backend also validates — both checks are required.

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
  const router      = useRouter();
  const { setAuth } = useAuthStore();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState<'student' | 'instructor'>('student');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter and one number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-indigo-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Create an Account</h1>
        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Min 8 chars, 1 uppercase, 1 number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select value={role} onChange={e => setRole(e.target.value as 'student' | 'instructor')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
```

---

### Step 7.6 — Create `frontend/app/dashboard/page.tsx`

```bash
mkdir -p smart-lms/frontend/app/dashboard
```

**File to create:** `smart-lms/frontend/app/dashboard/page.tsx`

> `restoreAuth()` is called in `useEffect` to restore the user from localStorage after a page refresh. Without this, the user sees "Loading..." until `useEffect` runs.

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const { user, logout, restoreAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    restoreAuth();
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.push('/login');
  }, [router]);

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Welcome, {user.name}!</h1>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
          >
            Log Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-gray-600">
            Logged in as <span className="font-semibold text-indigo-600">{user.email}</span> · Role:{' '}
            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium capitalize">
              {user.role}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/courses">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <h2 className="text-xl font-bold mb-2">📚 Browse Courses</h2>
              <p className="text-gray-600 text-sm">Explore all available courses and enroll.</p>
            </div>
          </Link>

          {user.role === 'instructor' && (
            <Link href="/instructor">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-bold mb-2">🎓 Instructor Panel</h2>
                <p className="text-gray-600 text-sm">Create and manage your courses and lessons.</p>
              </div>
            </Link>
          )}

          {user.role === 'admin' && (
            <Link href="/admin">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-bold mb-2">⚙️ Admin Portal</h2>
                <p className="text-gray-600 text-sm">Manage users and platform settings.</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
```

---

### Step 7.7 — Create `frontend/app/instructor/page.tsx`

```bash
mkdir -p smart-lms/frontend/app/instructor
```

**File to create:** `smart-lms/frontend/app/instructor/page.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function InstructorPage() {
  const { user, restoreAuth } = useAuthStore();
  const router       = useRouter();
  const queryClient  = useQueryClient();

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc,  setCourseDesc]  = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => { restoreAuth(); }, []);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.push('/login');
  }, [router]);

  const { data: courses } = useQuery({
    queryKey: ['my-courses'],
    queryFn:  () => api.get('/courses').then(r => r.data),
    enabled:  !!user
  });

  const createCourseMutation = useMutation({
    mutationFn: () => api.post('/courses', { title: courseTitle, description: courseDesc }),
    onSuccess: (res) => {
      setStatusMsg(`✅ Course "${res.data.title}" created! Now publish it below.`);
      setCourseTitle('');
      setCourseDesc('');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (err: any) => setStatusMsg(`❌ ${err.response?.data?.error || 'Failed to create course'}`)
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/courses/${id}/publish`, { isPublished: true }),
    onSuccess: () => {
      setStatusMsg('✅ Course published! Students can now see it.');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: () => api.post('/lessons', {
      courseId: selectedCourseId,
      title:    lessonTitle,
      content:  lessonContent
    }),
    onSuccess: () => {
      setStatusMsg('✅ Lesson created!');
      setLessonTitle('');
      setLessonContent('');
    },
    onError: (err: any) => setStatusMsg(`❌ ${err.response?.data?.error || 'Failed to create lesson'}`)
  });

  if (!user) return <div className="p-8 text-center">Loading...</div>;
  if (user.role !== 'instructor' && user.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access denied — instructors only.</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">🎓 Instructor Panel</h1>
      <p className="text-gray-500 mb-8">Create courses and lessons here.</p>

      {statusMsg && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm">{statusMsg}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Create a New Course</h2>
        <input
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
          placeholder="Course title (required)"
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        <textarea
          value={courseDesc}
          onChange={e => setCourseDesc(e.target.value)}
          placeholder="Course description (optional)"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        <button
          onClick={() => createCourseMutation.mutate()}
          disabled={!courseTitle || createCourseMutation.isPending}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
        </button>
      </div>

      {courses && courses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Courses</h2>
          {courses.map((c: any) => (
            <div key={c._id} className="flex justify-between items-center py-3 border-b last:border-0">
              <span className="font-medium">{c.title}</span>
              {c.isPublished ? (
                <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Published</span>
              ) : (
                <button
                  onClick={() => publishMutation.mutate(c._id)}
                  className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                  Publish
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Add a Lesson to a Course</h2>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">— Select a course —</option>
            {courses.map((c: any) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <input
            value={lessonTitle}
            onChange={e => setLessonTitle(e.target.value)}
            placeholder="Lesson title (required)"
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <textarea
            value={lessonContent}
            onChange={e => setLessonContent(e.target.value)}
            placeholder="Lesson content — the AI uses this to generate quizzes and answer questions"
            rows={6}
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button
            onClick={() => createLessonMutation.mutate()}
            disabled={!selectedCourseId || !lessonTitle || createLessonMutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {createLessonMutation.isPending ? 'Adding...' : 'Add Lesson'}
          </button>
        </div>
      )}
    </main>
  );
}
```

---

### Step 7.8 — Create `frontend/app/courses/[id]/page.tsx`

```bash
mkdir -p smart-lms/frontend/app/courses/\[id\]
```

**File to create:** `smart-lms/frontend/app/courses/[id]/page.tsx`

> The enroll button uses `!progress.isEnrolled` — not `progress.completedLessons === 0`. Using completed lessons to infer enrollment status is incorrect and causes false 409 errors.

```tsx
'use client';
import { useParams }  from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState }  from 'react';
import { useRouter }  from 'next/navigation';
import api            from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AIQuiz         from '@/components/AIQuiz';
import AIChatbot      from '@/components/AIChatbot';
import ProgressBar    from '@/components/ProgressBar';

export default function CourseDetailPage() {
  const { id }         = useParams();
  const { user, restoreAuth } = useAuthStore();
  const router         = useRouter();
  const queryClient    = useQueryClient();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => { restoreAuth(); }, []);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn:  () => api.get(`/courses/${id}`).then(r => r.data)
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', id],
    queryFn:  () => api.get(`/courses/${id}/progress`).then(r => r.data),
    enabled:  !!user
  });

  const enrollMutation = useMutation({
    mutationFn: () => api.post(`/courses/${id}/enroll`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['progress', id] })
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => api.post(`/lessons/${lessonId}/complete`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['progress', id] })
  });

  if (isLoading) return <div className="p-8 text-center">Loading course...</div>;
  if (!course)   return <div className="p-8 text-center text-red-600">Course not found.</div>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        <p className="text-sm text-indigo-600 mt-1">By {course.instructor?.name}</p>
      </div>

      {user?.role === 'student' && progress && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
          <ProgressBar
            percentage={progress.percentage}
            label={`Progress: ${progress.completedLessons}/${progress.totalLessons} lessons`}
          />
          {!progress.isEnrolled && (
            <button
              onClick={() => enrollMutation.mutate()}
              disabled={enrollMutation.isPending}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll in this Course'}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="font-bold text-lg mb-3">Lessons</h2>
          <div className="space-y-2">
            {course.lessons?.map((lesson: any, idx: number) => (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                  activeLesson?._id === lesson._id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white hover:bg-indigo-50 border-gray-200'
                }`}
              >
                {idx + 1}. {lesson.title}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {activeLesson ? (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">{activeLesson.title}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                {activeLesson.content || 'No content yet.'}
              </p>

              {user?.role === 'student' && (
                <button
                  onClick={() => completeMutation.mutate(activeLesson._id)}
                  disabled={completeMutation.isPending}
                  className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {completeMutation.isPending ? 'Saving...' : '✅ Mark as Complete'}
                </button>
              )}

              {user && (
                <AIQuiz
                  lessonId={activeLesson._id}
                  lessonContent={activeLesson.content || ''}
                  role={user.role}
                />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-sm text-center text-gray-400">
              Select a lesson from the list to start reading.
            </div>
          )}
        </div>
      </div>

      {user && activeLesson && <AIChatbot lessonId={activeLesson._id} />}
    </main>
  );
}
```

---

### Step 7.9 — Create `frontend/app/courses/page.tsx`

```bash
mkdir -p smart-lms/frontend/app/courses
```

**File to create:** `smart-lms/frontend/app/courses/page.tsx`

```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import api  from '@/lib/api';
import Link from 'next/link';

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn:  () => api.get('/courses').then(r => r.data)
  });

  if (isLoading) return <div className="p-8 text-center">Loading courses...</div>;
  if (error)     return <div className="p-8 text-center text-red-600">Failed to load courses.</div>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      {courses?.length === 0 && (
        <p className="text-gray-500">No courses published yet. Check back soon!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses?.map((course: any) => (
          <Link key={course._id} href={`/courses/${course._id}`}>
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
              <h2 className="font-bold text-lg mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <p className="text-xs text-indigo-600">By {course.instructor?.name}</p>
              <p className="text-xs text-gray-400 mt-1">{course._count?.lessons || 0} lessons</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

**Mandatory test after Step 7.9:**
```bash
cd smart-lms/frontend
npx tsc --noEmit 2>&1 | head -10
# Must produce no output
npm run build 2>&1 | tail -5
# Must show successful build with no errors
```

---

### Step 7.10 — Run the complete end-to-end UI flow test

Start all three services:
```bash
# Terminal 1 — AI Service
cd ai-service && source venv/bin/activate && python app.py

# Terminal 2 — Backend
cd backend && npm run dev

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Walk through this sequence in the browser and check each item:

```
□ http://localhost:3000 → Landing page loads with navbar and 3 feature cards
□ Click "Get Started" → /register form appears
□ Register as a student (password: Test@1234) → redirected to /dashboard
□ Dashboard shows name, email, and "student" role badge
□ Log out → redirected to landing page
□ Register as an instructor in an incognito window → redirected to /dashboard
□ Dashboard shows "Instructor Panel" link
□ Go to /instructor → create a course → click "Publish" → add a lesson with real content (at least 2 sentences)
□ Go to /courses → published course appears in the grid
□ Click the course → /courses/[id] loads with lesson sidebar
□ Click the lesson → content appears in the right panel
□ As instructor: click "Generate AI Quiz" → questions appear with options
□ Switch to student window → go to the same course → "Enroll in this Course" button visible
□ Click "Enroll" → button disappears, progress bar shows 0%
□ Open the lesson → click "Load Quiz" → same questions appear
□ Answer all questions → click "Submit Answers" → score appears with green/red highlights
□ Click "Mark as Complete" → progress bar increases to 100%
□ Open chatbot (💬 button) → ask a question about the lesson → AI responds
□ Refresh the page → user is still logged in (no flash of "Loading...")
□ In instructor window: check MongoDB Atlas → quizzes collection has 1 document
```

**Mandatory test after Step 7.10:**
All 20 checklist items above must be verified. None may be skipped.

---

## Files Created in Phase 7

| File | Purpose |
|---|---|
| `frontend/components/AIQuiz.tsx` | Role-aware quiz component (generate vs. fetch) |
| `frontend/components/AIChatbot.tsx` | Floating chatbot UI with conversation history |
| `frontend/components/ProgressBar.tsx` | Animated progress bar with percentage label |
| `frontend/app/login/page.tsx` | Login form with error display |
| `frontend/app/register/page.tsx` | Registration with client-side password validation |
| `frontend/app/dashboard/page.tsx` | Protected dashboard with role-based links |
| `frontend/app/instructor/page.tsx` | Course and lesson creation UI |
| `frontend/app/courses/page.tsx` | Published course listing |
| `frontend/app/courses/[id]/page.tsx` | Course detail with lessons, progress, quiz, chatbot |

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| User is null after page refresh | Verify `restoreAuth()` is called in `useEffect` on the dashboard page |
| Quiz button gives 403 for students | The `AIQuiz` component calls `fetchQuiz` for students and `generateQuiz` for instructors — verify the `role` prop is passed correctly |
| Enroll button still shows after enrolling | Verify the backend progress route returns `isEnrolled: !!enrollment` |
| `/instructor` shows 404 | Check that the file is at `app/instructor/page.tsx` (not `app/instructor/index.tsx`) |
| Chatbot closes when AI is thinking | The `open` state persists independently from `loading` — this is correct behavior |

## Completion Checklist — Phase 7

- [ ] Login and register pages work with strong password validation (both client and server)
- [ ] Dashboard shows the correct role badge and role-specific navigation links
- [ ] `/instructor` page allows creating courses, publishing them, and adding lessons
- [ ] `/courses` shows the published course list with lesson count
- [ ] `/courses/[id]` shows lessons, progress bar, `isEnrolled`-based enroll button, AI quiz, and chatbot
- [ ] `AIQuiz` shows "Load Quiz" for students and "Generate AI Quiz" for instructors
- [ ] AI chatbot sends messages and receives AI answers correctly
- [ ] User stays logged in after page refresh (no flash of Loading)
- [ ] `npx tsc --noEmit` produces zero errors
- [ ] `npm run build` completes without errors

---

---

# PHASE 8 — Full Local Integration Test

## Goal
Verify that all three services work together end-to-end without errors. This phase introduces no new code. Its sole purpose is systematic verification: every service, every API endpoint category, every UI flow, and every known edge case must be tested and confirmed working before proceeding to deployment.

## Prerequisites
- Phases 0–7 Completion Checklists: all fully satisfied
- All three services must be able to run simultaneously

## User Action Required
No credentials required. Instruct the user to have all three terminals open.

## AI Agent Responsibilities
- Start all three services simultaneously
- Walk through the full debugging checklist
- Identify and fix any failures before marking the phase complete
- Do not proceed to Phase 9 if any item in the checklist is unresolved

---

## Step-by-Step Implementation

### Step 8.1 — Start all three services simultaneously

```bash
# Terminal 1 — AI Service
cd smart-lms/ai-service
source venv/bin/activate    # (Windows: venv\Scripts\activate)
python app.py
# Must print: Running on http://127.0.0.1:5001

# Terminal 2 — Backend
cd smart-lms/backend
npm run dev
# Must print: ✅ Backend running on http://localhost:3001

# Terminal 3 — Frontend
cd smart-lms/frontend
npm run dev
# Must print: ready started server on 0.0.0.0:3000
```

**Mandatory test after Step 8.1:**
```bash
curl http://localhost:5001/health    # → {"status":"ok"}
curl http://localhost:3001/api/health  # → {"status":"ok","timestamp":"..."}
# Browser: http://localhost:3000 → landing page renders
```

All three must succeed before proceeding.

---

### Step 8.2 — Execute the full integration test sequence

Run every item below and confirm the expected result. If any fails, fix it before continuing to the next item.

**Service Health:**
```
□ http://localhost:5001/health → {"status":"ok"}
□ http://localhost:3001/api/health → {"status":"ok"}
□ http://localhost:3000 → landing page renders
```

**Authentication Flow:**
```
□ POST /api/auth/register (student, password "Test@1234") → 201 with token
□ POST /api/auth/register (instructor) → 201 with token
□ POST /api/auth/login (correct password) → 200 with token
□ POST /api/auth/login (wrong password) → 401
□ POST /api/auth/register (password "abc") → 400 with clear error
□ GET /api/auth/me (valid token) → user object
□ GET /api/auth/me (no token) → 401
```

**Course and Lesson API:**
```
□ POST /api/courses (instructor token) → 201 with course object
□ PATCH /api/courses/:id/publish (instructor token) → isPublished: true
□ GET /api/courses (no auth) → array with the published course
□ POST /api/lessons (instructor token) → 201 with lesson
□ GET /api/lessons/:id (student token) → lesson with quiz: null
□ POST /api/courses (student token) → 403
□ GET /api/courses/:id/progress (student token) → includes isEnrolled: false
□ POST /api/courses/:id/enroll (student token) → 201
□ GET /api/courses/:id/progress (student token) → isEnrolled: true
□ POST /api/courses/:id/enroll again (same student) → 409
```

**AI Bridge:**
```
□ POST /api/ai/generate-quiz (instructor token, real lessonId) → quiz with questions array
□ MongoDB Atlas → quizzes collection → document appears
□ POST /api/ai/summarize (student token) → overview, key_points, important_terms
□ POST /api/ai/chat (student token, lessonId) → answer field
□ POST /api/ai/analyze-student (student token) → risk_flag field
□ All AI routes with no token → 401
□ POST /api/ai/generate-quiz with student token → 403
```

**Frontend UI:**
```
□ /register → form works, redirects to /dashboard
□ /dashboard → shows user name, email, role badge
□ Refresh /dashboard → user still shown (restoreAuth working)
□ /instructor (as instructor) → course creation form visible
□ Create course, publish, add lesson with real text content
□ /courses → published course card visible
□ /courses/[id] → lesson list in sidebar, content panel on right
□ Click lesson → lesson content visible
□ As instructor: Generate AI Quiz → questions appear
□ As student: Load Quiz → same questions appear
□ Student: answer all questions, Submit → score shown with green/red
□ Student: Mark as Complete → progress bar increases
□ Student: open chatbot → send question → AI responds
□ Log out → redirected to /
□ No CORS errors in browser console (F12 → Console tab)
□ No 500 errors in Terminal 2 during normal use
```

**Mandatory test after Step 8.2:**
Every item above must be checked. No items may remain unchecked.

---

## Debugging Reference

| Problem | Where to Look | Fix |
|---|---|---|
| CORS error in browser | Browser console (red text) | Check `FRONTEND_URL` in backend `.env` matches `http://localhost:3000` exactly |
| 401 Unauthorized on API calls | Network tab → request headers | Token is missing — check Zustand `setAuth` saves to localStorage |
| AI service not responding | Terminal 1 | Is venv activated? Is the Gemini key in `.env`? |
| MongoDB connection error | Terminal 2 | Check `MONGODB_URI` in `backend/.env` |
| Enroll button shows after enrolling | Network tab → `/courses/:id/progress` response | Confirm `isEnrolled: true` appears after enrolling |
| Quiz missing for student | MongoDB Atlas → quizzes collection | Instructor must generate the quiz first |
| User flashes "Loading..." then disappears | Browser | `restoreAuth()` not called in `useEffect` — check dashboard and course pages |
| AI quiz gives 403 to instructor | Check the token used | Must be instructor or admin token |

## Completion Checklist — Phase 8

- [ ] All three services start simultaneously without crashing
- [ ] All items in Step 8.2 integration test sequence are checked and confirmed
- [ ] No CORS errors in the browser console
- [ ] No 500 errors in the backend terminal during the test sequence
- [ ] AI quiz generation works and saves to MongoDB
- [ ] Student progress updates correctly after marking lessons complete
- [ ] Enroll button disappears after enrolling
- [ ] Page refresh preserves login state

---

---

# PHASE 9 — Deploy (Render + Vercel)

## Goal
Deploy all three services to production in the correct order: AI Service → Backend → Frontend. At the end of this phase, three live URLs must be active and the full user journey must work on the deployed URLs.

## Prerequisites
- Phase 8 Completion Checklist: fully satisfied — the full local integration test must pass
- GitHub repository created and all code pushed to `main` branch
- Render account and Vercel account connected to GitHub

## User Action Required

> **The AI agent must STOP and verify all of the following before starting deployment.**

The agent must collect and confirm:
1. **GitHub repository URL** — the remote must be added and code pushed to `main`
2. **MongoDB Atlas** → Network Access must be set to Allow Access from Anywhere (`0.0.0.0/0`)
3. **All production credentials** (same values as in local `.env` files):
   - MongoDB URI
   - JWT Secret
   - Gemini API key
   - Cloudinary Cloud Name, API Key, API Secret

If any item is missing, stop and ask.

## AI Agent Responsibilities
- Confirm code is pushed to GitHub
- Guide deployment in the required order: Render (AI) → Vercel (backend) → Vercel (frontend)
- Update `FRONTEND_URL` on the backend after the frontend URL is known
- Run smoke tests against all three live URLs

---

## Step-by-Step Implementation

### Step 9.1 — Push all code to GitHub

```bash
cd smart-lms
git add .
git commit -m "feat: complete Smart LMS ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/smart-lms.git
git push -u origin main
```

**Mandatory test after Step 9.1:**
```bash
git log --oneline | head -3
# Must show the latest commits
git remote -v
# Must show origin pointing to the GitHub repo
```
Verify on github.com that all files are visible in the repository.

---

### Step 9.2 — Allow all IPs in MongoDB Atlas

1. Go to MongoDB Atlas → your cluster → **Network Access**
2. Click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**

**Mandatory test after Step 9.2:**
```
In Atlas Network Access list, "0.0.0.0/0" must appear with status "Active"
```

---

### Step 9.3 — Deploy AI Service to Render.com

> The AI service deploys to Render, NOT Vercel. This is a hard constraint due to Vercel's 10-second timeout.

1. Go to render.com → **New** → **Web Service** → **Connect a repository** → select `smart-lms`
2. Set **Root Directory**: `ai-service`
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `gunicorn app:app`
5. Add Environment Variable: `GEMINI_API_KEY` = (the real key)
6. Click **Create Web Service**
7. Wait for the build to complete (2–5 minutes)
8. Copy the service URL (e.g. `https://smart-lms-ai.onrender.com`)

**Mandatory test after Step 9.3:**
```bash
curl https://YOUR_RENDER_URL.onrender.com/health
# Expected: {"status":"ok"}
```
If the first request takes 30 seconds, that is normal — free Render services sleep when idle.

---

### Step 9.4 — Deploy Backend to Vercel

1. Go to vercel.com → **New Project** → Import `smart-lms` repo
2. Set **Root Directory**: `backend`
3. Add all environment variables:
   - `MONGODB_URI` — full Atlas connection string
   - `JWT_SECRET` — same 64-char secret as local `.env`
   - `AI_SERVICE_URL` — the Render URL from Step 9.3
   - `FRONTEND_URL` — `https://smart-lms.vercel.app` (or your expected frontend URL)
   - `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` — your Cloudinary API key
   - `CLOUDINARY_API_SECRET` — your Cloudinary API secret
   - `NODE_ENV` — `production`
4. Click **Deploy**
5. Copy the backend URL (e.g. `https://smart-lms-backend.vercel.app`)

**Mandatory test after Step 9.4:**
```bash
curl https://YOUR_BACKEND_URL.vercel.app/api/health
# Expected: {"status":"ok","timestamp":"..."}

curl -X POST https://YOUR_BACKEND_URL.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Test@1234"}'
# Expected: {"user":{...},"token":"eyJ..."}
```

---

### Step 9.5 — Deploy Frontend to Vercel

1. **New Project** → same `smart-lms` repo → **Root Directory**: `frontend`
2. Add environment variables:
   - `NEXT_PUBLIC_BACKEND_URL` — the backend Vercel URL from Step 9.4
   - `BACKEND_URL` — same backend Vercel URL (both variables are required)
3. Click **Deploy**
4. Copy the frontend URL (e.g. `https://smart-lms.vercel.app`)

**Mandatory test after Step 9.5:**
```
Open the frontend Vercel URL in a browser → landing page must render
```

---

### Step 9.6 — Update backend CORS with the real frontend URL

1. Go to Vercel → **backend project** → Settings → Environment Variables
2. Update `FRONTEND_URL` to the actual frontend Vercel URL from Step 9.5
3. Go to Deployments → click the three-dot menu on the latest deployment → **Redeploy**

**Mandatory test after Step 9.6:**
```
Open the frontend URL → Open browser DevTools (F12) → Console tab
Register a new account on the live site → No CORS errors must appear in the console
```

---

### Step 9.7 — Full live smoke test

```bash
BACKEND=https://YOUR_BACKEND_URL.vercel.app
AI=https://YOUR_AI_URL.onrender.com

curl $AI/health                            # → {"status":"ok"}
curl $BACKEND/api/health                   # → {"status":"ok"}

# Register on live site (browser) → Login → Create course → Generate AI quiz
# All steps from Phase 8.2 UI checklist must work on the live URLs
```

**Mandatory test after Step 9.7:**
All three live URLs must return their health responses. The full UI flow must complete without errors on the production URLs.

---

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| AI quiz times out on the live site | Verify the AI service is on Render, not Vercel. If it's on Vercel, re-deploy it to Render |
| Backend returns CORS error on the live site | `FRONTEND_URL` env var on Vercel doesn't match the actual frontend URL — update and redeploy the backend |
| `MongoNotConnectedError` on first live request | The lazy-connection middleware in `db.ts` handles this; verify it wasn't modified |
| Frontend shows a blank page on Vercel | Check the browser console for errors; verify `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL` are both set |
| Render service returns 502 | The service may still be building (wait 2–3 minutes) or the Gemini key is missing |

## Completion Checklist — Phase 9

- [ ] All code pushed to GitHub `main` branch
- [ ] MongoDB Atlas Network Access set to `0.0.0.0/0`
- [ ] AI service deployed to Render and `GET /health` returns 200
- [ ] Backend deployed to Vercel and `GET /api/health` returns 200
- [ ] Frontend deployed to Vercel and landing page renders
- [ ] `FRONTEND_URL` on backend updated to the actual frontend URL and backend redeployed
- [ ] Register and login work on the live site
- [ ] AI quiz generation works on the live site
- [ ] No CORS errors in the browser console on the live site
- [ ] Render service URL, Vercel backend URL, and Vercel frontend URL recorded in `README.md`

---

---

# PHASE 10 — CI/CD Pipeline (GitHub Actions)

## Goal
Set up an automated pipeline that runs TypeScript type-checks and Flask route tests on every push to `main`, and triggers production deployments only when all tests pass. At the end of this phase, a push to `main` must automatically test all three services and deploy them sequentially.

## Prerequisites
- Phase 9 Completion Checklist: fully satisfied — all 3 services deployed
- GitHub repository accessible at `github.com/YOUR_USERNAME/smart-lms`

## User Action Required

> **The AI agent must STOP and wait for the user to complete these steps.**

The following require human action in a web browser:

1. **Vercel Deploy Hooks** (one per service):
   - Backend project → Settings → Git → Deploy Hooks → Add Hook → name: `main-deploy`, branch: `main` → copy URL
   - Frontend project → same steps → copy URL

2. **Render Deploy Hook**:
   - Render AI service → Settings → Deploy Hook → copy URL

3. **Add GitHub Secrets** (GitHub repo → Settings → Secrets → Actions → New repository secret):
   - `VERCEL_BACKEND_DEPLOY_HOOK` → paste Vercel backend hook URL
   - `VERCEL_FRONTEND_DEPLOY_HOOK` → paste Vercel frontend hook URL
   - `RENDER_AI_DEPLOY_HOOK` → paste Render hook URL

The agent must confirm all 3 secrets are added before creating the workflow file.

## AI Agent Responsibilities
- Create `.github/workflows/deploy.yml`
- Push the workflow file to `main`
- Monitor the first workflow run in GitHub Actions
- Confirm all test jobs pass green and the deploy job triggers

---

## Step-by-Step Implementation

### Step 10.1 — Create `.github/workflows/deploy.yml`

**File to create:** `smart-lms/.github/workflows/deploy.yml`

> The `CI: "true"` environment variable in the AI service test step skips the Gemini API key validation in `app.py`, so the route tests pass with a placeholder key. The Render smoke test uses `|| echo` (not `|| exit 1`) because free Render services sleep when idle and a sleeping service is not a deployment failure.

```yaml
name: Test and Deploy Smart LMS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - name: Install backend deps
        working-directory: ./backend
        run: npm ci
      - name: TypeScript type check
        working-directory: ./backend
        run: npx tsc --noEmit

  test-ai-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      - name: Install Python deps
        working-directory: ./ai-service
        run: pip install -r requirements.txt
      - name: Verify Flask routes
        working-directory: ./ai-service
        run: |
          python -c "
          from app import app
          client = app.test_client()
          response = client.get('/health')
          assert response.status_code == 200, 'Health check failed'
          rules = [str(r) for r in app.url_map.iter_rules()]
          assert '/generate-quiz' in rules
          assert '/summarize' in rules
          assert '/chat' in rules
          assert '/analyze-student' in rules
          print('All routes verified.')
          "
        env:
          GEMINI_API_KEY: placeholder_for_ci
          CI: "true"

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install frontend deps
        working-directory: ./frontend
        run: npm ci
      - name: Build Next.js app
        working-directory: ./frontend
        run: npm run build
        env:
          NEXT_PUBLIC_BACKEND_URL: https://smart-lms-backend.vercel.app
          BACKEND_URL: https://smart-lms-backend.vercel.app

  deploy:
    needs: [test-backend, test-ai-service, test-frontend]
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: Deploy AI Service to Render
        run: curl -s -X POST "${{ secrets.RENDER_AI_DEPLOY_HOOK }}"
      - name: Deploy Backend to Vercel
        run: curl -s -X POST "${{ secrets.VERCEL_BACKEND_DEPLOY_HOOK }}"
      - name: Deploy Frontend to Vercel
        run: curl -s -X POST "${{ secrets.VERCEL_FRONTEND_DEPLOY_HOOK }}"
      - name: Wait for deploys to complete
        run: sleep 60
      - name: Smoke test backend
        run: |
          curl -f https://smart-lms-backend.vercel.app/api/health || exit 1
          echo "✅ Backend healthy!"
      - name: Smoke test AI service
        run: |
          curl -f https://smart-lms-ai.onrender.com/health || echo "⚠️  AI service may be sleeping (normal on free Render tier)"
```

> **Note:** Replace the hardcoded URLs in the smoke test steps (`smart-lms-backend.vercel.app` and `smart-lms-ai.onrender.com`) with the actual URLs from Phase 9.

---

### Step 10.2 — Push the workflow and verify the first run

```bash
cd smart-lms
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions test and deploy pipeline"
git push origin main
```

**Mandatory test after Step 10.2:**
1. Go to `github.com/YOUR_USERNAME/smart-lms` → **Actions** tab
2. Wait for the workflow run to appear and complete
3. Verify:
   ```
   □ test-backend job → ✅ green
   □ test-ai-service job → ✅ green
   □ test-frontend job → ✅ green
   □ deploy job → runs after all 3 test jobs pass
   □ Render and Vercel trigger confirmation in the deploy job log
   ```

All 5 items must be green before this phase is marked complete.

---

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `test-ai-service` fails with "API key not set" | Verify `CI: "true"` is in the `env` section under the "Verify Flask routes" step |
| `deploy` job runs even when tests fail | The `needs:` line ensures this can't happen — verify it lists all 3 test jobs |
| Render smoke test fails the workflow | It should use `|| echo` (not `|| exit 1`) — free tier sleep is a warning, not a failure |
| Secret not found during deploy job | Secret names are case-sensitive in GitHub — verify they match exactly |
| `npm ci` fails in CI | Ensure `package-lock.json` exists in both `backend/` and `frontend/` — commit it if missing |

## Completion Checklist — Phase 10

- [ ] Vercel deploy hooks created for backend and frontend (2 hooks total)
- [ ] Render deploy hook created for AI service
- [ ] All 3 GitHub secrets set: `VERCEL_BACKEND_DEPLOY_HOOK`, `VERCEL_FRONTEND_DEPLOY_HOOK`, `RENDER_AI_DEPLOY_HOOK`
- [ ] `.github/workflows/deploy.yml` pushed to `main`
- [ ] GitHub Actions workflow runs automatically on push
- [ ] `test-backend` job passes (TypeScript type-check green)
- [ ] `test-ai-service` job passes (all 4 Flask routes verified)
- [ ] `test-frontend` job passes (Next.js build succeeds)
- [ ] `deploy` job triggers only after all 3 test jobs pass
- [ ] Smoke tests confirm backend live URL is healthy after deploy

---

---

# Project Complete — Final Summary

The Smart Academic Platform is now built and deployed. Below is a record of everything that was produced.

## Delivered Architecture

```
smart-lms/
├── frontend/              ← Next.js + TypeScript + Tailwind CSS (Vercel)
│   ├── app/               ← App Router pages (login, register, dashboard, courses, instructor)
│   ├── components/        ← AIQuiz, AIChatbot, ProgressBar, Providers
│   └── lib/               ← api.ts (Axios), store.ts (Zustand)
│
├── backend/               ← Node.js + Express + TypeScript (Vercel)
│   ├── src/
│   │   ├── models/        ← 8 Mongoose schemas (User, Course, Lesson, Enrollment,
│   │   │                     Progress, Quiz, QuizAttempt, Certificate)
│   │   ├── routes/        ← auth.ts, courses.ts, lessons.ts, ai.ts
│   │   └── middleware/    ← auth.ts (authenticate + authorize)
│   └── api/               ← Vercel serverless entry
│
├── ai-service/            ← Python + Flask + Gemini (Render.com)
│   └── app.py             ← /generate-quiz, /summarize, /chat, /analyze-student
│
└── .github/workflows/     ← GitHub Actions CI/CD pipeline
    └── deploy.yml
```

## Key Architecture Decisions (Never Change Without Approval)

| Decision | Reason |
|---|---|
| AI service on Render, not Vercel | Vercel free tier has a 10-second timeout; Gemini calls take 3–8 seconds |
| Lazy DB connection in `db.ts` | Vercel serverless cold starts require reconnecting on every invocation |
| Frontend never calls AI service directly | Security: all AI requests are authenticated by the backend proxy |
| `instructorId` from JWT, not request body | Security: prevents instructors from impersonating each other |
| `isEnrolled` field in progress response | Correctness: `completedLessons === 0` is not the same as "not enrolled" |
| `QuestionSchema` typed (not `any[]`) | Data integrity: validates AI output before storing in MongoDB |
| `restoreAuth()` in every protected page | UX: prevents the "flash of Loading..." on every page refresh |
| `BACKEND_URL` (not `NEXT_PUBLIC_`) in rewrites | Correctness: `NEXT_PUBLIC_` variables are inlined at build time and don't work in server-side rewrites on Vercel |

## All 23 Audit Fixes Applied

| ID | Issue | Status |
|---|---|---|
| CRITICAL-1 | `create-next-app@14` → `@latest` | ✅ Fixed |
| CRITICAL-2 | `NEXT_PUBLIC_*` in `next.config.ts` rewrites → `BACKEND_URL` | ✅ Fixed |
| CRITICAL-2 | `images.domains` deprecated → `remotePatterns` | ✅ Fixed |
| CRITICAL-3 | AI service on Vercel (10s timeout) → Render.com | ✅ Fixed |
| CRITICAL-4 | Top-level `connectDB()` → lazy middleware pattern | ✅ Fixed |
| CRITICAL-5 | `/me` manually decoded JWT → uses `authenticate` middleware | ✅ Fixed |
| CRITICAL-6 | Duplicate `createdAt`/`updatedAt` in interfaces | ✅ Fixed |
| HIGH-1 | `role: string` → `role: 'student' \| 'instructor' \| 'admin'` with `enum` | ✅ Fixed |
| HIGH-2 | `questions: any[]` → typed `QuestionSchema` | ✅ Fixed |
| HIGH-3 | Zustand doesn't restore `user` on refresh → `restoreAuth()` | ✅ Fixed |
| HIGH-4 | `AIQuiz` calls instructor-only generate for students → split paths | ✅ Fixed |
| HIGH-5 | No password validation → backend regex + frontend check | ✅ Fixed |
| HIGH-6 | Enroll button used `completedLessons === 0` → uses `isEnrolled` | ✅ Fixed |
| HIGH-7 | `images.domains` deprecated → `remotePatterns` (covered with CRITICAL-2) | ✅ Fixed |
| MEDIUM-1 | Missing VS Code + extensions guidance | ✅ Fixed |
| MEDIUM-2 | `start` script `dist/src/index.js` → `dist/index.js` | ✅ Fixed |
| MEDIUM-3 | No `GEMINI_API_KEY` startup validation in `app.py` | ✅ Fixed |
| MEDIUM-4 | No guidance to restart backend after adding new route | ✅ Fixed |
| MEDIUM-5 | Missing `NODE_ENV=production` in Vercel backend env | ✅ Fixed |
| MEDIUM-6 | CI fails with placeholder API key → `CI: "true"` skip | ✅ Fixed |
| LOW-1 | Security comment added: `instructorId` from JWT not body | ✅ Fixed |
| LOW-2 | `localStorage` in Axios interceptor crashes SSR → guarded | ✅ Fixed |
| LOW-3 | No `/instructor` page → fully built in Phase 7 | ✅ Fixed |
| LOW-4 | Note about all-services rebuild on every push | ✅ Fixed |

## Live URLs (Fill In After Phase 9)

| Service | Live URL |
|---|---|
| Frontend | `https://_____________________.vercel.app` |
| Backend | `https://_____________________.vercel.app` |
| AI Service | `https://_____________________.onrender.com` |

## Demo Accounts (Create After Phase 9)

Create via `POST /api/auth/register` on the live backend URL:

```
Student:    demo.student@smartlms.com  / Demo@1234
Instructor: demo.teacher@smartlms.com / Demo@1234
```

---

*Smart Academic Platform — AI Agent Execution Guide v2.0*
*Single source of truth. Follow phases sequentially. Never skip steps. Always test before proceeding.*
