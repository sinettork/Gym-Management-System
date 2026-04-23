const days = [
  { label: 'Mon', value: 40, count: 320 },
  { label: 'Tue', value: 60, count: 450 },
  { label: 'Wed', value: 75, count: 510 },
  { label: 'Thu', value: 90, count: 680, active: true },
  { label: 'Fri', value: 80, count: 590 },
  { label: 'Sat', value: 50, count: 380 },
  { label: 'Sun', value: 30, count: 210 },
];

const ranges = ['Week', 'Month', 'Quarter'];

export default function CheckinsChart() {
  return (
    <div className="glass-card md:col-span-6 rounded-[1.75rem] p-card-padding">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-headline text-headline-md font-semibold text-on-surface">Daily Check-ins</h3>
          <p className="mt-1 text-sm text-on-surface-variant">Thu is the current peak day at 680 visits.</p>
        </div>
        <div className="flex rounded-pill bg-surface p-1" aria-label="Check-ins date range">
          {ranges.map((range) => (
            <button
              key={range}
              className={`rounded-pill px-3 py-1.5 text-xs font-bold transition-colors ${
                range === 'Week'
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-48 items-end justify-between gap-2 px-2">
        {days.map((day) => (
          <div
            key={day.label}
            className="group relative w-full cursor-pointer rounded-t-xl focus-within:outline-none"
            style={{ height: `${day.value}%` }}
          >
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-inverse-surface px-2 py-1 text-xs text-inverse-on-surface transition-opacity ${
              day.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {day.count} visits
            </div>
            <div
              aria-label={`${day.label}: ${day.count} visits`}
              className={`h-full w-full rounded-t-xl transition-all duration-300 group-hover:-translate-y-1 ${
                day.active
                  ? 'bg-primary-container'
                  : 'bg-surface-container group-hover:bg-surface-variant'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between px-2 text-xs font-medium">
        {days.map((day) => (
          <span key={day.label} className={`text-[11px] font-medium ${
            day.active ? 'font-bold text-on-surface' : 'text-on-surface-variant'
          }`}>
            {day.label}
          </span>
        ))}
      </div>
    </div>
  );
}
