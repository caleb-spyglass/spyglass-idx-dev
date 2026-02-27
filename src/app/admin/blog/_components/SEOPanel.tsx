'use client';

interface SEOPanelProps {
  title: string;
  metaDescription: string;
  onMetaDescriptionChange: (val: string) => void;
  canonicalUrl: string;
  onCanonicalUrlChange: (val: string) => void;
  publishDate: string | null;
  modifiedDate: string | null;
  readingTime: number;
}

function CharCounter({
  value,
  min,
  max,
  label,
}: {
  value: string;
  min: number;
  max: number;
  label: string;
}) {
  const len = value.length;
  const isUnder = len < min;
  const isOver = len > max;
  const isGood = !isUnder && !isOver;

  return (
    <div className="flex items-center justify-between text-xs mt-1">
      <span className="text-gray-400">{label}</span>
      <span
        className={
          isGood
            ? 'text-green-600 font-medium'
            : isOver
            ? 'text-red-500 font-medium'
            : 'text-amber-500 font-medium'
        }
      >
        {len}/{max}
        {isGood && ' ✓'}
        {isOver && ' (too long)'}
        {isUnder && len > 0 && ` (${min - len} more)`}
      </span>
    </div>
  );
}

export function SEOPanel({
  title,
  metaDescription,
  onMetaDescriptionChange,
  canonicalUrl,
  onCanonicalUrlChange,
  publishDate,
  modifiedDate,
  readingTime,
}: SEOPanelProps) {
  const titleLen = title.length;
  const titleGood = titleLen >= 30 && titleLen <= 65;
  const titleWarn = titleLen > 65;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
        <span>🔍</span> SEO & Meta
      </h3>

      {/* Title preview */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Title Tag Preview
        </label>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p
            className={`text-sm font-medium truncate ${
              titleWarn ? 'text-red-600' : titleGood ? 'text-blue-700' : 'text-gray-800'
            }`}
          >
            {title || 'Untitled Post'} | Spyglass Realty Blog
          </p>
          <p className="text-xs text-green-700 mt-0.5 truncate">
            {canonicalUrl || 'https://spyglassrealty.com/blog/...'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
            {metaDescription || 'Add a meta description for search engines...'}
          </p>
        </div>
        <CharCounter value={title} min={30} max={65} label="Title length" />
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Meta Description
        </label>
        <textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923] resize-y"
          placeholder="Concise description for search engines (150-160 chars)..."
        />
        <CharCounter value={metaDescription} min={120} max={160} label="Description length" />
      </div>

      {/* Canonical URL */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Canonical URL</label>
        <input
          value={canonicalUrl}
          onChange={(e) => onCanonicalUrlChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
          placeholder="https://spyglassrealty.com/blog/..."
        />
      </div>

      {/* Dates & Reading Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Published</label>
          <p className="text-xs text-gray-500">
            {publishDate
              ? new Date(publishDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Not published'}
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Modified</label>
          <p className="text-xs text-gray-500">
            {modifiedDate
              ? new Date(modifiedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
        <span className="text-blue-500 text-sm">⏱</span>
        <span className="text-xs text-blue-700 font-medium">
          ~{readingTime} min read
        </span>
      </div>
    </div>
  );
}
