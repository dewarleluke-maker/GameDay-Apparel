import { useEffect, useState } from "react";

const STORAGE_KEY = "daily-wins-journal";

function emptyEntry() {
  return {
    wins: [],
    lifeLessons: ["", ""],
    tomorrowTodos: [],
    gratitude: ["", "", "", "", ""],
    affirmations: ["", "", "", "", ""],
  };
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useJournal() {
  const [entries, setEntries] = useState(loadEntries);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function getEntry(dateKey) {
    return { ...emptyEntry(), ...entries[dateKey] };
  }

  function updateEntry(dateKey, updater) {
    setEntries((prev) => {
      const current = prev[dateKey] ?? emptyEntry();
      return { ...prev, [dateKey]: updater(current) };
    });
  }

  return { getEntry, updateEntry };
}
