'use client';

import { validateHeadingHierarchy, type BlogBlock } from './blog-block-types';

interface HeadingWarningsProps {
  blocks: BlogBlock[];
}

export function HeadingWarnings({ blocks }: HeadingWarningsProps) {
  const warnings = validateHeadingHierarchy(blocks);

  if (warnings.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1">
      <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
        <span>⚠️</span> Heading Hierarchy Warnings
      </p>
      {warnings.map((w, i) => (
        <p key={i} className="text-xs text-amber-600 ml-5">
          • {w}
        </p>
      ))}
    </div>
  );
}
