import { HomeIcon, UserGroupIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export function StatsBar() {
  const stats = [
    { icon: HomeIcon, label: 'For Sale', value: '3,400+' },
    { icon: UserGroupIcon, label: 'Sold', value: '2,500+' },
    { icon: MapPinIcon, label: 'Neighborhoods', value: '200+' },
    { icon: CurrencyDollarIcon, label: 'Listings Sold', value: '$2B+' },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center py-6 px-4 border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors cursor-default"
            >
              <stat.icon className="w-6 h-6 text-spyglass-orange mb-2" />
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
