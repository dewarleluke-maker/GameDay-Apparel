import { useState } from "react";
import DateNav from "./DateNav";
import WinsSection from "./WinsSection";
import TodoSection from "./TodoSection";
import FiveListSection from "./FiveListSection";
import { useJournal } from "./useJournal";
import { todayKey } from "./dateUtils";
import "./App.css";

export default function App() {
  const [dateKey, setDateKey] = useState(todayKey());
  const { getEntry, updateEntry } = useJournal();
  const entry = getEntry(dateKey);

  return (
    <div className="app">
      <header>
        <h1>Daily Wins Journal</h1>
        <p className="tagline">Notice the good, plan ahead, and remember what you're grateful for.</p>
      </header>

      <DateNav dateKey={dateKey} onChange={setDateKey} />

      <main>
        <WinsSection
          wins={entry.wins}
          onChange={(wins) => updateEntry(dateKey, (current) => ({ ...current, wins }))}
        />

        <TodoSection
          todos={entry.tomorrowTodos}
          onChange={(tomorrowTodos) =>
            updateEntry(dateKey, (current) => ({ ...current, tomorrowTodos }))
          }
        />

        <FiveListSection
          title="5 Things I'm Thankful For"
          hint="Take a moment to appreciate what you have."
          items={entry.gratitude}
          placeholder="I'm thankful for..."
          onChange={(gratitude) => updateEntry(dateKey, (current) => ({ ...current, gratitude }))}
        />

        <FiveListSection
          title="5 Affirmations"
          hint="Speak some positivity into tomorrow."
          items={entry.affirmations}
          placeholder="I am..."
          onChange={(affirmations) =>
            updateEntry(dateKey, (current) => ({ ...current, affirmations }))
          }
        />
      </main>

      <footer>
        <p>Your entries are saved automatically in this browser.</p>
      </footer>
    </div>
  );
}
