'use client';

import { HomeIcon, UserGroupIcon, MapPinIcon, CurrencyDollarIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';
import { useSiteContent } from '@/hooks/useSiteContent';

const ICON_MAP: Record<string, any> = {
  HomeIcon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
};

const DEFAULTS = {
  items: [
    { iconName: 'HomeIcon', value: '3,400+', label: 'For Sale' },
    { iconName: 'UserGroupIcon', value: '2,500+', label: 'Sold' },
    { iconName: 'MapPinIcon', value: '200+', label: 'Neighborhoods' },
    { iconName: 'CurrencyDollarIcon', value: '$2B+', label: 'Listings Sold' },
  ],
};

export function StatsBar() {
  const content = useSiteContent('stats', DEFAULTS);

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {content.items.map((stat: any, index: number) => {
            const IconComponent = ICON_MAP[stat.iconName] || HomeIcon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center py-6 px-4 border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors cursor-default"
              >
                <IconComponent className="w-6 h-6 text-spyglass-orange mb-2" />
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
