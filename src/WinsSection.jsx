import { useState } from "react";

export default function WinsSection({ wins, onChange }) {
  const [draft, setDraft] = useState("");

  function addWin() {
    const text = draft.trim();
    if (!text) return;
    onChange([...wins, text]);
    setDraft("");
  }

  function removeWin(index) {
    onChange(wins.filter((_, i) => i !== index));
  }

  return (
    <section className="card">
      <h2>
        <span className="icon">✨</span> Today's Little Wins
        {wins.length > 0 && <span className="count-chip">{wins.length}</span>}
      </h2>
      <p className="hint">Anything that went well, big or small.</p>
      <div className="add-row">
        <input
          type="text"
          value={draft}
          placeholder="e.g. Went for a walk this morning"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addWin()}
        />
        <button onClick={addWin}>Add</button>
      </div>
      <ul className="list">
        {wins.map((win, index) => (
          <li key={index}>
            <span>{win}</span>
            <button className="remove" onClick={() => removeWin(index)} aria-label="Remove">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
