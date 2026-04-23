import { ArrowUpRight, BarChart3, CalendarDays } from 'lucide-react';

const actionCards = [
  {
    title: 'Add New Member',
    helper: 'Create profile',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    highlight: true,
  },
  {
    title: 'Staff Schedule',
    helper: 'Manage shifts',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
    highlight: false,
  },
  {
    title: 'Inventory Check',
    helper: 'Update stock',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    highlight: false,
  },
  {
    title: 'Revenue Reports',
    helper: 'Export finance',
    image: null,
    highlight: false,
    isReport: true,
  },
];

export default function ActionCards({ onAction = () => {} }) {
  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-4">
      {actionCards.map((card, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onAction(card.title)}
          className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[1.75rem] text-left shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          aria-label={card.title}
        >
          {card.isReport ? (
            <>
              <div className="absolute inset-0 bg-inverse-surface" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-container/20 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <BarChart3 className="h-10 w-10 text-primary-container" />
                <span className="font-headline text-headline-md font-semibold text-white">
                  Generate
                </span>
                <span className="font-headline text-headline-md font-semibold text-white">
                  Revenue Reports
                </span>
                <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {card.helper}
                </span>
              </div>
            </>
          ) : (
            <>
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <span>
                  <span className="block rounded-pill bg-white/15 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur-sm">
                    {card.helper}
                  </span>
                  <span className="mt-2 block font-headline text-headline-md font-semibold leading-tight text-white">
                    {card.title.includes(' ') ? (
                      <>
                        {card.title.split(' ')[0]}<br />
                        {card.title.split(' ').slice(1).join(' ')}
                      </>
                    ) : (
                      card.title
                    )}
                  </span>
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  card.highlight
                    ? 'bg-primary-container text-primary'
                    : 'border border-white/30 bg-white/20 text-white backdrop-blur-sm'
                }`}>
                  {card.highlight ? <ArrowUpRight className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                </div>
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}
