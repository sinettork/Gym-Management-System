import { ArrowUpRight, MoreHorizontal, UserPlus, RefreshCw, Ticket, XCircle, TrendingUp } from 'lucide-react';

const stats = [
  { icon: UserPlus, label: 'New Members', value: '+142', trend: '12% vs last month', action: 'View joins', trendUp: true, color: 'text-lime-600' },
  { icon: RefreshCw, label: 'Renewals', value: '890', trend: 'Steady retention', action: 'Open renewals', trendUp: null, color: 'text-zinc-500' },
  { icon: Ticket, label: 'Trial Passes', value: '64', trend: '22 need follow-up', action: 'Follow up', color: 'text-zinc-500' },
  { icon: XCircle, label: 'Cancellations', value: '12', trend: 'Review this week', action: 'Review risk', color: 'text-red-500', isError: true },
];

export default function MembershipCard() {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = 75;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-card md:col-span-8 flex flex-col items-center gap-8 rounded-[1.75rem] p-card-padding md:flex-row">
      <div className="flex-1 w-full">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="font-headline text-headline-md font-semibold text-on-surface">Membership Overview</h3>
            <p className="mt-1 font-label text-label-sm font-semibold uppercase text-on-surface-variant">Monthly Goal Progress</p>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-variant" aria-label="Open membership options">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <button key={stat.label} className="group flex items-start gap-4 rounded-3xl bg-surface p-4 text-left transition-all hover:bg-surface-container-low hover:shadow-sm active:scale-[0.99]">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-on-surface-variant shadow-sm">
                <stat.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm text-on-surface-variant">{stat.label}</p>
                <p className={`font-headline text-stat-display font-bold tracking-[-0.02em] ${stat.isError ? 'text-error' : 'text-on-surface'}`}>
                  {stat.value}
                </p>
                {stat.trend && (
                  <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${stat.color}`}>
                    {stat.trendUp === true && <TrendingUp className="h-4 w-4" aria-hidden="true" />}
                    {stat.trend}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 rounded-pill bg-white px-3 py-1 text-xs font-bold text-on-surface-variant shadow-sm transition-colors group-hover:text-on-surface">
                  {stat.action}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-48 w-48 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90 lime-glow" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="#f0f1f3"
            strokeWidth="12"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="#c6f432"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-stat-display font-bold tracking-[-0.02em] text-on-surface">1,500</span>
          <span className="font-label text-label-sm text-on-surface-variant">Total Active</span>
          <span className="mt-2 rounded-pill bg-primary-container/30 px-3 py-1 font-label text-[11px] font-bold text-primary">75% goal</span>
        </div>
      </div>
    </div>
  );
}
