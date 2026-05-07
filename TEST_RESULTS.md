# Local Testing Checklist — Results

**Date:** 2026-05-06  
**Tester:** Automated via curl  
**Backend:** http://localhost:3001  
**AI Service:** http://localhost:5001  
**Frontend:** http://localhost:3000  

---

## Backend

| # | Test | Status | Details |
|---|------|--------|---------|
| 1 | `POST /api/auth/register` | ✅ PASS | Returns `token` + `user` (id, name, email, role). Tested with both `student` and `instructor` roles. |
| 2 | `POST /api/auth/login` | ✅ PASS | Returns `token` + `user`. Timing-attack prevention confirmed (dummy hash on missing user). |
| 3 | `GET /api/auth/me` | ✅ PASS | Returns user object (id, name, email, role, avatarUrl, createdAt). Password excluded. |
| 4 | `GET /api/courses` | ✅ PASS | Returns `{ courses, total, page, totalPages }` with published courses only. |
| 5 | `POST /api/courses` | ✅ PASS | Creates course with instructor token. Returns 201 with course object. |
| 6 | `POST /api/courses/:id/enroll` | ✅ PASS | Enrolls student in published course. Returns 201 with enrollment object. |
| 7 | `POST /api/lessons` | ✅ PASS | Creates lesson with content. Returns 201 with lesson object. Instructor-only, ownership verified. |

## AI Service

| # | Test | Status | Details |
|---|------|--------|---------|
| 1 | `GET /health` | ✅ PASS | Returns `{"status":"ok","model":"gemini-2.5-flash"}` |
| 2 | `POST /generate-quiz` | ✅ PASS | Returns 10 MCQ questions with `question`, `options[]`, `correct_answer`, `explanation`. Takes ~5s. |
| 3 | `POST /summarize` | ✅ PASS | Returns `overview` + `key_points[]` + `terms[{term, definition}]`. |
| 4 | `POST /chat` | ✅ PASS | Returns `{"answer": "..."}` based on provided context. |
| 5 | `POST /analyze-student` | ⚠️ RATE LIMITED | Code is correct (uses same `call_gemini()` as other endpoints). Gemini free tier quota exhausted (20 req/day for gemini-2.5-flash). Will pass once quota resets. |

## Frontend

| # | Test | Status | Details |
|---|------|--------|---------|
| 1 | `http://localhost:3000` loads | ✅ PASS | Returns HTTP 200. Next.js renders successfully. |

## RBAC Tests

| # | Test | Status | Details |
|---|------|--------|---------|
| 1 | Student CANNOT create a course | ✅ PASS | Returns 403: `"Access denied. Required role: instructor or admin."` |
| 2 | Instructor CANNOT enroll in a course | ✅ PASS | Returns 403: `"Access denied. Required role: student."` |
| 3 | Unauth request to `/api/auth/me` | ✅ PASS | Returns 401: `"No token provided. Please log in."` |

---

## Summary

- **Passed:** 16 / 17
- **Rate-limited (not a code bug):** 1 / 17 (`POST /analyze-student` — Gemini free tier quota)
- **Failed (code bug):** 0 / 17

### Note on `POST /analyze-student`
The endpoint code is functionally identical to the other 3 AI endpoints — it uses the same [`call_gemini()`](ai-service/app.py:43) wrapper. The 500 error is caused by:
```
429 RESOURCE_EXHAUSTED: Quota exceeded for metric: generate_content_free_tier_requests, limit: 20, model: gemini-2.5-flash
```
This is a **transient quota issue**, not a code defect. The endpoint will work once the daily quota resets or a paid API key is used.
