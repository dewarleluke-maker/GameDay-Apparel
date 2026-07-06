const MOODS = [
  { emoji: "😞", label: "Rough" },
  { emoji: "😕", label: "Meh" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "🤩", label: "Great" },
];

export default function MoodPicker({ mood, onChange }) {
  return (
    <section className="card">
      <h2>
        <span className="icon">🌤️</span> How was today?
      </h2>
      <p className="hint">Tap the mood that fits. Tap again to clear it.</p>
      <div className="mood-row">
        {MOODS.map((m) => (
          <button
            key={m.label}
            type="button"
            className={`mood-btn ${mood === m.label ? "selected" : ""}`}
            onClick={() => onChange(mood === m.label ? null : m.label)}
            aria-pressed={mood === m.label}
          >
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-label">{m.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
