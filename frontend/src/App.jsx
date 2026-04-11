import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

function formatDue(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const openCount = useMemo(
    () => tasks.filter((task) => !task.is_done).length,
    [tasks]
  );

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to load tasks.");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSaving(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          due_date: dueDate || null
        })
      });

      if (!response.ok) {
        throw new Error("Could not create task.");
      }

      const created = await response.json();
      setTasks((prev) => [created, ...prev]);
      setTitle("");
      setDueDate("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleDone(task) {
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          is_done: !task.is_done
        })
      });

      if (!response.ok) {
        throw new Error("Could not update task.");
      }

      const updated = await response.json();
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(taskId) {
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Could not delete task.");
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Task control center</p>
        <h1>Todo Atlas</h1>
        <p className="subtitle">
          Plot your week, mark wins, and keep every promise to yourself on the map.
        </p>
        <div className="hero-card">
          <div>
            <h2>{openCount}</h2>
            <p>Open tasks</p>
          </div>
          <div>
            <h2>{tasks.length}</h2>
            <p>Total</p>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <h3>Create a task</h3>
          <form onSubmit={handleCreate} className="task-form">
            <label>
              Task name
              <input
                type="text"
                placeholder="Write the task you want to finish"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label>
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </label>
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving" : "Add task"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel">
          <h3>Task feed</h3>
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Create your first one.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={task.is_done ? "done" : ""}>
                  <div>
                    <h4>{task.title}</h4>
                    <p>{formatDue(task.due_date)}</p>
                  </div>
                  <div className="actions">
                    <button onClick={() => toggleDone(task)}>
                      {task.is_done ? "Undo" : "Mark done"}
                    </button>
                    <button className="ghost" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
