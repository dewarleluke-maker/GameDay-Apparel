import { useState } from "react";

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `t-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function toMinutes(hhmm) {
  if (!hhmm) return Infinity;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatRange(start, end) {
  if (!start) return "";
  if (end && toMinutes(end) > toMinutes(start)) {
    return `${formatTime(start)} – ${formatTime(end)}`;
  }
  return formatTime(start);
}

export default function TodoSection({ todos, onChange }) {
  const [draft, setDraft] = useState("");
  const [startDraft, setStartDraft] = useState("");
  const [endDraft, setEndDraft] = useState("");
  const [editingId, setEditingId] = useState(null);

  function addTodo() {
    const text = draft.trim();
    if (!text) return;
    const start = startDraft;
    const end = start && endDraft && toMinutes(endDraft) > toMinutes(start) ? endDraft : "";
    onChange([...todos, { id: newId(), text, done: false, start, end }]);
    setDraft("");
    setStartDraft("");
    setEndDraft("");
  }

  function updateTodo(index, patch) {
    onChange(todos.map((todo, i) => (i === index ? { ...todo, ...patch } : todo)));
  }

  function removeTodo(index) {
    setEditingId(null);
    onChange(todos.filter((_, i) => i !== index));
  }

  // Sort chronologically for display; untimed items fall to the bottom.
  // Keep the original index so edits/toggles target the right item.
  const ordered = todos
    .map((todo, index) => ({ todo, index }))
    .sort((a, b) => {
      const diff = toMinutes(a.todo.start) - toMinutes(b.todo.start);
      return diff !== 0 ? diff : a.index - b.index;
    });

  return (
    <section className="card">
      <h2>
        <span className="icon">🗓️</span> Tomorrow's Schedule
        {todos.length > 0 && (
          <span className="count-chip">
            {todos.filter((t) => t.done).length}/{todos.length}
          </span>
        )}
      </h2>
      <p className="hint">Plan tomorrow hour by hour &mdash; add a time and it slots into place.</p>

      <div className="sched-add">
        <input
          type="text"
          className="sched-add-text"
          value={draft}
          placeholder="e.g. Finish the project outline"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <div className="sched-add-times">
          <label className="sched-time-field">
            <span>Start</span>
            <input
              type="time"
              value={startDraft}
              onChange={(e) => setStartDraft(e.target.value)}
            />
          </label>
          <label className="sched-time-field">
            <span>End</span>
            <input
              type="time"
              value={endDraft}
              onChange={(e) => setEndDraft(e.target.value)}
            />
          </label>
          <button type="button" className="sched-add-btn" onClick={addTodo}>
            Add
          </button>
        </div>
      </div>

      <ul className="schedule">
        {ordered.map(({ todo, index }) => {
          const id = todo.id ?? `i-${index}`;
          const timed = Boolean(todo.start);
          const editing = editingId === id;
          return (
            <li key={id} className="sched-item">
              <button
                type="button"
                className={`sched-time${timed ? "" : " untimed"}`}
                onClick={() => setEditingId(editing ? null : id)}
              >
                {timed ? formatRange(todo.start, todo.end) : "Set time"}
              </button>

              <div className="sched-main">
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => updateTodo(index, { done: !todo.done })}
                  />
                  <span className={todo.done ? "done" : ""}>{todo.text}</span>
                </label>
                <button
                  className="remove"
                  onClick={() => removeTodo(index)}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>

              {editing && (
                <div className="sched-edit">
                  <label className="sched-time-field">
                    <span>Start</span>
                    <input
                      type="time"
                      value={todo.start || ""}
                      onChange={(e) => updateTodo(index, { start: e.target.value })}
                    />
                  </label>
                  <label className="sched-time-field">
                    <span>End</span>
                    <input
                      type="time"
                      value={todo.end || ""}
                      onChange={(e) => updateTodo(index, { end: e.target.value })}
                    />
                  </label>
                  {timed && (
                    <button
                      type="button"
                      className="sched-edit-clear"
                      onClick={() => updateTodo(index, { start: "", end: "" })}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="sched-edit-done"
                    onClick={() => setEditingId(null)}
                  >
                    Done
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
