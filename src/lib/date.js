// src/lib/date.js
export function toISODate(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const d2 = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${d2}`;
}

export function eachDate(startStr, endStr) {
  const dates = [];
  const start = new Date(startStr);
  const end   = new Date(endStr);
  if (isNaN(start) || isNaN(end) || start > end) return dates;
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(toISODate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

