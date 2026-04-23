const targets = [
  { label: 'Quarterly Revenue', value: 75, color: 'bg-primary-container', status: 'On pace' },
  { label: 'Staff Efficiency', value: 90, color: 'bg-zinc-900', status: 'Strong' },
  { label: 'Equipment Maintenance', value: 40, color: 'bg-zinc-400', status: 'Needs action' },
];

export default function BusinessTargets() {
  return (
    <div className="glass-card md:col-span-3 flex flex-col rounded-[1.75rem] p-card-padding">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-headline text-headline-md font-semibold text-on-surface">Business Targets</h3>
          <p className="mt-1 text-sm text-on-surface-variant">Monthly operating goals</p>
        </div>
        <span className="rounded-pill bg-primary-container/30 px-3 py-1 text-xs font-bold text-primary">2 on track</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-5">
        {targets.map((target) => (
          <button key={target.label} className="group text-left">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-on-surface">{target.label}</span>
              <span className="text-on-surface-variant">{target.value}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                aria-label={`${target.label} is ${target.value}% complete`}
                className={`${target.color} h-full rounded-full transition-all duration-700 shimmer`}
                style={{ width: `${target.value}%` }}
              />
            </div>
            <p className="mt-1 text-xs font-semibold text-on-surface-variant transition-colors group-hover:text-on-surface">
              {target.status}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
