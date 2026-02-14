# Todo Atlas

A simple full-stack todo app that tracks tasks with due dates and completion status. The backend is built with FastAPI + SQLite, and the frontend is built with React + Vite.

## Features

- Create tasks with optional due dates
- Mark tasks as done/undone
- Delete tasks
- Responsive UI with task counts

## Project structure

- `backend/` FastAPI + SQLite API
- `frontend/` React + Vite UI

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will run on `http://localhost:8000` and store data in `backend/tasks.db`.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. If Vite chooses a different port, update CORS in `backend/main.py` accordingly.

## API endpoints

- `GET /tasks` list tasks
- `POST /tasks` create task
- `PATCH /tasks/{id}` update task (title, due_date, is_done)
- `DELETE /tasks/{id}` delete task

## Tests

There are no automated tests yet. If you add tests later, consider:

- Backend: Pytest + FastAPI TestClient for API tests
- Frontend: Vitest + React Testing Library for UI behavior
