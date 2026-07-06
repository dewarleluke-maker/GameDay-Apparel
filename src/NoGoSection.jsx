import { useState } from "react";

export default function NoGoSection({ noGos, onChange }) {
  const [draft, setDraft] = useState("");

  function addNoGo() {
    const text = draft.trim();
    if (!text) return;
    onChange([...noGos, { text, avoided: false }]);
    setDraft("");
  }

  function toggleNoGo(index) {
    onChange(noGos.map((item, i) => (i === index ? { ...item, avoided: !item.avoided } : item)));
  }

  function removeNoGo(index) {
    onChange(noGos.filter((_, i) => i !== index));
  }

  return (
    <section className="card card-nogo">
      <h2>
        <span className="icon">🚫</span> Tomorrow I Won&rsquo;t
        {noGos.length > 0 && <span className="count-chip">{noGos.length}</span>}
      </h2>
      <p className="hint">
        Name the habits you&rsquo;re leaving behind &mdash; check each one off tomorrow when you stay
        clear of it.
      </p>
      <div className="add-row">
        <input
          type="text"
          value={draft}
          placeholder="e.g. Scroll my phone in bed"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNoGo()}
        />
        <button onClick={addNoGo}>Add</button>
      </div>
      <ul className="list nogo-list">
        {noGos.map((item, index) => (
          <li key={index} className={item.avoided ? "avoided" : ""}>
            <label className="todo-label">
              <input
                type="checkbox"
                checked={item.avoided}
                onChange={() => toggleNoGo(index)}
                title="I stayed away from this"
              />
              <span>{item.text}</span>
            </label>
            {item.avoided && <span className="avoided-badge">Avoided ✓</span>}
            <button className="remove" onClick={() => removeNoGo(index)} aria-label="Remove">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
