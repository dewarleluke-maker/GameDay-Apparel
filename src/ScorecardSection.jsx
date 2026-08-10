const CATEGORIES = [
  { key: "god", label: "Time with God", weight: 20 },
  { key: "fitness", label: "Fitness", weight: 15 },
  { key: "work", label: "Work finished", weight: 10 },
  { key: "sleep", label: "Sleep", weight: 10 },
  { key: "nutrition", label: "Nutrition", weight: 10 },
  { key: "discipline", label: "Discipline", weight: 10 },
  { key: "learning", label: "Learning", weight: 10 },
  { key: "relationships", label: "Relationships", weight: 5 },
  { key: "supplements", label: "Supplements", weight: 5 },
  { key: "windDown", label: "Wind down", weight: 5 },
];

function letterGrade(total) {
  if (total >= 97) return "A+";
  if (total >= 93) return "A";
  if (total >= 90) return "A−";
  if (total >= 87) return "B+";
  if (total >= 83) return "B";
  if (total >= 80) return "B−";
  if (total >= 77) return "C+";
  if (total >= 73) return "C";
  if (total >= 70) return "C−";
  if (total >= 60) return "D";
  return "F";
}

function gradeClass(grade) {
  return grade.charAt(0).toLowerCase();
}

// Trim a trailing ".0" — every contribution is a multiple of 0.5, so one decimal is enough.
function fmt(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function emptyRatings() {
  return Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]));
}

function totalFor(ratings) {
  return CATEGORIES.reduce((sum, c) => sum + ((ratings[c.key] ?? 0) / 10) * c.weight, 0);
}

export default function ScorecardSection({ scorecard, onChange }) {
  const ratings = scorecard?.ratings ?? emptyRatings();
  const total = totalFor(ratings);
  const grade = letterGrade(total);

  function setRating(key, value) {
    const nextRatings = { ...emptyRatings(), ...ratings, [key]: value };
    const nextTotal = totalFor(nextRatings);
    onChange({
      ratings: nextRatings,
      total: nextTotal,
      grade: letterGrade(nextTotal),
    });
  }

  return (
    <section className="card scorecard">
      <h2>
        <span className="icon">📊</span> Daily Scorecard
      </h2>
      <p className="hint">Rate each area 0&ndash;10. Weighted to a daily score out of 100.</p>

      <div className="scorecard-summary">
        <div className={`scorecard-grade grade-${gradeClass(grade)}`}>{grade}</div>
        <div className="scorecard-total">
          <span className="scorecard-total-num">{fmt(total)}</span>
          <span className="scorecard-total-max">/ 100</span>
        </div>
      </div>

      <div className="scorecard-list">
        {CATEGORIES.map((c) => {
          const rating = ratings[c.key] ?? 0;
          const points = (rating / 10) * c.weight;
          return (
            <div className="scorecard-row" key={c.key}>
              <div className="scorecard-row-head">
                <span className="scorecard-cat">
                  {c.label} <span className="scorecard-weight">({c.weight} pts)</span>
                </span>
                <span className="scorecard-contribution">
                  {rating}/10 &rarr; {fmt(points)} pts
                </span>
              </div>
              <input
                type="range"
                className="scorecard-slider"
                min="0"
                max="10"
                step="1"
                value={rating}
                onChange={(e) => setRating(c.key, Number(e.target.value))}
                aria-label={`${c.label} rating out of 10`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
