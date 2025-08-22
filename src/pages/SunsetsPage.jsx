// src/pages/SunsetsPage.jsx
import { useState } from "react";
import SearchFormCity from "../components/SearchFormCity.jsx";
import RangeCard from "../components/RangeCard.jsx";

export default function SunsetsPage() {
  const [cards, setCards] = useState([]);

  function handleSearch({ city, startDate, endDate, tz }) {
    if (!city) return;
    setCards(prev => [
      { id: `${city}-${startDate}-${endDate}-${Date.now()}`, city, startDate, endDate, tz },
      ...prev,
    ]);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div className="grid gap-4">
        {/* bloco do formulário */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900">
          <SearchFormCity onSubmit={handleSearch} />
        </div>

        {/* blocos de resultados */}
        <div className="grid gap-4">
          {cards.map(c => (
            <RangeCard
              key={c.id}
              city={c.city}
              startDate={c.startDate}
              endDate={c.endDate}
              tz={c.tz}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
