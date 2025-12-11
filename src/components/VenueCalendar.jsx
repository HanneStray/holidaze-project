function VenueCalendar({ bookings = [] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  //monday first
  const startOffset = (firstDayOfMonth + 6) % 7;

  function isDayBooked(dayNumber) {
    const date = new Date(year, month, dayNumber);

    return bookings.some((booking) => {
      if (!booking.dateFrom || !booking.dateTo) {
        return false;
      }

      const from = new Date(booking.dataFrom);
      const to = new Date(booking.dateTo);

      //is date from to? inclusive.
      return date >= from && date <= to;
    });
  }

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ type: "empty", key: `empty-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ type: "day", day, key: `day-${day}` });
  }

  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="font-semibold text-sm">
            {" "}
            {monthName} {year}{" "}
          </p>
          <p className="text-xs text-slate-500">
            Calendar - see booked and available days
          </p>
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
      </div>

      <div className="grid grid-cols-2 gap-1 text-center text-[11px] font-medium mb-1">
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
                  : "bg-green-50 text-green-800 border.green-200")
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

export default VenueCalendar;
