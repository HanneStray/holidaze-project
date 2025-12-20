import { useMemo, useState } from "react";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function monthKey(year, month) {
  return year * 12 + month;
}

export default function VenueCalendar({ bookings = [] }) {
  const today = new Date();

  const minYear = today.getFullYear();
  const minMonth = today.getMonth();

  const [view, setView] = useState({ year: minYear, month: minMonth });
  const viewYear = view.year;
  const viewMonth = view.month;

  const isPrevDisabled = useMemo(() => {
    return monthKey(viewYear, viewMonth) <= monthKey(minYear, minMonth);
  }, [viewYear, viewMonth, minYear, minMonth]);

  const isTodayDisabled = useMemo(() => {
    return viewYear === minYear && viewMonth === minMonth;
  }, [viewYear, viewMonth, minYear, minMonth]);

  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [viewYear, viewMonth]);

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const startOffset = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    return (firstDay + 6) % 7;
  }, [viewYear, viewMonth]);

  const normalizedBookings = useMemo(() => {
    return (bookings || [])
      .filter((b) => b?.dateFrom && b?.dateTo)
      .map((b) => ({
        id: b.id,
        from: startOfDay(b.dateFrom),
        to: startOfDay(b.dateTo),
      }));
  }, [bookings]);

  function isDayBooked(dayNumber) {
    const date = startOfDay(new Date(viewYear, viewMonth, dayNumber));

    return normalizedBookings.some((b) => date >= b.from && date < b.to);
  }

  function goPrevMonth() {
    if (isPrevDisabled) return;

    setView((prev) => {
      const y = prev.year;
      const m = prev.month;
      if (m === 0) return { year: y - 1, month: 11 };
      return { year: y, month: m - 1 };
    });
  }

  function goNextMonth() {
    setView((prev) => {
      const y = prev.year;
      const m = prev.month;
      if (m === 11) return { year: y + 1, month: 0 };
      return { year: y, month: m + 1 };
    });
  }

  function goToday() {
    setView({ year: minYear, month: minMonth });
  }

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ type: "empty", key: `empty-${viewYear}-${viewMonth}-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      type: "day",
      day,
      key: `day-${viewYear}-${viewMonth}-${day}`,
    });
  }

  const btnBase =
    "rounded border px-2 py-1 text-xs bg-white shadow-sm " +
    "cursor-pointer hover:bg-slate-50 hover:shadow hover:-translate-y-[1px] " +
    "active:bg-slate-100 active:scale-[0.97]" +
    "transition-all duration-150";

  const btnDisabled =
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover-translate-y-0";

  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="font-semibold text-sm">{monthLabel}</p>
          <p className="text-xs text-slate-500">
            Calendar - see booked and available days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevMonth}
            disabled={isPrevDisabled}
            className={`${btnBase} ${btnDisabled}`}
            title={
              isPrevDisabled
                ? "Can´t go before current month"
                : "Previous month"
            }
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden> ← </span>
            </span>
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={goToday}
            disabled={isTodayDisabled}
            className={`${btnBase} ${btnDisabled}`}
            title="Go to current month"
          >
            Today
          </button>

          <button
            type="button"
            onClick={goNextMonth}
            className={`${btnBase} ${btnDisabled}`}
            title="Next month"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-red-200 border border-red-300" />
          Booked
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-green-100 border border-green-300" />
          Available
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium mb-1">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {cells.map((cell) => {
          if (cell.type === "empty") {
            return <div key={cell.key} />;
          }

          const booked = isDayBooked(cell.day);

          return (
            <div
              key={cell.key}
              className={
                "p-2 rounded border flex flex-col items-center justify-center " +
                (booked
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-green-50 text-green-800 border-green-200")
              }
            >
              <span className="text-sm">{cell.day}</span>
              <span className="text-[10px] mt-1">
                {booked ? "Booked" : "Free"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
