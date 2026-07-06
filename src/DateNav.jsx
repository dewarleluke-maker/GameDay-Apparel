import {
  addDays,
  dayOfMonth,
  formatDisplayDate,
  todayKey,
  weekOf,
  weekdayLetter,
} from "./dateUtils";

export default function DateNav({ dateKey, onChange, hasEntry }) {
  const week = weekOf(dateKey);
  const today = todayKey();

  return (
    <div className="date-nav">
      <div className="date-nav-top">
        <button
          className="date-nav-arrow"
          onClick={() => onChange(addDays(dateKey, -1))}
          aria-label="Previous day"
        >
          ←
        </button>
        <div className="date-display">
          <span>{formatDisplayDate(dateKey)}</span>
          {dateKey !== today && (
            <button className="today-btn" onClick={() => onChange(today)}>
              Jump to today
            </button>
          )}
        </div>
        <button
          className="date-nav-arrow"
          onClick={() => onChange(addDays(dateKey, 1))}
          aria-label="Next day"
        >
          →
        </button>
      </div>
      <div className="week-strip">
        {week.map((key) => (
          <button
            key={key}
            type="button"
            className={`week-day ${key === dateKey ? "selected" : ""} ${
              key === today ? "is-today" : ""
            }`}
            onClick={() => onChange(key)}
            aria-label={formatDisplayDate(key)}
          >
            <span className="week-day-letter">{weekdayLetter(key)}</span>
            <span className="week-day-num">{dayOfMonth(key)}</span>
            <span className={`week-dot ${hasEntry(key) ? "filled" : ""}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
