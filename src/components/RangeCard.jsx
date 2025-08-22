import { useEffect, useState } from "react";
import { getSunTimesRange } from "../lib/api.js";
import SunChart from "./SunChart.jsx";
import SunTable from "./SunTable.jsx";

export default function RangeCard({ city, startDate, endDate, tz }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ city, timezone: tz });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [view, setView] = useState("table");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await getSunTimesRange({ city, startDate, endDate, tz });
        if (cancelled) return;
        setRows(Array.isArray(res?.days) ? res.days : Array.isArray(res) ? res : []);
        setMeta({ city: res?.city || city, timezone: res?.timezone || tz });
      } catch (e) {
        if (!cancelled) setErr(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [city, startDate, endDate, tz]);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="font-semibold">
          {meta.city || city} — {startDate} → {endDate} ({meta.timezone || tz})
        </div>

        {/* Switch */}
        <div className="inline-flex rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setView("table")}
            className={
              "px-3 py-1.5 text-sm " +
              (view === "table"
                ? "bg-neutral-200 dark:bg-neutral-700"
                : "bg-white dark:bg-neutral-900")
            }
          >
            Tabela
          </button>
          <button
            type="button"
            onClick={() => setView("chart")}
            className={
              "px-3 py-1.5 text-sm border-l border-neutral-300 dark:border-neutral-700 " +
              (view === "chart"
                ? "bg-neutral-200 dark:bg-neutral-700"
                : "bg-white dark:bg-neutral-900")
            }
          >
            Gráfico
          </button>
        </div>
      </div>

      {/* States */}
      {loading && <div className="text-sm text-neutral-500 dark:text-neutral-400">A carregar…</div>}
      {err && (
        <pre className="text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg overflow-auto">
          {JSON.stringify(err.body || err.message, null, 2)}
        </pre>
      )}
      {!loading && !err && rows.length === 0 && (
        <div className="text-sm text-neutral-600 dark:text-neutral-300">Sem dados para este intervalo.</div>
      )}

      {/* Views */}
      {!loading && !err && rows.length > 0 && (
        view === "table" ? <SunTable rows={rows} /> : <SunChart rows={rows} />
      )}
    </div>
  );
}
