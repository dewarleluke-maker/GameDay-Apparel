import { useState } from "react";

export default function TodoSection({ todos, onChange }) {
  const [draft, setDraft] = useState("");

  function addTodo() {
    const text = draft.trim();
    if (!text) return;
    onChange([...todos, { text, done: false }]);
    setDraft("");
  }

  function toggleTodo(index) {
    onChange(todos.map((todo, i) => (i === index ? { ...todo, done: !todo.done } : todo)));
  }

  function removeTodo(index) {
    onChange(todos.filter((_, i) => i !== index));
  }

  return (
    <section className="card">
      <h2>Tomorrow's To-Do List</h2>
      <p className="hint">Set up tomorrow before you close out today.</p>
      <div className="add-row">
        <input
          type="text"
          value={draft}
          placeholder="e.g. Finish the project outline"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="list">
        {todos.map((todo, index) => (
          <li key={index}>
            <label className="todo-label">
              <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(index)} />
              <span className={todo.done ? "done" : ""}>{todo.text}</span>
            </label>
            <button className="remove" onClick={() => removeTodo(index)} aria-label="Remove">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
