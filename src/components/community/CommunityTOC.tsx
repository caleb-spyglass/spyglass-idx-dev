'use client';

interface TOCItem {
  id: string;
  label: string;
}

interface CommunityTOCProps {
  items: TOCItem[];
}

export default function CommunityTOC({ items }: CommunityTOCProps) {
  if (items.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without jumping
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="mb-8 rounded-xl bg-gray-50 border border-gray-200 p-5" aria-label="Table of contents">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        On This Page
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="text-sm text-gray-700 hover:text-spyglass-orange transition-colors flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
