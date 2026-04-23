export default function StatsCards() {
  return (
    <div className="md:col-span-3 flex flex-col gap-gutter">
      <button className="glass-card relative flex flex-1 flex-col justify-center overflow-hidden rounded-[1.75rem] p-card-padding text-left active:scale-[0.99]">
        <div className="absolute -mr-4 -mt-4 right-0 top-0 h-24 w-24 rounded-bl-full bg-primary-container/20" />
        <p className="mb-2 font-label text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Retention Rate</p>
        <p className="font-headline text-stat-display font-bold text-on-surface">
          92<span className="text-xl font-semibold text-on-surface-variant">%</span>
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm text-on-surface-variant">
          <span className="inline-block h-2 w-2 rounded-full bg-primary-container" />
          Above industry avg
        </p>
        <p className="mt-4 rounded-pill bg-white px-3 py-1.5 text-center text-xs font-bold text-lime-700 shadow-sm">
          +4% this quarter
        </p>
      </button>

      <button className="glass-card flex flex-1 flex-col justify-center rounded-[1.75rem] p-card-padding text-left active:scale-[0.99]">
        <p className="mb-2 font-label text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Active Subscriptions</p>
        <p className="font-headline text-stat-display font-bold text-on-surface">
          84<span className="text-xl font-semibold text-on-surface-variant">%</span>
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-container">
          <div className="shimmer h-full rounded-full bg-inverse-surface transition-all duration-700" style={{ width: '84%' }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant">
          <span>1,260 active</span>
          <span>Facility Capacity</span>
        </div>
      </button>
    </div>
  );
}
