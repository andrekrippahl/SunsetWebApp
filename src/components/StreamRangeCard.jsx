// src/components/StreamRangeCard.jsx
import { useEffect, useRef, useState } from "react";
import SunTable from "./SunTable.jsx";
import { streamRows } from "../lib/stream.js";
import ErrorCard from "./ErrorCard.jsx";

function toLocalHHMM(iso, tz) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz || "UTC" });
}
function splitGoldenHour(s) {
  if (!s) return { start: null, end: null };
  const [a, b] = String(s).split(" - ").map((x) => x?.trim() || null);
  return { start: a, end: b };
}
function normalizeRow(d, tz, fallbackCity) {
  const gh = splitGoldenHour(d.golden_hour);
  const goldenStart = d.golden_hour_start || gh.start;
  const goldenEnd   = d.golden_hour_end   || gh.end;
  return {
    date: d.date,
    sunrise: toLocalHHMM(d.sunrise, tz),
    sunset:  toLocalHHMM(d.sunset, tz),
    goldenHourStart: toLocalHHMM(goldenStart, tz),
    goldenHourEnd:   toLocalHHMM(goldenEnd, tz),
    city: d.city || fallbackCity,
    timezone: tz || d.timezone || d.tz,
    latitude: d.latitude,
    longitude: d.longitude,
  };
}

export default function StreamRangeCard({ city, startDate, endDate, tz }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ city, timezone: tz });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const ctrlRef = useRef(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const u = new URL(`${base.replace(/\/$/, "")}/sunsets/stream`);
    if (city)      u.searchParams.set("location", city);
    if (startDate) u.searchParams.set("start", startDate);
    if (endDate)   u.searchParams.set("end", endDate);
    if (tz)        u.searchParams.set("tz", tz);

    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    setRows([]);
    setErr(null);
    setLoading(true);

    // log content-type to console (handy for debugging once)
    // (will only show in devtools)
    streamRows({
      url: u.toString(),
      signal: ctrl.signal,
      onJson: (obj) => {
        const normalized = normalizeRow(obj, tz, city);
        setMeta((m) => ({ ...m, city: normalized.city || m.city, timezone: normalized.timezone || m.timezone }));
        setRows((prev) => [...prev, normalized]);
      },
      onDone: () => setLoading(false),
      onError: (e) => { setErr(e); setLoading(false); },
    });

    return () => ctrl.abort();
  }, [city, startDate, endDate, tz]);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="font-semibold">
          {meta.city || city} : {startDate} → {endDate} 
        </div>
        {loading && <div className="text-xs text-neutral-500 dark:text-neutral-400">Loading...</div>}
      </div>

      {err && (
        <ErrorCard
          error={err.body || err}  
          onRetry={() => {
            setErr(null);
          }}
        />
      )}

      {!err && <SunTable rows={rows} />}

      {!loading && !err && rows.length === 0 && (
        <div className="text-sm text-neutral-600 dark:text-neutral-300">Sem dados recebidos.</div>
      )}
    </div>
  );
}
