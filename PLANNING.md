# Workout Tracking App

Personal app for recording workouts, following reusable training plans, and viewing a history of completed sessions. Supports multiple users, each with their own private data.

**Stack**: HTML, CSS, JavaScript (frontend) + Python Flask (backend) + MongoDB (database, via PyMongo, running in Docker).

## User Story

1. As a user, I want to log a workout with exercises, sets, and reps, so I can track my progress.
2. As a user, I want to create a reusable training plan, so I can follow a consistent program and see my progress over time.
3. As a user, I want to be able to modify the daily workout if a machine is unavailable, so I can adapt without losing the plan's structure.
4. As a user, I want my data to be private and separate from other users' data.

## Data Model

Guiding principle: separate **planned** data (plan targets, always the same) from **real** data (what actually happened in a specific session). MongoDB documents use **embedding**: a workout embeds its exercises, which embed their sets; a plan embeds its planned exercises. This trades a small amount of data duplication (e.g., an exercise name copied at the time a plan or session was created) for simpler reads — no joins needed to display a full workout or plan. One consequence: renaming an exercise in the catalog does not retroactively update past plans/sessions — acceptable for the MVP, but relevant if statistics/aggregation by exercise name are added later.

| Collection | Description | Shape |
|---|---|---|
| `utenti` | Registered users | `{_id, email, password}` — `password` is a hash (werkzeug), never stored in plain text |
| `esercizi` | Exercise catalog, shared across all users | `{_id, nome, gruppo_muscolare}` |
| `schede` | A reusable training plan, owned by one user | `{_id, utente_id, nome, esercizi_pianificati: [{nome, target_rep: [int, ...]}]}` — `target_rep` holds one rep target per planned set (e.g. `[8, 8, 8, 6]`); the number of planned sets is simply its length, not stored separately |
| `allenamenti` | One actual workout session (one per user per day), owned by one user | `{_id, utente_id, data, esercizi_svolti: [{nome, serie: [{numero, rep, carico}]}]}` |

**Key relationships**:
- A `scheda` belongs to one user (`utente_id`) and embeds its `esercizi_pianificati`
- An `allenamento` belongs to one user and one date, and embeds the `esercizi_svolti` performed that day
- Each `esercizio_svolto` embeds its own `serie`, added one at a time during the workout (via MongoDB's positional `$` operator + `$push`)
- There is no `Day`/weekly-schedule entity: a plan (`scheda`) is chosen by the user whenever they train, not tied to a fixed day of the week

**Multi-user access control**: every read/write on `schede` and `allenamenti` is filtered by `utente_id`, taken from the current Flask session — not from the request body, to prevent a user from reading or writing another user's data.

---

## Authentication

Session-based (Flask `session`, cookie-based), not token-based. Passwords hashed with `werkzeug.security` (`generate_password_hash` / `check_password_hash`), never stored or logged in plain text. `SECRET_KEY` is loaded from a `.env` file (via `python-dotenv`), excluded from Git.

Routes: `POST /api/registrazione`, `POST /api/login`, `POST /api/logout`. Frontend: a single `login.html` page with two forms (login/registration) toggled via JS, sharing one stylesheet/script. Requests to protected routes use `fetch(..., { credentials: "include" })`; Flask-CORS is configured with `supports_credentials=True` and an explicit allowed origin (not `"*"`, which is incompatible with credentialed requests).

---

## Screens (MVP)

### 0. Login / Registration
Single page, toggles between a login form and a registration form. On success, redirects to the Daily Card screen (or wherever the user's next step should be).

### 1. Programs (Programmi)
List of the logged-in user's saved plans (`schede`), each selectable to start a workout, plus a way to create a new plan. Selecting a plan navigates to the Daily Card screen with the chosen plan's id passed as a URL query parameter (e.g. `scheda_del_giorno.html?scheda_id=...`).

### 2. Daily Card (Scheda del giorno)
- List of exercises planned for the chosen plan (loaded via `scheda_id` from the URL, falling back to a flat exercise list if none is provided — current dev behavior)
- For each exercise: name + list of sets already recorded in this session
- Actions: **+ add set** (inline form, values filled from scratch, with validation), **next exercise**

### 3. History
- List of past workouts, by date
- (No automatic comparisons/stats in the MVP — explicit future development)

---

## General Architecture

- **Frontend** (HTML/CSS/JS): UI, collects input, updates the view, reads URL query params for navigation state (e.g. which plan was selected)
- **Backend** (Flask): route-per-resource REST-ish API (`/api/esercizi`, `/api/schede`, `/api/serie`, `/api/registrazione`, `/api/login`, `/api/logout`), session-based auth, talks to MongoDB via PyMongo
- **Database**: MongoDB running in a Docker container (`docker run ... --name mongodb -v $MONGODATA:/data/db -p 27017:27017 mongo`), data persisted via a bind-mounted `mongodata/` directory (excluded from Git)

Typical flow (e.g., "add set"):
1. JS collects rep/load from the inline form, validates non-empty input
2. JS sends a `POST` request to `/api/serie` with `{esercizio, rep, carico}`
3. Flask upserts today's `allenamento` document for the current user, then either `$push`es a new exercise (with its first set) or, if the exercise is already present today, `$push`es the new set into its `serie` array using the positional `$` operator
4. Flask responds with a confirmation
5. JS appends the new set to the visible list and hides the form

---

## Visual Reference / Future Developments

- **Post-workout summary**: a completed session card showing total duration and a compact list of exercises/sets performed (richer version of the History screen)
- **Statistics section**: charts/trends on progress over time (explicitly out of scope for MVP)
- **Nutrition**: using OpenFoodFacts' API  
- Considered and explicitly excluded for now: session start/end time, body weight tracking per session, offline-first with sync (would need real conflict handling; local-server-with-Tailscale approach chosen instead for the deployment scenario)

---

## Deployment plan (Phase 7)

Target: a tunnel made with Quicktunnel Cloudfare

---

## Progress

- [x] Phase 1 — Planning (user story, data model, screens, architecture)
- [x] Phase 2 — HTML structure of the "Daily Card" screen
- [x] Phase 3 — Basic JavaScript (interactivity without persistence)
- [x] Phase 4 — Flask backend
- [x] Phase 5 — Frontend/backend connection (API)
- [x] Phase 6 — Database (MongoDB via PyMongo; migrated from an earlier SQLite/SQLAlchemy prototype)
- [x] Multi-user authentication (session-based login/registration/logout, data scoped by `utente_id`)
- [x] Frontend for Programs screen (list/select/create `schede`) — in progress
- [x] Daily Card loading exercises from a selected `scheda` instead of the full exercise list
- [x] History screen
- [x] Open Food Facts import
- [x] Phase 7 — Deployment MongoDb Atlas for DB + Render Static Site for frontend + Render Web Service for backend 