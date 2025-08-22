// src/components/SunTable.jsx
import React from "react";

export default function SunTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  return (
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
  );
}
