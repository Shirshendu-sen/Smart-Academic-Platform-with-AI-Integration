# Graph Report - .  (2026-07-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 282 nodes · 474 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `671f901b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 52 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 14 edges
4. `useAuthStore` - 13 edges
5. `Button()` - 11 edges
6. `Badge()` - 8 edges
7. `Card()` - 8 edges
8. `CardContent()` - 8 edges
9. `api` - 8 edges
10. `CardHeader()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CourseDetailPage()` --calls--> `useAuthStore`  [EXTRACTED]
  frontend/app/courses/[id]/page.tsx → frontend/lib/store.ts
- `DashboardPage()` --calls--> `useAuthStore`  [EXTRACTED]
  frontend/app/dashboard/page.tsx → frontend/lib/store.ts
- `InstructorPage()` --calls--> `useAuthStore`  [EXTRACTED]
  frontend/app/instructor/page.tsx → frontend/lib/store.ts
- `LoginPage()` --calls--> `useAuthStore`  [EXTRACTED]
  frontend/app/login/page.tsx → frontend/lib/store.ts
- `RegisterPage()` --calls--> `cn()`  [EXTRACTED]
  frontend/app/register/page.tsx → frontend/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Microservices Architecture** — backend_src_app, ai_service_app, frontend_lib_api [EXTRACTED 1.00]
- **AI Integration Flow** — frontend_components_aiquiz, backend_src_routes_ai, ai_service_app, gemini_api [EXTRACTED 1.00]
- **Data Persistence Layer** — backend_src_db, backend_src_models_user, backend_src_models_course, mongodb_atlas [INFERRED 0.80]

## Communities (20 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (28): app, limiter, connectDB(), PORT, authenticate(), authorize(), AuthRequest, CourseSchema (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (24): CourseDetailPage(), DashboardPage(), InstructorPage(), LoginPage(), features, stats, RegisterPage(), Message (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (25): ThemeToggle(), Avatar(), AvatarFallback(), AvatarImage(), Button(), buttonVariants, DialogContent(), DialogDescription() (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (31): dependencies, axios, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, motion (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): author, description, devDependencies, ts-node-dev, @types/bcryptjs, @types/cors, @types/express, @types/jsonwebtoken (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, ignoreDeprecations, lib, module, moduleResolution, outDir (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (12): dependencies, axios, bcryptjs, cloudinary, cors, dotenv, express, express-rate-limit (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.31
Nodes (6): analyze_student(), clean_json_response(), generate_quiz(), Remove markdown code fences that Gemini sometimes wraps around JSON., summarize(), Google Gemini AI

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (4): inter, metadata, Navbar(), Providers()

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (5): builds, env, NODE_ENV, routes, version

## Knowledge Gaps
- **142 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 1`, `Community 10`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 3` to `Community 6`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `useAuthStore` connect `Community 1` to `Community 2`, `Community 10`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `Remove markdown code fences that Gemini sometimes wraps around JSON.`, `name`, `version` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07505285412262157 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12579281183932348 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12612612612612611 - nodes in this community are weakly interconnected._