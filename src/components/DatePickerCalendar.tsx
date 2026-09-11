"use client";

import { useEffect, useState } from "react";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function DatePickerCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (dateISO: string) => void;
}) {
  const [openWeekdays, setOpenWeekdays] = useState<number[] | null>(null);
  const [viewYear, setViewYear] = useState(() => Number(value.split("-")[0]));
  const [viewMonth, setViewMonth] = useState(() => Number(value.split("-")[1]) - 1);

  useEffect(() => {
    fetch("/api/open-days")
      .then((res) => res.json())
      .then((data) => setOpenWeekdays(data.openWeekdays ?? [1, 2, 3, 4, 5, 6]));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // lundi = 0 ... dimanche = 6, pour aligner la grille sur une semaine commençant le lundi
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  function goToPrevMonth() {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  }

  function goToNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  const canGoPrev = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="w-full max-w-xs rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:opacity-20"
        >
          ‹
        </button>
        <p className="text-sm font-medium text-white">
          {MONTH_LABELS[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goToNextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-white/40">
        {DAY_LABELS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;

          const iso = toISO(d);
          const isPast = d < today;
          const isClosedWeekday = openWeekdays !== null && !openWeekdays.includes(d.getDay());
          const isDisabled = isPast || isClosedWeekday;
          const isSelected = iso === value;

          return (
            <button
              key={i}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(iso)}
              title={isClosedWeekday && !isPast ? "Fermé ce jour-là" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                isSelected
                  ? "bg-[#a855f7] font-semibold text-white"
                  : isDisabled
                    ? "cursor-not-allowed text-white/15"
                    : "text-white/80 hover:bg-white/10"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
