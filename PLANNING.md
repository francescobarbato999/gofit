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
| `Exercise` | Exercise Catalog, always the same (e.g., "Benches") | id, name, muscle group |
| `Workout` | General weekly program (e.g., "Strength Workout 2026") | id, name |
| `Day` | A day in the workout (e.g., "Monday – Chest") | id, workout_id, day_name |
| `PlannedExercise` | A target exercise within a day | id, day_id, exercise_id, target_set, target_rep |
| `DailyWorkout` | An actual workout, on a specific date | id, workout_id, date |
| `ExerciseDone` | An exercise actually done in a workout | id, workout_id, exercise_id |
| `Set` | A single set performed (a weak part of `WorkoutDone`) | id, workout_id, number, reps, load |

**Key Relationships**:
- A `Card` has multiple `Day`
- A `Day` has multiple `PlannedExercise`
- A `DailyWorkout` follows a `Card` and has multiple `PerformedExercises`
- A `PerformedExercise` has multiple `Sets` (added one at a time during the workout)

---

## Screens (MVP)

### 1. Daily Card (main screen)
- List of exercises planned for the current day
- For each exercise: name + list of sets already recorded in this session
- Actions: **+ add sets** (inline form with reps and weight to be filled from scratch), **next exercise**

### 2. History
- List of past workouts, by date
- (No automatic comparisons/stats in the MVP — possible future development)

---

## General Architecture

- **Frontend** (HTML/CSS/JS): UI, collects input, updates the view
- **Backend** (Flask): receives requests from the frontend, applies logic, reads/writes to the database
- **Database**: persistent data persistence (without it, the data lives only in the browser's memory and is lost when closed)

Typical flow (e.g., "add series"):
1. JS collects reps/loads from the inline form
2. JS sends an HTTP request to Flask with this data
3. Flask saves the new `Series` to the database
4. Flask responds to JS (confirmation/updated data)
5. JS updates the list of series on the screen

---

## Progress

- [x] Phase 1 — Planning (user story, data model, screens, architecture)
- [x] Phase 2 — HTML structure of the "Card of the Day" screen
- [x] Phase 3 — Basic JavaScript (interactivity without persistence)
- [x] Phase 4 — Flask Backend
- [x] Phase 5 — Frontend/Backend Connection (API)
- [ ] Phase 6 — Database
- [ ] Phase 7 — Refinement and Deployment