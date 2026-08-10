import { useState } from "react";
import DateNav from "./DateNav";
import DayProgress from "./DayProgress";
import MoodPicker from "./MoodPicker";
import ScorecardSection from "./ScorecardSection";
import WinsSection from "./WinsSection";
import LifeLessonsSection from "./LifeLessonsSection";
import TodoSection from "./TodoSection";
import NoGoSection from "./NoGoSection";
import FiveListSection from "./FiveListSection";
import HistoryPage from "./HistoryPage";
import { entryHasContent, useJournal } from "./useJournal";
import { addDays, todayKey } from "./dateUtils";
import "./App.css";

function computeStreak(entries) {
  let key = todayKey();
  if (!entryHasContent(entries[key])) {
    key = addDays(key, -1);
  }
  let streak = 0;
  while (entryHasContent(entries[key])) {
    streak += 1;
    key = addDays(key, -1);
  }
  return streak;
}

export default function App() {
  const [dateKey, setDateKey] = useState(todayKey());
  const [view, setView] = useState("journal");
  const { entries, getEntry, updateEntry } = useJournal();
  const entry = getEntry(dateKey);
  const streak = computeStreak(entries);

  return (
    <div className="app">
      <header>
        <h1>
          <span className="icon">🌿</span> Daily Wins Journal
        </h1>
        <p className="tagline">
          Notice the good, plan ahead, and let go of what holds you back.
        </p>
        {streak > 0 && (
          <div className="streak" title="Consecutive days journaled">
            🔥 {streak}-day streak
          </div>
        )}
      </header>

      <nav className="view-nav">
        <button
          className={`view-tab${view === "journal" ? " active" : ""}`}
          onClick={() => setView("journal")}
        >
          Journal
        </button>
        <button
          className={`view-tab${view === "history" ? " active" : ""}`}
          onClick={() => setView("history")}
        >
          History
        </button>
      </nav>

      {view === "journal" ? (
        <>
          <DateNav
            dateKey={dateKey}
            onChange={setDateKey}
            hasEntry={(key) => entryHasContent(entries[key])}
          />

          <DayProgress entry={entry} />

          <main>
            <MoodPicker
              mood={entry.mood}
              onChange={(mood) => updateEntry(dateKey, (current) => ({ ...current, mood }))}
            />

            <ScorecardSection
              scorecard={entry.scorecard}
              onChange={(scorecard) =>
                updateEntry(dateKey, (current) => ({ ...current, scorecard }))
              }
            />

            <WinsSection
              wins={entry.wins}
              onChange={(wins) => updateEntry(dateKey, (current) => ({ ...current, wins }))}
            />

            <LifeLessonsSection
              lessons={entry.lifeLessons}
              onChange={(lifeLessons) =>
                updateEntry(dateKey, (current) => ({ ...current, lifeLessons }))
              }
            />

            <TodoSection
              todos={entry.tomorrowTodos}
              onChange={(tomorrowTodos) =>
                updateEntry(dateKey, (current) => ({ ...current, tomorrowTodos }))
              }
            />

            <NoGoSection
              noGos={entry.noGos}
              onChange={(noGos) => updateEntry(dateKey, (current) => ({ ...current, noGos }))}
            />

            <FiveListSection
              icon="🙏"
              title="5 Things I'm Thankful For"
              hint="Take a moment to appreciate what you have."
              items={entry.gratitude}
              placeholder="I'm thankful for..."
              onChange={(gratitude) =>
                updateEntry(dateKey, (current) => ({ ...current, gratitude }))
              }
            />

            <FiveListSection
              icon="💪"
              title="5 Affirmations"
              hint="Speak some positivity into tomorrow."
              items={entry.affirmations}
              placeholder="I am..."
              onChange={(affirmations) =>
                updateEntry(dateKey, (current) => ({ ...current, affirmations }))
              }
            />
          </main>
        </>
      ) : (
        <HistoryPage
          entries={entries}
          onOpenDay={(key) => {
            setDateKey(key);
            setView("journal");
          }}
        />
      )}

      <footer>
        <p>Your entries are saved automatically in this browser.</p>
      </footer>
    </div>
  );
}
