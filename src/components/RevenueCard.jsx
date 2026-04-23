import { ArrowUpRight, Wallet } from 'lucide-react';

export default function RevenueCard() {
  const progress = 75;
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-card md:col-span-4 flex flex-col justify-between rounded-[1.75rem] p-card-padding">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-headline text-headline-md font-semibold text-on-surface">Revenue Growth</h3>
          <p className="mt-1 font-label text-label-sm font-semibold uppercase text-on-surface-variant">April target pace</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-on-surface-variant">
          <Wallet className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <div className="relative mb-2 w-full aspect-[2/1] overflow-hidden">
          <svg className="w-full h-full lime-glow" viewBox="0 0 200 100">
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="#f0f1f3"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="#c6f432"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="16"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <p className="font-headline text-stat-display font-bold leading-none text-on-surface">$45k</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between rounded-pill bg-surface px-4 py-2">
          <p className="font-label text-label-sm font-semibold text-on-surface-variant">Target: $60,000</p>
          <p className="text-xs font-bold text-lime-600">75% reached</p>
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded-pill bg-inverse-surface px-5 py-2.5 text-sm font-bold text-inverse-on-surface transition-transform hover:-translate-y-0.5 active:scale-95">
          View revenue report
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
