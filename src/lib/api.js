// src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const ENDPOINT = import.meta.env.VITE_API_SUNSET_PATH || "/sunsets";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) { const err = new Error(`HTTP ${res.status}`); err.status = res.status; err.body = data; throw err; }
  return data;
}

// helpers de formatação
function toLocalHHMM(iso, tz) {
  if (!iso) return null;
  const d = new Date(iso);
  // en-GB → HH:mm de 00–23
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz || "UTC" });
}

function splitGoldenHour(s) {
  if (!s) return { start: null, end: null };
  const [a, b] = String(s).split(" - ").map(x => x?.trim() || null);
  return { start: a, end: b };
}

// ✅ chamada usada pelos componentes
export async function getSunTimesRange({ city, startDate, endDate, tz }) {
  const u = new URL(`${BASE_URL}${ENDPOINT}`);
  if (city)      u.searchParams.set("location", city);
  if (startDate) u.searchParams.set("start", startDate);
  if (endDate)   u.searchParams.set("end", endDate);
  if (tz)        u.searchParams.set("tz", tz);

  const data = await fetchJson(u.toString());

  // A API pode devolver array simples: [{ date, sunrise, sunset, golden_hour, ... }]
  const rows = Array.isArray(data) ? data : (Array.isArray(data?.days) ? data.days : []);

  const days = rows.map(d => {
    const gh = splitGoldenHour(d.golden_hour);
    const goldenStart = d.golden_hour_start || gh.start;
    const goldenEnd   = d.golden_hour_end   || gh.end;

    return {
      date: d.date,
      sunrise: toLocalHHMM(d.sunrise, tz),
      sunset:  toLocalHHMM(d.sunset, tz),
      goldenHourStart: toLocalHHMM(goldenStart, tz),
      goldenHourEnd:   toLocalHHMM(goldenEnd, tz),
      city: d.city || city,
      timezone: tz || d.timezone || d.tz,
      latitude: d.latitude,
      longitude: d.longitude,
    };
  });

  return { city: city, timezone: tz, days, raw: data };
}
