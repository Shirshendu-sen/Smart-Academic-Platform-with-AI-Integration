# Smart Academic Platform — Deployment Guide

## Architecture Overview

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Frontend   │       │   Backend    │       │  AI Service  │
│  (Vercel)    │──────▶│  (Render)    │──────▶│  (Render)    │
│  Next.js     │       │  Express+Prisma│      │  Flask+Gemini│
└──────────────┘       └──────────────┘       └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  Neon        │
                       │  PostgreSQL  │
                       └──────────────┘
```

- **Frontend** → Vercel (free tier, automatic CI/CD from GitHub) — **TO DEPLOY**
- **Backend** → Render (already deployed ✅)
- **AI Service** → Render (free tier, Python web service) — **TO DEPLOY**
- **Database** → Neon PostgreSQL (already set up ✅)

---

## Prerequisites

1. **GitHub account** — all services deploy from a GitHub repo
2. **Render account** — [render.com](https://render.com) (sign up with GitHub)
3. **Vercel account** — [vercel.com](https://vercel.com) (sign up with GitHub)
4. **Gemini API key** — [aistudio.google.com](https://aistudio.google.com/apikey)
5. **Your backend URL** — already deployed on Render (e.g. `https://smart-lms-backend.onrender.com`)

---

## Step 1: Deploy AI Service on Render

### Option A: Manual Setup

1. Go to [render.com](https://render.com) → **Dashboard** → **New** → **Web Service**
2. Connect your GitHub repo
3. Fill in:
   - **Name:** `smart-lms-ai`
   - **Runtime:** Python
   - **Region:** Same as your backend
   - **Branch:** `main`
   - **Root Directory:** `ai-service` ← **IMPORTANT!** (not the repo root)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`
   - **Plan:** Free
4. Add **Environment Variables** (under **Advanced** → **Add Environment Variable**):

   | Key | Value |
   |-----|-------|
   | `GEMINI_API_KEY` | *(your Gemini API key from Google AI Studio)* |
   | `BACKEND_URL` | *(your already-deployed backend URL, e.g. `https://smart-lms-backend.onrender.com`)* |
   | `PORT` | `10000` |

5. Click **Create Web Service**
6. Wait for the build to complete (~1-2 minutes)
7. Note your AI service URL: `https://smart-lms-ai.onrender.com`

### Option B: Blueprint Setup (using render.yaml)

1. Go to [render.com](https://render.com) → **Dashboard** → **New** → **Blueprint**
2. Select your GitHub repo
3. Render will read `render.yaml` and create the AI service automatically
4. You still need to manually set:
   - `GEMINI_API_KEY` — your Gemini API key
   - `BACKEND_URL` — your already-deployed backend URL

### Verify AI Service

```bash
curl https://smart-lms-ai.onrender.com/health
# Expected: {"status":"ok","model":"gemini-2.5-flash"}
```

---

## Step 2: Update Backend Environment Variables

Go to your **already-deployed backend** on Render → **Environment** tab, and add/update:

| Key | Value |
   |-----|-------|
| `AI_SERVICE_URL` | `https://smart-lms-ai.onrender.com` *(your new AI service URL)* |
| `FRONTEND_URL` | *(leave empty for now — update after Step 3)* |

After updating env vars, Render will **auto-redeploy** the backend.

---

## Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Dashboard** → **Add New** → **Project**
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `frontend` ← **IMPORTANT!** Click "Edit" and set this
   - **Build Command:** `next build` (default, keep it)
   - **Output Directory:** `.next` (default, keep it)
4. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_BACKEND_URL` | *(your already-deployed backend URL, e.g. `https://smart-lms-backend.onrender.com`)* |

5. Click **Deploy**
6. Wait for the build (~1-2 minutes)
7. Note your frontend URL: `https://your-app-name.vercel.app`

---

## Step 4: Update Backend FRONTEND_URL

Go back to your **backend** on Render → **Environment** tab:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-app-name.vercel.app` *(your Vercel frontend URL)* |

Render will auto-redeploy the backend again.

---

## Step 5: Verify Everything Works

### Test the Backend Health Check
```bash
curl https://smart-lms-backend.onrender.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test the AI Service Health Check
```bash
curl https://smart-lms-ai.onrender.com/health
# Expected: {"status":"ok","model":"gemini-2.5-flash"}
```

### Test the Frontend
Open your Vercel URL in the browser.

### Test Registration
```bash
curl -X POST https://smart-lms-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## Environment Variables Summary

### Backend (already deployed on Render — update these)
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | *(already set — Neon PostgreSQL URL)* |
| `JWT_SECRET` | *(already set)* |
| `AI_SERVICE_URL` | `https://smart-lms-ai.onrender.com` ← **NEW** |
| `FRONTEND_URL` | `https://your-app.vercel.app` ← **NEW** |
| `NODE_ENV` | `production` *(already set)* |

### AI Service (new — deploy on Render)
| Variable | Value |
|----------|--------|
| `GEMINI_API_KEY` | *(your Gemini API key)* |
| `BACKEND_URL` | `https://smart-lms-backend.onrender.com` |
| `PORT` | `10000` |

### Frontend (new — deploy on Vercel)
| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://smart-lms-backend.onrender.com` |

---

## Troubleshooting

### AI Service won't start
- Check that `GEMINI_API_KEY` is set
- Check build logs for pip install errors
- The `--timeout 120` flag in gunicorn is needed because Gemini API calls can be slow

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is set in Vercel
- Check that the backend CORS allows your Vercel URL
- The backend's CORS config already allows all `.vercel.app` subdomains

### 503 errors on AI endpoints
- The AI service may be spinning down (free tier sleeps after 15 min)
- First request after idle takes ~30 seconds
- Consider upgrading to a paid plan if you need always-on availability

### CORS errors in browser
- The AI service CORS now uses regex `r"https://.*\.vercel\.app"` to match all Vercel subdomains
- The backend CORS also allows all `.vercel.app` subdomains
- If you still get CORS errors, check that `BACKEND_URL` and `FRONTEND_URL` env vars are set correctly

---

## Post-Deployment Checklist

- [ ] AI service health check returns `{"status":"ok"}`
- [ ] Backend `AI_SERVICE_URL` env var updated
- [ ] Frontend deployed on Vercel
- [ ] Backend `FRONTEND_URL` env var updated
- [ ] Frontend loads in browser
- [ ] User registration works
- [ ] User login works
- [ ] AI quiz generation works
- [ ] AI summarization works
- [ ] AI chat works
- [ ] AI student analysis works
