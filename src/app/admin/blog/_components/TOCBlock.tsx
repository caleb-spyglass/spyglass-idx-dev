'use client';

import { extractTOCFromBlocks, type BlogBlock } from './blog-block-types';

interface TOCBlockProps {
  blocks: BlogBlock[];
  /** If true, render the live-preview version in the editor */
  isEditorPreview?: boolean;
}

export function TOCBlock({ blocks, isEditorPreview = false }: TOCBlockProps) {
  const entries = extractTOCFromBlocks(blocks);

  if (entries.length === 0) {
    return (
      <div
        className={`rounded-lg border-2 border-dashed p-4 text-center ${
          isEditorPreview ? 'border-gray-300 bg-gray-50' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <p className="text-sm text-gray-400">
          📑 Table of Contents — add H2/H3 headings to populate
        </p>
      </div>
    );
  }

  return (
    <nav
      className={`rounded-xl p-5 ${
        isEditorPreview
          ? 'bg-indigo-50 border border-indigo-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>📑</span> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {entries.map((entry, idx) => (
          <li
            key={`${entry.id}-${idx}`}
            className={entry.level === 'h3' ? 'ml-4' : ''}
          >
            {isEditorPreview ? (
              <span
                className={`text-sm ${
                  entry.level === 'h2'
                    ? 'text-gray-700 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {entry.text || 'Untitled'}
              </span>
            ) : (
              <a
                href={`#${entry.id}`}
                className={`text-sm hover:text-[#EF4923] transition-colors ${
                  entry.level === 'h2'
                    ? 'text-gray-700 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {entry.text || 'Untitled'}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
