import { useState } from 'react';
import { 
  Home, 
  Users, 
  Contact, 
  Dumbbell, 
  Calendar, 
  Banknote,
  Plus,
  Settings,
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: Users, label: 'Members' },
  { icon: Contact, label: 'Staff' },
  { icon: Dumbbell, label: 'Equipment' },
  { icon: Calendar, label: 'Classes' },
  { icon: Banknote, label: 'Financials' },
];

const utilityItems = [
  { icon: Settings, label: 'Settings' },
  { icon: LogOut, label: 'Logout' },
];

function SidebarButton({ icon: Icon, label, active, expanded, onClick, variant = 'default' }) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex items-center rounded-full transition-all duration-200 active:scale-95 ${
        isPrimary
          ? `${expanded ? 'h-12 w-full justify-start gap-3 px-4' : 'h-12 w-12 justify-center'} bg-primary-container text-on-primary-fixed shadow-sm hover:-translate-y-0.5 hover:opacity-90 ${active ? 'ring-4 ring-primary-container/30' : ''}`
          : active
            ? `${expanded ? 'h-12 w-full justify-start gap-3 px-4' : 'h-14 w-14 justify-center'} bg-zinc-900 text-white shadow-sm`
            : `${expanded ? 'h-12 w-full justify-start gap-3 px-4' : 'h-12 w-12 justify-center'} text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900`
      }`}
    >
      <Icon className="h-6 w-6 shrink-0" strokeWidth={active || isPrimary ? 2.25 : 1.75} />
      <span className={expanded ? 'truncate text-sm font-bold' : 'sr-only'}>{label}</span>
      <span className={`pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-pill bg-inverse-surface px-3 py-1.5 text-xs font-bold text-inverse-on-surface opacity-0 shadow-sm transition-opacity group-hover:opacity-100 md:block ${expanded ? 'md:hidden' : ''}`}>
        {label}
      </span>
    </button>
  );
}

function SidebarContent({ activeItem, activeUtility, expanded, onNavigate, onUtility, onToggleExpanded }) {
  return (
    <>
      <div className={`mb-2 flex w-full items-center ${expanded ? 'justify-between gap-3 px-1' : 'justify-center'}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <Zap className="h-7 w-7" strokeWidth={2.5} />
          <span className="sr-only">Titan Gym</span>
        </div>
        {expanded && (
          <>
            <div className="min-w-0 flex-1">
              <p className="font-headline text-sm font-bold text-on-surface">Titan Gym</p>
              <p className="font-label text-[11px] font-semibold uppercase text-on-surface-variant">Manager OS</p>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-zinc-500 transition-colors hover:bg-surface-container hover:text-zinc-900"
              onClick={onToggleExpanded}
              aria-label="Hide navigation labels"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </>
        )}
      </div>

      {!expanded && (
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-zinc-500 transition-colors hover:bg-surface-container hover:text-zinc-900"
          onClick={onToggleExpanded}
          aria-label="Show navigation labels"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className={`${expanded ? 'w-full' : 'w-8'} h-px bg-zinc-200`} />

      <div className={`flex-1 flex w-full flex-col ${expanded ? 'items-stretch gap-2' : 'items-center gap-4'}`}>
        {navItems.map((item) => (
          <SidebarButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.label}
            expanded={expanded}
            onClick={() => onNavigate(item.label)}
          />
        ))}
      </div>

      <div className={`mt-auto flex w-full flex-col ${expanded ? 'items-stretch gap-2' : 'items-center gap-4'}`}>
        <SidebarButton
          icon={Plus}
          label="Add Member"
          variant="primary"
          active={activeUtility === 'Add Member'}
          expanded={expanded}
          onClick={() => onUtility('Add Member')}
        />

        <div className={`my-2 h-px ${expanded ? 'w-full' : 'w-8'} bg-zinc-200`} />

        {utilityItems.map((item) => (
          <SidebarButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeUtility === item.label}
            expanded={expanded}
            onClick={() => onUtility(item.label)}
          />
        ))}
      </div>
    </>
  );
}

export default function Sidebar({
  activeItem = 'Dashboard',
  expanded = false,
  onNavigate = () => {},
  onToggleExpanded = () => {},
  onUtility = () => {},
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeUtility, setActiveUtility] = useState('');

  const handleNavigate = (label) => {
    setActiveUtility('');
    onNavigate(label);
    setMobileOpen(false);
  };

  const handleUtility = (label) => {
    setActiveUtility(label);
    onUtility(label);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-600 shadow-md transition-colors hover:bg-zinc-50 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="fixed left-4 top-4 relative flex h-[calc(100vh-32px)] w-72 flex-col items-center gap-6 rounded-[40px] border border-zinc-100 bg-white px-4 py-8 text-sm shadow-nav animate-fade-in-up">
            <button
              className="absolute right-1 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <SidebarContent
              activeItem={activeItem}
              activeUtility={activeUtility}
              expanded
              onNavigate={handleNavigate}
              onToggleExpanded={() => {}}
              onUtility={handleUtility}
            />
          </nav>
        </div>
      )}

      <nav className={`fixed left-4 top-4 z-50 hidden h-[calc(100vh-32px)] flex-col items-center gap-6 rounded-[40px] border border-zinc-100 bg-white text-sm shadow-nav transition-all duration-300 md:flex ${
        expanded ? 'w-64 px-4 py-6' : 'w-20 px-0 py-8'
      }`}>
        <SidebarContent
          activeItem={activeItem}
          activeUtility={activeUtility}
          expanded={expanded}
          onNavigate={handleNavigate}
          onToggleExpanded={onToggleExpanded}
          onUtility={handleUtility}
        />
      </nav>
    </>
  );
}
