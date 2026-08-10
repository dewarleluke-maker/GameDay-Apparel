import { useState } from "react";
import { entryHasContent } from "./useJournal";
import { buildMonth, formatDisplayDate, monthLabel, shortDate, todayKey } from "./dateUtils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MOOD_EMOJI = { Rough: "😞", Meh: "😕", Okay: "😐", Good: "🙂", Great: "🤩" };

function gradeClass(grade) {
  return grade ? grade.charAt(0).toLowerCase() : "";
}

function fmt(n) {
  return Number.isInteger(n) ? String(n) : Number(n).toFixed(1);
}

function ScoreChart({ points, onSelect }) {
  if (points.length === 0) {
    return (
      <p className="history-empty">
        Log a scorecard on any day and your daily scores will chart here.
      </p>
    );
  }

  const W = 320;
  const H = 190;
  const padL = 28;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = points.length;

  const x = (i) => (n === 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW);
  const y = (v) => padT + (1 - v / 100) * innerH;

  const gridValues = [0, 60, 80, 100];
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.total).toFixed(1)}`)
    .join(" ");

  return (
    <div className="history-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="history-chart-svg"
        role="img"
        aria-label="Daily scores over time"
      >
        <defs>
          <linearGradient id="scoreLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent2)" />
          </linearGradient>
        </defs>
        {gridValues.map((v) => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} className="history-grid-line" />
            <text x={padL - 6} y={y(v) + 3} className="history-axis-label" textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <path d={line} className="history-line" stroke="url(#scoreLine)" />
        {points.map((p, i) => (
          <circle
            key={p.dateKey}
            cx={x(i)}
            cy={y(p.total)}
            r="5"
            className={`history-point grade-${gradeClass(p.grade)}`}
            onClick={() => onSelect(p.dateKey)}
          >
            <title>{`${shortDate(p.dateKey)}: ${fmt(p.total)}/100 (${p.grade})`}</title>
          </circle>
        ))}
        <text x={x(0)} y={H - 8} className="history-axis-label" textAnchor="start">
          {shortDate(points[0].dateKey)}
        </text>
        {n > 1 && (
          <text x={x(n - 1)} y={H - 8} className="history-axis-label" textAnchor="end">
            {shortDate(points[n - 1].dateKey)}
          </text>
        )}
      </svg>
    </div>
  );
}

function DetailList({ label, items }) {
  return (
    <div className="history-detail-block">
      <span className="history-detail-label">{label}</span>
      <ul className="history-detail-list">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function DayDetail({ dateKey, entry, onClose, onOpenDay }) {
  const e = entry || {};
  const sc = e.scorecard;
  const wins = e.wins || [];
  const lessons = (e.lifeLessons || []).filter((l) => l && l.trim());
  const todos = e.tomorrowTodos || [];
  const noGos = e.noGos || [];
  const gratitude = (e.gratitude || []).filter((g) => g && g.trim());
  const affirmations = (e.affirmations || []).filter((a) => a && a.trim());

  const hasAny =
    sc ||
    e.mood ||
    wins.length ||
    lessons.length ||
    todos.length ||
    noGos.length ||
    gratitude.length ||
    affirmations.length;

  return (
    <div className="history-modal-backdrop" onClick={onClose}>
      <div className="history-modal" onClick={(ev) => ev.stopPropagation()}>
        <div className="history-modal-head">
          <h3>{formatDisplayDate(dateKey)}</h3>
          <button className="history-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {sc && (
          <div className="history-detail-score">
            <span className={`history-detail-grade grade-${gradeClass(sc.grade)}`}>{sc.grade}</span>
            <span className="history-detail-total">{fmt(sc.total)} / 100</span>
          </div>
        )}

        {!hasAny && <p className="history-empty">Nothing was logged this day.</p>}

        {e.mood && (
          <div className="history-detail-block">
            <span className="history-detail-label">Mood</span>
            <p className="history-detail-text">
              {MOOD_EMOJI[e.mood] ? `${MOOD_EMOJI[e.mood]} ` : ""}
              {e.mood}
            </p>
          </div>
        )}
        {wins.length > 0 && <DetailList label="Wins" items={wins} />}
        {lessons.length > 0 && <DetailList label="Life lessons" items={lessons} />}
        {todos.length > 0 && (
          <DetailList
            label="Tomorrow's to-dos"
            items={todos.map((t) => `${t.done ? "✓ " : ""}${t.text}`)}
          />
        )}
        {noGos.length > 0 && (
          <DetailList
            label="Won't do"
            items={noGos.map((g) => `${g.avoided ? "✓ " : ""}${g.text}`)}
          />
        )}
        {gratitude.length > 0 && <DetailList label="Grateful for" items={gratitude} />}
        {affirmations.length > 0 && <DetailList label="Affirmations" items={affirmations} />}

        <button className="history-open-btn" onClick={() => onOpenDay(dateKey)}>
          Open in journal &rarr;
        </button>
      </div>
    </div>
  );
}

export default function HistoryPage({ entries, onOpenDay }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [showChart, setShowChart] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const cells = buildMonth(cursor.y, cursor.m);
  const today = todayKey();
  const filledCount = cells.filter((k) => k && entryHasContent(entries[k])).length;

  function shiftMonth(delta) {
    setCursor(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const points = Object.keys(entries)
    .filter(
      (k) => entries[k] && entries[k].scorecard && typeof entries[k].scorecard.total === "number",
    )
    .sort()
    .map((k) => ({
      dateKey: k,
      total: entries[k].scorecard.total,
      grade: entries[k].scorecard.grade,
    }));

  return (
    <div className="history">
      <section className="card">
        <div className="history-cal-head">
          <button className="date-nav-arrow" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            ←
          </button>
          <h2 className="history-month">{monthLabel(cursor.y, cursor.m)}</h2>
          <button className="date-nav-arrow" onClick={() => shiftMonth(1)} aria-label="Next month">
            →
          </button>
        </div>
        <p className="hint">
          {filledCount} {filledCount === 1 ? "day" : "days"} logged this month.
        </p>

        <div className="history-weekdays">
          {WEEKDAYS.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="history-grid">
          {cells.map((key, i) => {
            if (!key) return <span key={`blank-${i}`} className="history-cell empty" />;
            const entry = entries[key];
            const filled = entryHasContent(entry);
            const sc = entry && entry.scorecard;
            const day = Number(key.split("-")[2]);
            return (
              <button
                key={key}
                className={`history-cell${filled ? " filled" : ""}${key === today ? " today" : ""}`}
                onClick={() => setSelectedDay(key)}
                aria-label={`${key}${filled ? ", logged" : ""}`}
              >
                <span className="history-cell-num">{day}</span>
                {sc ? (
                  <span className={`history-cell-grade grade-${gradeClass(sc.grade)}`}>
                    {sc.grade}
                  </span>
                ) : filled ? (
                  <span className="history-cell-dot" />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="history-toggle-row">
          <div>
            <h2>Score Trend</h2>
            <p className="hint" style={{ margin: 0 }}>
              Your daily score out of 100 over time.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showChart}
            aria-label="Toggle score graph"
            className={`history-switch${showChart ? " on" : ""}`}
            onClick={() => setShowChart((s) => !s)}
          >
            <span className="history-switch-knob" />
          </button>
        </div>
        {showChart && <ScoreChart points={points} onSelect={(k) => setSelectedDay(k)} />}
      </section>

      {selectedDay && (
        <DayDetail
          dateKey={selectedDay}
          entry={entries[selectedDay]}
          onClose={() => setSelectedDay(null)}
          onOpenDay={(k) => {
            setSelectedDay(null);
            onOpenDay(k);
          }}
        />
      )}
    </div>
  );
}
