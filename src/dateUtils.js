export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

function toDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateKey, amount) {
  const date = toDate(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function formatDisplayDate(dateKey) {
  return toDate(dateKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function weekOf(dateKey) {
  const date = toDate(dateKey);
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return toDateKey(day);
  });
}

export function weekdayLetter(dateKey) {
  return "SMTWTFS"[toDate(dateKey).getDay()];
}

export function dayOfMonth(dateKey) {
  return toDate(dateKey).getDate();
}

export function monthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

// Calendar grid for a month: leading nulls pad to the first weekday,
// then a dateKey for each day of the month.
export function buildMonth(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= days; d += 1) cells.push(toDateKey(new Date(year, month, d)));
  return cells;
}

export function shortDate(dateKey) {
  return toDate(dateKey).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
  });
}
