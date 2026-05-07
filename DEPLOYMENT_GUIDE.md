# 🚀 Smart Academic Platform — Deployment Guide

> **Frontend** → Vercel  
> **Backend** → Render (Web Service) **or** Vercel (Serverless)  
> **AI Service** → Render (Web Service) **or** Vercel (Serverless)  
> **Database** → Render (PostgreSQL) or External (Neon / Supabase)

---

## 📋 Prerequisites

| Requirement | Details |
|---|---|
| GitHub account | Your code must be pushed to a GitHub repository |
| Vercel account | [vercel.com/signup](https://vercel.com/signup) — sign up with GitHub |
| Render account | [render.com/register](https://render.com/register) — sign up with GitHub (only if deploying backend/AI to Render) |
| Gemini API Key | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — free tier available |

> ⚠️ **About Cloudinary:** The backend `package.json` lists `cloudinary` as a dependency, but **no backend code currently uses it**. You do NOT need Cloudinary env vars unless you add image upload functionality later.

---

## ⚠️ Important: Duplicate `smart-lms/` Directory

This repository contains a **duplicate** `smart-lms/` subdirectory with the same code as the root-level `backend/`, `ai-service/`, and `frontend/` folders. When deploying:

- Use the **root-level** directories (`backend/`, `ai-service/`, `frontend/`) as your Root Directory
- **Ignore** the `smart-lms/` directory — it should not be deployed
- If you want to clean up, you can delete the `smart-lms/` folder entirely

---

## 🗺️ Deployment Order (IMPORTANT)

Deploy in this exact order because each service depends on the previous one's URL:

```
1️⃣ PostgreSQL Database  →  2️⃣ Backend (Render or Vercel)  →  3️⃣ AI Service (Render or Vercel)  →  4️⃣ Frontend (Vercel)
```

---

## Step 1 — Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

> **Note:** Make sure `.env` files are in `.gitignore` (they already are). Never commit secrets.

---

## Step 2 — Create PostgreSQL Database

### Option A: Render PostgreSQL (Recommended for simplicity)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name:** `smart-lms-db`
   - **Region:** Choose closest to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Plan:** Free (or Starter for production)
4. Click **Create Database**
5. ⏳ Wait for it to be created (~2 minutes)
6. Once created, copy the **Internal Database URL** (starts with `postgresql://...`)
   - This will be your `DATABASE_URL` for the backend

### Option B: Neon (Free, serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → Sign up
2. Create a new project
3. Copy the connection string — this is your `DATABASE_URL`

### Option C: Supabase (Free tier)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create a new project
3. Go to **Settings** → **Database** → Copy the **Connection string** (URI format)

> 💡 Save your `DATABASE_URL` somewhere — you'll need it in Step 3.

---

## Step 3 — Deploy Backend

You have two options: **Render** (persistent server, recommended) or **Vercel** (serverless, already configured).

### Option A: Deploy Backend on Render (Recommended)

#### 3A.1 Create the Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
   - If you don't see it, click **+ Connect account** and authorize Render
4. Select your repo

#### 3A.2 Configure the Service

| Setting | Value |
|---|---|
| **Name** | `smart-lms-backend` |
| **Region** | Same as your database |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npx prisma generate && npx tsc` |
| **Start Command** | `npx prisma migrate deploy && node dist/src/index.js` |
| **Plan** | Free (or Starter for production) |

> ⚠️ **Root Directory MUST be `backend`** — this tells Render to look inside the `backend/` folder.

#### 3A.3 Add Environment Variables

Click **Advanced** → **Add Environment Variable** and add ALL of these:

| Key | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/dbname?sslmode=require` | From Step 2 |
| `JWT_SECRET` | A random 64-character string | Generate: `openssl rand -hex 32` or use [random.org](https://www.random.org/strings/) |
| `AI_SERVICE_URL` | `http://localhost:5001` | **Temporarily** — update after Step 4 |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Temporarily** — update after Step 5 |
| `NODE_ENV` | `production` | |

> ⚠️ **Do NOT set `PORT` manually on Render.** Render auto-assigns the `PORT` environment variable. The backend code in [`index.ts`](backend/src/index.ts:3) reads `process.env.PORT` automatically. Hardcoding `PORT=10000` can cause the service to fail.

> 💡 For `JWT_SECRET`, generate a strong random string. Example:  
> Run in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

> 💡 The backend uses [`prisma.config.ts`](backend/prisma.config.ts) to read `DATABASE_URL` from the environment. Make sure this file is present in the `backend/` directory.

#### 3A.4 Deploy

1. Click **Create Web Service**
2. ⏳ Wait for the build to complete (~3-5 minutes)
3. Once deployed, you'll get a URL like: `https://smart-lms-backend.onrender.com`
4. Test it: visit `https://smart-lms-backend.onrender.com/api/health`
   - You should see: `{"status":"ok","timestamp":"..."}`

> ⚠️ **If the build fails**, check the logs. Common issues:
> - Missing environment variables
> - Prisma generate fails → make sure `DATABASE_URL` is set
> - TypeScript errors → check the build logs

#### 3A.5 Run Database Migrations

The `Start Command` already includes `npx prisma migrate deploy`, which runs migrations on every deploy. But if you need to run them manually:

1. Go to your backend service on Render
2. Click **Shell** (or use the manual deploy → **Clear build cache** and redeploy)
3. Or run locally with the production DATABASE_URL:
   ```bash
   cd backend
   DATABASE_URL="your-production-db-url" npx prisma migrate deploy
   ```

### Option B: Deploy Backend on Vercel (Serverless)

The backend already has a [`vercel.json`](backend/vercel.json) and [`api/index.ts`](backend/api/index.ts) configured for Vercel serverless deployment.

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
4. Add the same environment variables as above (except `PORT` — not needed on Vercel)
5. Click **Deploy**

> ⚠️ **Limitations of Vercel serverless for the backend:**
> - No persistent connections (each request spins up a cold function)
> - 10-second timeout on Hobby plan (AI proxy calls may exceed this)
> - Prisma migrations must be run separately (not in the build command)
> - **Render is recommended** for the backend due to long-running AI proxy requests

---

## Step 4 — Deploy AI Service

You have two options: **Render** (persistent server, recommended) or **Vercel** (serverless, already configured).

### Option A: Deploy AI Service on Render (Recommended)

#### 4A.1 Create the Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect the same GitHub repository
4. Select your repo

#### 4A.2 Configure the Service

| Setting | Value |
|---|---|
| **Name** | `smart-lms-ai-service` |
| **Region** | Same as backend |
| **Branch** | `main` |
| **Root Directory** | `ai-service` |
| **Runtime** | **Python 3** |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
| **Plan** | Free (or Starter for production) |

> ⚠️ **Root Directory MUST be `ai-service`**

> 💡 `--timeout 120` is important because Gemini API calls can take up to 60+ seconds.

#### 4A.3 Add Environment Variables

| Key | Value | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Your Gemini API key | From [aistudio.google.com](https://aistudio.google.com/apikey) |

> ⚠️ **Do NOT set `PORT` manually on Render.** Render auto-assigns the `PORT` environment variable. The AI service code in [`app.py`](ai-service/app.py:283) reads `os.getenv("PORT", 5001)` automatically. The gunicorn `--bind 0.0.0.0:$PORT` in the Start Command uses Render's assigned PORT.

#### 4A.4 Deploy

1. Click **Create Web Service**
2. ⏳ Wait for the build (~2-3 minutes)
3. Once deployed, you'll get a URL like: `https://smart-lms-ai-service.onrender.com`
4. Test it: visit `https://smart-lms-ai-service.onrender.com/health`
   - You should see: `{"status":"ok","model":"gemini-2.5-flash"}`

> ⚠️ The health check endpoint is `/health` (not `/`). The root path `/` has no route handler and will return 404.

#### 4A.5 Update Backend's AI_SERVICE_URL

Now that you have the AI service URL, go back to your **backend** service on Render:

1. Go to **Environment** tab
2. Update `AI_SERVICE_URL` to: `https://smart-lms-ai-service.onrender.com`
3. Click **Save Changes** — this will trigger a redeploy

### Option B: Deploy AI Service on Vercel (Serverless)

The AI service already has a [`vercel.json`](ai-service/vercel.json) configured for Vercel serverless deployment.

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `ai-service`
   - **Framework Preset:** Other
4. Add environment variable: `GEMINI_API_KEY`
5. Click **Deploy**

> ⚠️ **Limitations of Vercel serverless for the AI service:**
> - 10-second timeout on Hobby plan (Gemini API calls often exceed this)
> - Cold starts on every request
> - **Render is recommended** for the AI service due to long-running Gemini API calls

---

## Step 5 — Deploy Frontend on Vercel

### 5.1 Import the Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. If you don't see it, click **Adjust GitHub App Permissions** and authorize

### 5.2 Configure the Project

| Setting | Value |
|---|---|
| **Project Name** | `smart-academic-platform` |
| **Framework Preset** | **Next.js** (auto-detected) |
| **Root Directory** | `frontend` ← **CLICK "Edit" AND SET THIS!** |
| **Build Command** | `next build` (default) |
| **Output Directory** | (leave default) |

> ⚠️ **Root Directory MUST be `frontend`** — Click the **Edit** button next to Root Directory and type `frontend`

### 5.3 Add Environment Variables

Click **Environment Variables** and add:

| Key | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `https://smart-lms-backend.onrender.com` | Your Render backend URL from Step 3 |

> 💡 **You do NOT need `NEXT_PUBLIC_AI_SERVICE_URL`.** The frontend never calls the AI service directly. All AI requests go through the backend's `/api/ai/*` routes, which proxy to the AI service. The frontend's [`api.ts`](frontend/lib/api.ts:6) uses `baseURL: '/api'`, and Next.js rewrites in [`next.config.ts`](frontend/next.config.ts:12) proxy `/api/*` to the backend.

> 💡 The `NEXT_PUBLIC_BACKEND_URL` is used by Next.js rewrites (in [`next.config.ts`](frontend/next.config.ts:13)) to proxy `/api/*` requests to the backend. This means the browser never makes cross-origin requests — Next.js server acts as a reverse proxy.

### 5.4 Deploy

1. Click **Deploy**
2. ⏳ Wait for the build (~2-3 minutes)
3. Once deployed, you'll get a URL like: `https://smart-academic-platform.vercel.app`

### 5.5 Update Backend's FRONTEND_URL

Go back to your **backend** service on Render:

1. Go to **Environment** tab
2. Update `FRONTEND_URL` to: `https://smart-academic-platform.vercel.app`
3. Click **Save Changes** — this triggers a redeploy

---

## Step 6 — Verify AI Service CORS

The AI service's CORS configuration in [`app.py`](ai-service/app.py:14) allows `.vercel.app` origins:

```python
CORS(app, origins=[
    "http://localhost:3001",
    "https://*.vercel.app"
])
```

> ⚠️ **Note:** The `https://*.vercel.app` wildcard pattern may not work with all CORS libraries. Flask-CORS does NOT natively support wildcard subdomains with `https://*.vercel.app`. If you have CORS issues between the backend and AI service, update the AI service CORS to include the specific backend Render URL:

```python
CORS(app, origins=[
    "http://localhost:3001",
    "https://smart-lms-backend.onrender.com",
    "https://smart-academic-platform.vercel.app"
])
```

Or use the `supports_credentials` and regex pattern approach:

```python
CORS(app, origins=[
    "http://localhost:3001",
], resources={r"/*": {"origins": re.compile(r".*\.vercel\.app$")}})
```

---

## ✅ Final Verification

After all services are deployed, test each one:

### Test Backend Health
```bash
curl https://smart-lms-backend.onrender.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test AI Service
```bash
curl https://smart-lms-ai-service.onrender.com/health
# Expected: {"status":"ok","model":"gemini-2.5-flash"}
```

### Test Frontend
1. Visit `https://smart-academic-platform.vercel.app`
2. Try registering a new account
3. Try logging in
4. Try creating a course (as instructor)
5. Try generating an AI quiz

---

## 🔧 Architecture After Deployment

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                            │
│                  https://smart-academic-platform.vercel.app       │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ All requests go to /api/* (same origin)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                              │
│              Next.js + React + TailwindCSS                        │
│                                                                  │
│  next.config.ts rewrites:                                        │
│  /api/:path* → https://smart-lms-backend.onrender.com/api/:path* │
│                                                                  │
│  NOTE: Frontend does NOT call the AI service directly.           │
│  All AI requests go through /api/ai/* → backend → AI service.    │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ API calls (proxied)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND (Render Web Service)                    │
│              Express.js + Prisma ORM                              │
│           https://smart-lms-backend.onrender.com                  │
│                                                                  │
│  Routes: /api/auth, /api/courses, /api/lessons, /api/ai          │
│  /api/ai/* routes proxy to the AI service using AI_SERVICE_URL   │
└────────┬─────────────────────────────────────┬───────────────────┘
         │                                     │
         │ DB queries                          │ AI requests (via axios)
         ▼                                     ▼
┌──────────────────────┐        ┌──────────────────────────────────┐
│  PostgreSQL (Render) │        │  AI SERVICE (Render Web Service) │
│  smart-lms-db        │        │  Flask + Google Gemini API       │
│                      │        │  https://smart-lms-ai-service    │
│                      │        │    .onrender.com                 │
└──────────────────────┘        └──────────────────────────────────┘
```

---

## 🔄 Redeploying After Changes

### Frontend (Vercel)
- **Automatic:** Push to `main` branch → Vercel auto-deploys
- **Manual:** Go to Vercel dashboard → your project → **Deployments** → **Redeploy**

### Backend (Render)
- **Automatic:** Push to `main` branch → Render auto-deploys
- **Manual:** Go to Render dashboard → your service → **Manual Deploy** → **Deploy latest commit**

### AI Service (Render)
- Same as backend

---

## 🐛 Common Issues & Fixes

### 1. CORS Errors in Browser Console

**Symptom:** `Access-Control-Allow-Origin` errors

**Fix:**
- Make sure `FRONTEND_URL` in the backend matches your Vercel URL exactly (including `https://`)
- Make sure the backend's CORS config allows `.vercel.app` (it already does in [`app.ts`](backend/src/app.ts:31))
- If using a custom domain, add it to the CORS allowed origins
- **Note:** The backend's CORS in [`app.ts`](backend/src/app.ts:26) checks `origin.endsWith('.vercel.app')`, which works for all Vercel deployment URLs

### 2. Prisma Client Not Generated

**Symptom:** `Cannot find module '@prisma/client'` or `PrismaClient is not a constructor`

**Fix:**
- Make sure your Build Command includes `npx prisma generate`
- Current build command: `npm install && npx prisma generate && npx tsc`
- The backend uses the `@prisma/adapter-pg` adapter (see [`prisma.ts`](backend/src/lib/prisma.ts:3)), which requires both `@prisma/client` and `pg` packages

### 3. Database Migration Fails

**Symptom:** `P3005` error or tables not found

**Fix:**
- Run migrations manually in the Render Shell:
  ```bash
  npx prisma migrate deploy
  ```
- Or use `npx prisma db push` (for development only — not recommended for production)
- Make sure `DATABASE_URL` is set correctly and includes `?sslmode=require`

### 4. AI Service Timeout

**Symptom:** 504 Gateway Timeout on AI endpoints

**Fix:**
- The `gunicorn` start command already has `--timeout 120`
- If still timing out, increase to `--timeout 180`
- Gemini API can be slow on cold starts
- The backend's AI route in [`ai.ts`](backend/src/routes/ai.ts:12) has a 120-second axios timeout

### 5. Render Free Tier Cold Starts

**Symptom:** First request takes 30-60 seconds

**Fix:**
- This is normal for Render free tier — services spin down after 15 min of inactivity
- Upgrade to Starter plan ($7/month) for always-on service
- Or use a cron job (like [cron-job.org](https://cron-job.org)) to ping your service every 14 minutes

### 6. Frontend Shows Blank Page

**Symptom:** White screen, no content

**Fix:**
- Check browser console for errors
- Make sure `NEXT_PUBLIC_BACKEND_URL` is set correctly in Vercel
- Make sure the backend is running and accessible
- After changing env vars on Vercel, you MUST redeploy

### 7. Environment Variable Not Taking Effect

**Fix:**
- **Vercel:** Changing env vars requires a redeploy. Go to **Deployments** → **Redeploy**
- **Render:** Changing env vars auto-triggers a redeploy

### 8. AI Service Returns 404 on Root Path

**Symptom:** Visiting `https://smart-lms-ai-service.onrender.com/` returns 404

**Fix:**
- This is expected — the AI service has no route handler for `/`
- Use `/health` to test: `https://smart-lms-ai-service.onrender.com/health`
- Functional endpoints: `/generate-quiz`, `/summarize`, `/chat`, `/analyze-student`

---

## 💰 Cost Estimate

| Service | Free Tier | Paid Alternative |
|---|---|---|
| Vercel (Frontend) | ✅ Free (100GB bandwidth) | Pro $20/month |
| Render Backend | ✅ Free (750 hrs/month) | Starter $7/month (always on) |
| Render AI Service | ✅ Free (750 hrs/month) | Starter $7/month (always on) |
| Render PostgreSQL | ✅ Free (expires in 90 days) | Starter $7/month (persistent) |
| Gemini API | ✅ Free tier available | Pay-as-you-go |

> ⚠️ **Render free tier limitations:**
> - Services spin down after 15 min of inactivity (30s cold start)
> - 750 hours/month total (enough for 1 backend + 1 AI service)
> - Free PostgreSQL expires after 90 days — upgrade to paid before then

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is a strong, random 64-character string (not "secret123")
- [ ] No `.env` files committed to GitHub
- [ ] `DATABASE_URL` uses `sslmode=require`
- [ ] Gemini API key is kept private
- [ ] `NODE_ENV` is set to `production` on backend
- [ ] CORS is configured to only allow your Vercel domain
- [ ] `PORT` is NOT hardcoded — let Render auto-assign it

---

## 📝 Quick Reference — All URLs

After deployment, your URLs will look like:

| Service | URL |
|---|---|
| Frontend | `https://smart-academic-platform.vercel.app` |
| Backend | `https://smart-lms-backend.onrender.com` |
| Backend Health | `https://smart-lms-backend.onrender.com/api/health` |
| AI Service | `https://smart-lms-ai-service.onrender.com` |
| AI Service Health | `https://smart-lms-ai-service.onrender.com/health` |
| Database | Internal Render URL (not publicly accessible) |

---

## 🎯 Summary of Environment Variables

### Frontend (Vercel)
```
NEXT_PUBLIC_BACKEND_URL=https://smart-lms-backend.onrender.com
```

> **Note:** `NEXT_PUBLIC_AI_SERVICE_URL` is NOT needed. The frontend never calls the AI service directly — all AI requests go through the backend's `/api/ai/*` routes.

### Backend (Render)
```
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
JWT_SECRET=<your-64-char-random-string>
AI_SERVICE_URL=https://smart-lms-ai-service.onrender.com
FRONTEND_URL=https://smart-academic-platform.vercel.app
NODE_ENV=production
```

> **Note:** Do NOT set `PORT` manually. Render auto-assigns it.  
> **Note:** Cloudinary env vars (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are NOT currently used by any backend code. Only add them if you implement image upload functionality.

### AI Service (Render)
```
GEMINI_API_KEY=<your-gemini-api-key>
```

> **Note:** Do NOT set `PORT` manually. Render auto-assigns it. The gunicorn start command uses `$PORT` which Render provides automatically.
