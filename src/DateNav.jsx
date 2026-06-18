import { addDays, formatDisplayDate, todayKey } from "./dateUtils";

export default function DateNav({ dateKey, onChange }) {
  return (
    <div className="date-nav">
      <button onClick={() => onChange(addDays(dateKey, -1))} aria-label="Previous day">
        ←
      </button>
      <div className="date-display">
        <span>{formatDisplayDate(dateKey)}</span>
        {dateKey !== todayKey() && (
          <button className="today-btn" onClick={() => onChange(todayKey())}>
            Jump to today
          </button>
        )}
      </div>
      <button onClick={() => onChange(addDays(dateKey, 1))} aria-label="Next day">
        →
      </button>
    </div>
  );
}
