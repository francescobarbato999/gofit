# Workout Tracking App

Personal app for recording workouts, following a weekly plan, and viewing a history of completed sessions.

**Stack**: HTML, CSS, JavaScript (frontend) + Python Flask (backend) + database.

## User Story

1. As a user, I want to log a workout with exercises, sets, and reps, so I can track my progress.
2. As a user, I want to create a repeatable weekly plan, so I can follow a consistent program and see my progress over time.
3. As a user, I want to be able to modify the daily workout if a machine is unavailable, so I can adapt without losing the plan's structure.

## Data Model

Guiding Principle: Separate **planned** data (plan targets, always the same) from **real** data (what actually happened in a specific session).

| Entity | Description | Main Fields |
|---|---|---|
| `Exercise` | Exercise catalog, always the same (e.g., "Bench press") | id, name, muscle_group |
| `Plan` | General weekly program (e.g., "Strength Plan 2026") | id, name |
| `Day` | A day in the plan (e.g., "Monday – Chest") | id, plan_id, day_name |
| `PlannedExercise` | A target exercise within a day | id, day_id, exercise_id, target_sets, target_reps |
| `DailyWorkout` | An actual workout session, on a specific date | id, plan_id, date |
| `ExerciseDone` | An exercise actually performed in a session | id, workout_id, exercise_id |
| `Set` | A single set performed (a weak entity of `ExerciseDone`) | id, exercise_done_id, number, reps, load, notes |

**Key Relationships**:
- A `Plan` has multiple `Day`
- A `Day` has multiple `PlannedExercise`
- A `DailyWorkout` follows a `Plan` and has multiple `ExerciseDone`
- An `ExerciseDone` has multiple `Set` (added one at a time during the workout)

---

## Screens (MVP)

### 1. Daily Card (main screen)
- List of exercises planned for the current day
- For each exercise: name + list of sets already recorded in this session (reps, load, notes)
- Actions: **+ add set** (inline form with reps, weight, and notes to be filled from scratch), **next exercise**

### 2. History
- List of past workouts, by date
- (No automatic comparisons/stats in the MVP — possible future development)

---

## General Architecture

- **Frontend** (HTML/CSS/JS): UI, collects input, updates the view
- **Backend** (Flask): receives requests from the frontend, applies logic, reads/writes to the database
- **Database**: persistent data storage (without it, data lives only in the browser's memory and is lost when closed)

Typical flow (e.g., "add set"):
1. JS collects reps/load/notes from the inline form
2. JS sends an HTTP request to Flask with this data
3. Flask saves the new `Set` to the database
4. Flask responds to JS (confirmation/updated data)
5. JS updates the list of sets on the screen

---

## Visual Reference / Future Developments

- **Multiple plans available at once** (e.g., "Push", "Full Body", "Legs", "Pull"), selectable from a dedicated screen — extends the current single-active-plan assumption
- **Post-workout summary**: a completed session card showing total duration and a compact list of exercises/sets performed (richer version of the History screen)
- **Statistics section**: charts/trends on progress over time (explicitly out of scope for MVP, per earlier planning decision)
- Considered and explicitly excluded for now: session start/end time and body weight tracking per session
- **Offline first with sync**
---

## Progress

- [x] Phase 1 — Planning (user story, data model, screens, architecture)
- [x] Phase 2 — HTML structure of the "Daily Card" screen
- [x] Phase 3 — Basic JavaScript (interactivity without persistence)
- [x] Phase 4 — Flask backend
- [x] Phase 5 — Frontend/backend connection (API)
- [x] Phase 6 — Database 
- [ ] Phase 7 — Refinement and deployment (candidate approach: local Debian laptop as server, accessed via Tailscale, for the university presentation)