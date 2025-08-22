import { useState, useEffect } from "react";
import { getSunTimesRange } from "../lib/api.js";

export default function RangeCard({ city, startDate, endDate, tz }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ city, timezone: tz });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchNow() {
      setLoading(true);
      setErr(null);
      try {
        const res = await getSunTimesRange({ city, startDate, endDate, tz });
        const days = Array.isArray(res?.days) ? res.days : (Array.isArray(res) ? res : []);
        setRows(days);
        setMeta({ city: res?.city || city, timezone: res?.timezone || tz });
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    fetchNow();
  }, [city, startDate, endDate, tz]);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900">
      <div className="font-semibold mb-3">
        {city} — {startDate} → {endDate} ({meta.timezone || tz})
      </div>

      {loading && <div className="text-sm text-neutral-500">A carregar…</div>}
      {err && (
        <pre className="text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg overflow-auto">
          {JSON.stringify(err.body || err.message, null, 2)}
        </pre>
      )}
      {!loading && rows.length === 0 && !err && (
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Sem dados para este intervalo.
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid gap-2">
          {rows.map((d, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="rounded-lg p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Data</div>
                <div className="font-semibold">{d.date ?? "-"}</div>
              </div>
              <div className="rounded-lg p-2 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sm">
                <div className="text-xs text-sky-800 dark:text-sky-300">Nascer-do-sol</div>
                <div className="font-semibold">{d.sunrise ?? "-"}</div>
              </div>
              <div className="rounded-lg p-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 text-sm">
                <div className="text-xs text-orange-800 dark:text-orange-300">Pôr-do-sol</div>
                <div className="font-semibold">{d.sunset ?? "-"}</div>
              </div>
              <div className="rounded-lg p-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-sm">
                <div className="text-xs text-amber-800 dark:text-amber-300">Golden hour</div>
                <div><span className="font-medium">Início:</span> {d.goldenHourStart ?? "-"}</div>
                <div><span className="font-medium">Fim:</span> {d.goldenHourEnd ?? "-"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
