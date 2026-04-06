# Student Task Manager API

**COMPSCI732 Tech Tutorial — University of Auckland**
**Student:** Rayven85

A full-stack project: a **FastAPI** (Python) backend connected to a **React** (Vite) frontend.
This project demonstrates core FastAPI concepts: request validation with Pydantic, automatic OpenAPI documentation, CORS configuration, and how to hook up a React frontend to a Python API backend.

---

## Table of Contents

1. [What is FastAPI?](#1-what-is-fastapi)
2. [Why FastAPI?](#2-why-fastapi)
3. [FastAPI vs Express](#3-fastapi-vs-express)
4. [Project Structure](#4-project-structure)
5. [Setup & Installation](#5-setup--installation)
6. [Running the API](#6-running-the-api)
7. [Running the React Frontend](#7-running-the-react-frontend)
8. [How CORS Works](#8-how-cors-works)
9. [API Design](#9-api-design)
10. [How Request Validation Works](#10-how-request-validation-works)
9. [Automatic API Docs (`/docs`)](#9-automatic-api-docs-docs)
10. [Example Requests](#10-example-requests)
11. [Running Tests](#11-running-tests)
12. [Demo Walkthrough](#12-demo-walkthrough)

---

## 1. What is FastAPI?

[FastAPI](https://fastapi.tiangolo.com) is a modern, high-performance Python web framework for building APIs. It is built on top of **Starlette** (the ASGI framework) and **Pydantic** (the data validation library), and it leverages Python's **type hints** to provide:

- Automatic request body validation
- Automatic serialisation/deserialisation of JSON data
- Auto-generated, interactive OpenAPI documentation at `/docs`
- High performance comparable to Node.js and Go frameworks

FastAPI was first released in 2018 and has become one of the most popular Python frameworks for backend API development.

---

## 2. Why FastAPI?

For this tutorial project, FastAPI was chosen for the following reasons:

| Reason | Detail |
|--------|--------|
| **Type-safe** | Python type hints enforce correct data types across the codebase |
| **Built-in validation** | Pydantic automatically validates every request — no manual checking needed |
| **Auto docs** | `/docs` is generated from the code — no separate documentation effort |
| **Clean structure** | Encourages a layered architecture (router → service → storage) |
| **Easy to learn** | Beginner-friendly syntax, great official documentation |
| **Production-ready** | Used by large companies; async support built in |

---

## 3. FastAPI vs Express

Both FastAPI and Express are popular choices for building REST APIs. Here is a practical comparison:

| Feature | FastAPI (Python) | Express (Node.js) |
|---|---|---|
| **Language** | Python 3.10+ | JavaScript / TypeScript |
| **Type system** | Native type hints (enforced by Pydantic) | TypeScript optional; no built-in enforcement |
| **Request validation** | Automatic via Pydantic — define a schema, FastAPI handles the rest | Manual, or requires a library (e.g. `joi`, `zod`) |
| **API documentation** | Auto-generated at `/docs` from code | Must be written separately (e.g. Swagger UI setup) |
| **Project structure** | Opinionated conventions encouraged | Highly flexible, minimal defaults |
| **Performance** | Async-first, comparable to Node.js | Event-loop based, fast for I/O-bound tasks |
| **Learning curve** | Moderate — requires knowing Python and Pydantic | Low — very minimal boilerplate |
| **Ecosystem** | Python data/ML libraries (pandas, NumPy, etc.) | Huge npm ecosystem |
| **Best suited for** | APIs with strict schemas, data-heavy applications | Lightweight services, full-stack JS projects |

**Summary:** Express gives you maximum flexibility and is excellent for lightweight services or full-stack JavaScript projects. FastAPI is the better choice when you want strong typing, automatic validation, and documentation — especially in a Python environment.

---

## 4. Project Structure

```
cs732-tech-tutorial-Rayven85/
├── app/                         # FastAPI backend
│   ├── main.py                  # App instance, CORS, router registration, seed data
│   ├── models/
│   │   └── task.py              # Internal Task class (data layer)
│   ├── schemas/
│   │   └── task.py              # Pydantic schemas: TaskCreate, TaskUpdate, TaskResponse
│   ├── routers/
│   │   └── tasks.py             # All /tasks API endpoints
│   ├── services/
│   │   └── task_service.py      # Business logic: filter, sort, CRUD operations
│   └── storage/
│       └── in_memory.py         # In-memory data store (Python dict)
├── frontend/                    # React frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Root component, state management
│       ├── App.css              # Global styles
│       ├── api.js               # All fetch() calls to FastAPI
│       └── components/
│           ├── TaskList.jsx     # Renders the task list
│           ├── TaskCard.jsx     # Single task row with complete/delete
│           └── AddTaskForm.jsx  # Form to create a new task
├── tests/
│   └── test_tasks.py            # pytest test suite
├── requirements.txt
├── .gitignore
└── README.md
```

**Architecture:**

```
React (localhost:5173)
    ↕  fetch() via CORS
FastAPI (localhost:8000)
    └── Router → Service → In-Memory Storage
```

- **Router**: Handles HTTP — parses request, validates input via schema, returns response
- **Service**: Handles business logic — filtering, sorting, error raising
- **Storage**: Simple dict-based in-memory store
- **Schemas**: Pydantic models that define the shape of API inputs and outputs
- **api.js**: All fetch calls to FastAPI in one place — keeps React components clean

---

## 5. Setup & Installation

### Prerequisites

- Python 3.10 or higher
- `pip` (Python package manager)

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd cs732-tech-tutorial-Rayven85
```

### Step 2 — Create and activate a virtual environment

```bash
# Create virtual environment
python -m venv venv

# Activate (macOS / Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### Step 3 — Install dependencies

```bash
pip install -r requirements.txt
```

---

## 6. Running the API

> **Note:** Run the backend first, then start the frontend in a separate terminal.

```bash
uvicorn app.main:app --reload
```

- The API will start at: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- Alternative docs (ReDoc): `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/`

The `--reload` flag automatically restarts the server when you change code — ideal during development.

**On startup**, 3 example tasks are automatically seeded into the in-memory store so you can start testing immediately without creating any data first.

---

## 7. Running the React Frontend

### Prerequisites

- Node.js 18 or higher

### Steps

```bash
# Move into the frontend directory
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

**The FastAPI backend must be running first** (on `localhost:8000`) before the frontend can load any data.

### What the frontend demonstrates

- Fetching data from a Python API using `fetch()` in React
- Displaying a live task list with real backend data
- Creating tasks via a form (POST to FastAPI, with Pydantic validation)
- Marking tasks complete (PUT to FastAPI)
- Deleting tasks (DELETE to FastAPI)
- A stats bar that reads from `GET /tasks/stats`

---

## 8. How CORS Works

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that blocks requests from a different origin (domain + port) unless the server explicitly allows it.

In this project:
- The React frontend runs on `http://localhost:5173`
- The FastAPI backend runs on `http://localhost:8000`

These are **different origins**, so without CORS configuration the browser would block every API request.

### The fix — in `app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_methods=["*"],   # GET, POST, PUT, DELETE
    allow_headers=["*"],
)
```

FastAPI includes `CORSMiddleware` out of the box — no extra library needed. This middleware adds the correct `Access-Control-Allow-Origin` headers to every response, telling the browser it is safe to proceed.

---

## 9. API Design

The API follows REST conventions with 7 endpoints:

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `GET` | `/tasks/` | List all tasks (with optional filter/sort) | 200 |
| `GET` | `/tasks/upcoming` | Tasks due in the next 7 days | 200 |
| `GET` | `/tasks/stats` | Summary statistics | 200 |
| `GET` | `/tasks/{task_id}` | Get a single task by ID | 200 / 404 |
| `POST` | `/tasks/` | Create a new task | 201 |
| `PUT` | `/tasks/{task_id}` | Update an existing task (partial) | 200 / 404 |
| `DELETE` | `/tasks/{task_id}` | Delete a task | 204 / 404 |

### Query parameters for `GET /tasks/`

| Parameter | Type | Description |
|-----------|------|-------------|
| `course` | string | Filter by course code (e.g. `COMPSCI732`) |
| `completed` | boolean | Filter by completion status (`true` / `false`) |
| `sort_by` | enum | Sort by `due_date`, `priority`, or `created_at` |

### Task fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | Auto | Generated by server |
| `title` | string | Yes | 1–200 characters |
| `description` | string | No | Up to 1000 characters |
| `course` | string | Yes | e.g. `COMPSCI732` |
| `due_date` | date | Yes | ISO format: `YYYY-MM-DD` |
| `priority` | enum | No | `low` / `medium` / `high` (default: `medium`) |
| `completed` | boolean | No | Default: `false` |
| `created_at` | datetime | Auto | Set on creation |
| `updated_at` | datetime | Auto | Updated on every PUT |

---

## 10. How Request Validation Works

One of FastAPI's most powerful features is **automatic request validation** via **Pydantic**.

### How it works

1. You define a Pydantic `BaseModel` with typed fields
2. You use that model as the type annotation on a route function parameter
3. FastAPI automatically validates the incoming request body against the model
4. If validation fails, FastAPI returns a **422 Unprocessable Entity** response with a clear error message — no extra code needed

### Example

The `TaskCreate` schema in `app/schemas/task.py`:

```python
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    course: str = Field(..., min_length=1, max_length=50)
    due_date: date
    priority: Literal["low", "medium", "high"] = "medium"
    completed: bool = False
    description: Optional[str] = None
```

If a client sends:

```json
{ "title": "", "due_date": "not-a-date" }
```

FastAPI automatically responds with:

```json
{
  "detail": [
    { "loc": ["body", "title"], "msg": "String should have at least 1 character", "type": "string_too_short" },
    { "loc": ["body", "course"], "msg": "Field required", "type": "missing" },
    { "loc": ["body", "due_date"], "msg": "Input should be a valid date", "type": "date_from_datetime_parsing" }
  ]
}
```

This happens with **zero manual validation code** in the route handler.

---

## 11. Automatic API Docs (`/docs`)

FastAPI automatically generates interactive API documentation from your code. There is no separate documentation file to maintain.

**To access:**

1. Start the server: `uvicorn app.main:app --reload`
2. Open your browser: `http://localhost:8000/docs`

The `/docs` page (Swagger UI) lets you:

- See all endpoints, their parameters, and response schemas
- Send test requests directly from the browser
- View example request bodies generated from Pydantic schemas
- Inspect error responses

This is possible because FastAPI generates an **OpenAPI schema** (previously called Swagger) directly from your route definitions and Pydantic models.

An alternative documentation UI is available at `http://localhost:8000/redoc`.

---

## 12. Example Requests

All examples use `curl`. You can also use the interactive `/docs` page directly.

### Create a task

```bash
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write FastAPI tutorial report",
    "course": "COMPSCI732",
    "due_date": "2026-05-01",
    "priority": "high",
    "description": "2000-word report with demo video"
  }'
```

### List all tasks

```bash
curl http://localhost:8000/tasks/
```

### Filter tasks by course

```bash
curl "http://localhost:8000/tasks/?course=COMPSCI732"
```

### Filter incomplete tasks, sorted by due date

```bash
curl "http://localhost:8000/tasks/?completed=false&sort_by=due_date"
```

### Get a single task

```bash
curl http://localhost:8000/tasks/demo-001
```

### Update a task (mark as completed)

```bash
curl -X PUT http://localhost:8000/tasks/demo-001 \
  -H "Content-Type: application/json" \
  -d '{ "completed": true }'
```

### Get upcoming tasks (due in next 7 days)

```bash
curl http://localhost:8000/tasks/upcoming
```

### Get statistics

```bash
curl http://localhost:8000/tasks/stats
```

### Delete a task

```bash
curl -X DELETE http://localhost:8000/tasks/demo-001
```

### Trigger a validation error (for demo purposes)

```bash
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{ "title": "", "priority": "urgent" }'
```

Expected: `422 Unprocessable Entity` with detailed error messages from Pydantic.

---

## 13. Running Tests

The test suite uses **pytest** and FastAPI's built-in `TestClient` (powered by `httpx`). Tests run against the real application code without needing a running server.

```bash
pytest tests/ -v
```

The test suite covers:

- Health check
- Create task (success + validation failures)
- List tasks (empty, with data, filtered)
- Get single task (success + 404)
- Update task (success + 404)
- Delete task (success + 404)
- Stats endpoint

Each test automatically resets the in-memory store before running, ensuring test isolation.

---

## 14. Demo Walkthrough

The following is a suggested flow for recording a video demo.

### Step 1 — Start the server

```bash
uvicorn app.main:app --reload
```

Show the terminal output confirming the server is running.

### Step 2 — Open `/docs`

Open `http://localhost:8000/docs` in the browser.
Point out:
- The API title and description
- The grouped list of endpoints
- That this was generated automatically — no extra setup

### Step 3 — GET /tasks/ (show seed data)

Use the `/docs` UI or `curl http://localhost:8000/tasks/` to show the 3 pre-seeded tasks.

### Step 4 — POST /tasks/ (show validation)

First, send an **invalid request** (empty title, wrong priority) to demonstrate the 422 validation response from Pydantic.

Then, send a **valid request** to create a new task, and show the 201 response with the auto-generated `id` and timestamps.

### Step 5 — GET /tasks/?course=COMPSCI732 (show filtering)

Show how query parameters filter results. Highlight that this is defined using typed `Query()` parameters in FastAPI.

### Step 6 — PUT /tasks/{id} (show partial update)

Update only the `completed` field of a task. Show that other fields remain unchanged — this is the partial update pattern.

### Step 7 — GET /tasks/stats (show stats endpoint)

Show the summary response including completion rate and breakdown by priority.

### Step 8 — DELETE /tasks/{id} (show 204 + 404)

Delete a task. Show the 204 No Content response.
Then try to get the same task — show the 404 response.

### Step 9 — Close with /docs summary

Return to `/docs`. Point out how the entire API surface is documented, with schema definitions, response examples, and query parameters all automatically populated.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | 0.115.5 | Web framework |
| `uvicorn[standard]` | 0.32.1 | ASGI server |
| `pydantic` | 2.10.3 | Data validation |
| `pytest` | 8.3.4 | Testing framework |
| `httpx` | 0.28.1 | HTTP client used by TestClient |

---

*COMPSCI732 Tech Tutorial — University of Auckland — 2026*
