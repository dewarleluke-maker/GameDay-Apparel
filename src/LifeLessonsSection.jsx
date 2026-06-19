export default function LifeLessonsSection({ lessons, onChange }) {
  function updateLesson(index, value) {
    const next = [...lessons];
    next[index] = value;
    onChange(next);
  }

  function addLesson() {
    onChange([...lessons, ""]);
  }

  function removeLesson(index) {
    onChange(lessons.filter((_, i) => i !== index));
  }

  return (
    <section className="card">
      <h2>
        <span className="icon">🧠</span> Life Lessons
      </h2>
      <p className="hint">What did today teach you?</p>
      <ol className="five-list">
        {lessons.map((lesson, index) => (
          <li key={index}>
            <input
              type="text"
              value={lesson}
              placeholder="A lesson I learned today..."
              onChange={(e) => updateLesson(index, e.target.value)}
            />
            {index >= 2 && (
              <button className="remove" onClick={() => removeLesson(index)} aria-label="Remove">
                ✕
              </button>
            )}
          </li>
        ))}
      </ol>
      <button className="add-more-btn" onClick={addLesson}>
        + Add another lesson
      </button>
    </section>
  );
}
