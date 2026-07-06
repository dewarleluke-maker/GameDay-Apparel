import { useEffect, useState } from "react";

const STORAGE_KEY = "daily-wins-journal";

function emptyEntry() {
  return {
    mood: null,
    wins: [],
    lifeLessons: ["", ""],
    tomorrowTodos: [],
    noGos: [],
    gratitude: ["", "", "", "", ""],
    affirmations: ["", "", "", "", ""],
  };
}

export function entryHasContent(entry) {
  if (!entry) return false;
  return (
    entry.mood != null ||
    (entry.wins?.length ?? 0) > 0 ||
    (entry.tomorrowTodos?.length ?? 0) > 0 ||
    (entry.noGos?.length ?? 0) > 0 ||
    (entry.lifeLessons ?? []).some((l) => l.trim()) ||
    (entry.gratitude ?? []).some((g) => g.trim()) ||
    (entry.affirmations ?? []).some((a) => a.trim())
  );
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
      const current = { ...emptyEntry(), ...prev[dateKey] };
      return { ...prev, [dateKey]: updater(current) };
    });
  }

  return { entries, getEntry, updateEntry };
}
