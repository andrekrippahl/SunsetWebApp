// src/components/SearchFormCity.jsx
import { useState } from "react";

export default function SearchFormCity({ onSubmit }) {
  const [city, setCity] = useState("Lisbon");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0,10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0,10));
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

  function handleSubmit(e) {
    e.preventDefault();
    if (!city || !startDate || !endDate) return;
    onSubmit({ city, startDate, endDate, tz });
  }

  const inputCls =
    "w-full rounded-xl border px-3 py-2 " +
    "border-neutral-300 dark:border-neutral-700 " +
    "bg-white dark:bg-neutral-900 " +
    "text-neutral-900 dark:text-neutral-100 " +
    "placeholder:text-neutral-400 " +
    "outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900";

  const disabled = !city || !startDate || !endDate;

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
      <input
        className={`sm:col-span-2 ${inputCls}`}
        placeholder="Lisbon"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="date"
        className={inputCls}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className={inputCls}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled}
        className="sm:col-span-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2 disabled:opacity-50"
      >
        Pesquisar
      </button>
    </form>
  );
}
