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
