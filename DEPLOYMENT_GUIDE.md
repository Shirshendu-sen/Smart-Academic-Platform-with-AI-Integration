# Smart Academic Platform — Complete Deployment Guide

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

- **Frontend** → Vercel (free tier, automatic CI/CD from GitHub)
- **Backend** → Render (free tier, Node.js web service)
- **AI Service** → Render (free tier, Python web service)
- **Database** → Neon PostgreSQL (free tier, serverless Postgres)

---

## Prerequisites

1. **GitHub account** — all services deploy from a GitHub repo
2. **Render account** — [render.com](https://render.com) (sign up with GitHub)
3. **Vercel account** — [vercel.com](https://vercel.com) (sign up with GitHub)
4. **Neon account** — [neon.tech](https://neon.tech) (sign up with GitHub)
5. **Gemini API key** — [aistudio.google.com](https://aistudio.google.com/apikey)

---

## Step 1: Push Code to GitHub

If you haven't already, push your project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then push
git remote add origin https://github.com/YOUR_USERNAME/smart-academic-platform.git
git branch -M main
git push -u origin main
```

**Important:** Make sure `.env` files are NOT committed (they're in `.gitignore`).

---

## Step 2: Set Up Neon PostgreSQL

1. Go to [neon.tech](https://neon.tech) → **Dashboard** → **Create Project**
2. Fill in:
   - **Project Name:** `smart-lms-db`
   - **Region:** Choose closest to your users
   - **Postgres Version:** 16 (default)
3. Click **Create Project**
4. Wait for the project to be ready (~10 seconds)
5. Go to **Connection Details** → Copy the **Connection string**
   - It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
6. **Save this URL** — you'll need it for the backend `DATABASE_URL` env var

> ✅ Neon free tier gives 0.5 GB storage, always-on compute, and no 90-day expiry (unlike Render's free PostgreSQL).

---

## Step 3: Deploy Backend on Render

1. Go to [render.com](https://render.com) → **Dashboard** → **New** → **Web Service**
2. Connect your GitHub repo (authorize Render to access it if first time)
3. Fill in the configuration:

   | Setting | Value |
   |---------|-------|
   | **Name** | `smart-lms-backend` |
   | **Runtime** | Node |
   | **Region** | Choose closest to your Neon DB region |
   | **Branch** | `main` |
   | **Root Directory** | `backend` ← **CRITICAL! Must be `backend`, not the repo root** |
   | **Build Command** | `npm install && npm run build && npx prisma generate` |
   | **Start Command** | `npm run start` |
   | **Plan** | Free |

4. Add **Environment Variables** (click **Advanced** → **Add Environment Variable**):

   | Key | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_URL` | *(Neon connection string from Step 2)* | Use the full URL including `?sslmode=require` |
   | `JWT_SECRET` | *(64-char random string)* | Generate from [random.org](https://www.random.org/strings/) or use `openssl rand -base64 64` |
   | `AI_SERVICE_URL` | *(leave empty for now)* | Update after Step 4 |
   | `FRONTEND_URL` | *(leave empty for now)* | Update after Step 5 |
   | `NODE_ENV` | `production` | |
   | `PORT` | `10000` | Render auto-assigns, but good to set |

5. Click **Create Web Service**
6. Wait for the build to complete (~2-3 minutes). Watch the **Logs** tab for errors.
7. **Run Prisma migrations** to create database tables:

   **Option A: Using Render Shell**
   - Go to your backend service → **Shell** tab
   - Run: `npx prisma migrate deploy`

   **Option B: From your local machine**
   ```bash
   cd backend
   # Temporarily set the Neon External Database URL
   set DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   npx prisma migrate deploy
   ```

8. **Test the backend** — note your URL: `https://smart-lms-backend.onrender.com`
   ```bash
   curl https://smart-lms-backend.onrender.com/api/health
   # Expected: {"status":"ok","timestamp":"..."}
   ```

> ⚠️ **Free tier note:** Render free tier services spin down after 15 minutes of inactivity. The first request after idle takes ~30 seconds to wake up. This is normal.

### Common Backend Build Issues

- **`prisma generate` fails:** Make sure `DATABASE_URL` is set before the build runs. The `postinstall` script in `package.json` also runs `prisma generate` as a backup.
- **TypeScript build fails:** Check the build logs for type errors. The `tsconfig.json` has `strict: false` to minimize issues.
- **Database connection fails:** Make sure the Neon URL includes `?sslmode=require`. Neon requires SSL for all connections.

---

## Step 4: Deploy AI Service on Render

1. Go to **Dashboard** → **New** → **Web Service**
2. Connect the same GitHub repo
3. Fill in the configuration:

   | Setting | Value |
   |---------|-------|
   | **Name** | `smart-lms-ai` |
   | **Runtime** | Python |
   | **Region** | Same as your backend |
   | **Branch** | `main` |
   | **Root Directory** | `ai-service` ← **CRITICAL! Must be `ai-service`, not the repo root** |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120` |
   | **Plan** | Free |

4. Add **Environment Variables**:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `GEMINI_API_KEY` | *(your Gemini API key)* | Get it from [aistudio.google.com](https://aistudio.google.com/apikey) |
   | `BACKEND_URL` | `https://smart-lms-backend.onrender.com` | Your backend URL from Step 3 |
   | `PORT` | `10000` | |

5. Click **Create Web Service**
6. Wait for the build (~1-2 minutes)
7. **Test the AI service** — note your URL: `https://smart-lms-ai.onrender.com`
   ```bash
   curl https://smart-lms-ai.onrender.com/health
   # Expected: {"status":"ok","model":"gemini-2.5-flash"}
   ```

### Why `--timeout 120`?

The Gemini API can take up to 60-90 seconds for quiz generation. Gunicorn's default timeout is 30 seconds, which would kill long-running AI requests. The 120-second timeout prevents this.

### Now Update Backend Environment

Go back to your **backend service** (Step 3) → **Environment** tab → Update:

| Key | Value |
|-----|-------|
| `AI_SERVICE_URL` | `https://smart-lms-ai.onrender.com` |

Render will **auto-redeploy** the backend after this change.

---

## Step 5: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Dashboard** → **Add New** → **Project**
2. Import your GitHub repo
3. Configure the deployment:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Next.js (auto-detected) |
   | **Root Directory** | `frontend` ← **CRITICAL! Click "Edit" and set this** |
   | **Build Command** | `next build` (default, keep it) |
   | **Output Directory** | `.next` (default, keep it) |

4. Add **Environment Variables**:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NEXT_PUBLIC_BACKEND_URL` | `https://smart-lms-backend.onrender.com` | Your backend URL from Step 3 |

5. Click **Deploy**
6. Wait for the build (~1-2 minutes)
7. **Test the frontend** — note your URL: `https://your-app-name.vercel.app`
   - Open it in your browser

### Now Update Backend Environment (Final)

Go back to your **backend service** (Step 3) → **Environment** tab → Update:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-app-name.vercel.app` |

Render will **auto-redeploy** the backend again.

---

## Step 6: Verify Everything Works

### Backend Health Check
```bash
curl https://smart-lms-backend.onrender.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### AI Service Health Check
```bash
curl https://smart-lms-ai.onrender.com/health
# Expected: {"status":"ok","model":"gemini-2.5-flash"}
```

### Test User Registration
```bash
curl -X POST https://smart-lms-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
# Expected: {"token":"...","user":{"id":1,"name":"Test User",...}}
```

### Test User Login
```bash
curl -X POST https://smart-lms-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Expected: {"token":"...","user":{...}}
```

### Test Frontend
Open `https://your-app-name.vercel.app` in your browser — should load the app.

---

## Complete Environment Variables Summary

### Backend (`smart-lms-backend` on Render)
| Variable | Value | When to Set |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require` | Step 3 (initial deploy) |
| `JWT_SECRET` | *(64-char random string)* | Step 3 (initial deploy) |
| `AI_SERVICE_URL` | `https://smart-lms-ai.onrender.com` | Step 4 (after AI service deployed) |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Step 5 (after frontend deployed) |
| `NODE_ENV` | `production` | Step 3 (initial deploy) |
| `PORT` | `10000` | Step 3 (initial deploy) |

### AI Service (`smart-lms-ai` on Render)
| Variable | Value | When to Set |
|----------|-------|-------------|
| `GEMINI_API_KEY` | *(your Gemini API key)* | Step 4 (initial deploy) |
| `BACKEND_URL` | `https://smart-lms-backend.onrender.com` | Step 4 (initial deploy) |
| `PORT` | `10000` | Step 4 (initial deploy) |

### Frontend (Vercel)
| Variable | Value | When to Set |
|----------|-------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://smart-lms-backend.onrender.com` | Step 5 (initial deploy) |

---

## Troubleshooting

### Backend won't start
- Check that `DATABASE_URL` is set correctly (must include `?sslmode=require` for Neon)
- Check that `prisma generate` ran in the build (look at build logs)
- Make sure `npm run build` (TypeScript compilation) succeeded
- Check that `JWT_SECRET` is set

### AI Service won't start
- Check that `GEMINI_API_KEY` is set
- Check build logs for pip install errors
- The `--timeout 120` flag in gunicorn is needed because Gemini API calls can be slow
- If you see `GEMINI_API_KEY environment variable is not set!` in logs, the env var is missing

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is set in Vercel
- Check that the backend CORS allows your Vercel URL
- The backend's CORS config already allows all `.vercel.app` subdomains
- **Important:** `NEXT_PUBLIC_` prefix means the variable is embedded at build time. If you change it, you must redeploy the frontend.

### CORS errors in browser
- The AI service CORS uses regex `r"https://.*\.vercel\.app"` to match all Vercel subdomains
- The backend CORS also allows all `.vercel.app` subdomains
- If you still get CORS errors, check that `BACKEND_URL` and `FRONTEND_URL` env vars are set correctly

### 503 errors on AI endpoints
- The AI service may be spinning down (free tier sleeps after 15 min)
- First request after idle takes ~30 seconds
- Consider upgrading to a paid plan if you need always-on availability

### Database connection errors
- Neon requires `?sslmode=require` in the connection string
- Neon free tier has a 0.5 GB storage limit
- Neon uses serverless compute — connections may be briefly cold on first access

---

## Optional: Using `render.yaml` for Blueprint Deployment

Instead of creating services manually on Render, you can use the Blueprint feature:

1. Go to [render.com](https://render.com) → **Dashboard** → **New** → **Blueprint**
2. Select your GitHub repo
3. Render reads `render.yaml` and creates the backend + AI service automatically
4. You still need to manually set:
   - `DATABASE_URL` (from Neon)
   - `GEMINI_API_KEY` (from Google AI Studio)
   - `JWT_SECRET` (or let Render auto-generate it)
   - `FRONTEND_URL` (after Vercel deployment)

---

## Deployment Order Summary

```
1. Neon PostgreSQL    → Create DB, copy connection string
2. Backend (Render)   → Deploy with DATABASE_URL + JWT_SECRET
3. Prisma Migrate     → Run migrations to create tables
4. AI Service (Render)→ Deploy with GEMINI_API_KEY + BACKEND_URL
5. Update Backend     → Set AI_SERVICE_URL env var
6. Frontend (Vercel)  → Deploy with NEXT_PUBLIC_BACKEND_URL
7. Update Backend     → Set FRONTEND_URL env var
8. Verify             → Test all health checks + registration
```

---

## Post-Deployment Checklist

- [ ] Neon PostgreSQL created and connection string saved
- [ ] Backend deployed on Render and health check returns `{"status":"ok"}`
- [ ] Prisma migrations run (tables created in Neon)
- [ ] AI service deployed on Render and health check returns `{"status":"ok"}`
- [ ] Backend `AI_SERVICE_URL` env var updated
- [ ] Frontend deployed on Vercel
- [ ] Backend `FRONTEND_URL` env var updated
- [ ] Frontend loads in browser
- [ ] User registration works
- [ ] User login works
- [ ] Course creation works (as instructor)
- [ ] Course enrollment works (as student)
- [ ] AI quiz generation works
- [ ] AI summarization works
- [ ] AI chat works
- [ ] AI student analysis works
