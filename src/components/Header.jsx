import { Bell, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 px-6 pt-4 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center justify-end gap-4">
        <div className="hidden items-center gap-2 rounded-pill bg-white px-3 py-2 text-xs font-semibold text-on-surface shadow-sm sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />
          Live
        </div>

        <button className="hidden rounded-full bg-white p-2 text-zinc-500 shadow-sm transition-colors hover:text-zinc-800 sm:inline-flex" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
        <button className="rounded-full bg-white p-2 text-zinc-500 shadow-sm transition-colors hover:text-zinc-800" aria-label="Settings">
          <Settings className="w-5 h-5" />
        </button>
        <button className="ml-1 h-10 w-10 overflow-hidden rounded-full bg-zinc-200 shadow-sm transition-transform hover:scale-105 active:scale-95" aria-label="Manager profile">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            alt="Manager Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
