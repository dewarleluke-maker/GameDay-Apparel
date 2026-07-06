function filledCount(items) {
  return items.filter((item) => item.trim()).length;
}

function completionPercent(entry) {
  const scores = [
    entry.mood != null ? 1 : 0,
    entry.wins.length > 0 ? 1 : 0,
    entry.lifeLessons.some((l) => l.trim()) ? 1 : 0,
    entry.tomorrowTodos.length > 0 ? 1 : 0,
    entry.noGos.length > 0 ? 1 : 0,
    entry.gratitude.length ? filledCount(entry.gratitude) / entry.gratitude.length : 0,
    entry.affirmations.length ? filledCount(entry.affirmations) / entry.affirmations.length : 0,
  ];
  return Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 100);
}

export default function DayProgress({ entry }) {
  const percent = completionPercent(entry);
  const complete = percent === 100;

  return (
    <div className={`day-progress ${complete ? "complete" : ""}`}>
      <div className="day-progress-track">
        <div className="day-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="day-progress-label">
        {complete ? "Day complete! 🎉" : `${percent}% of today's journal filled`}
      </span>
    </div>
  );
}
