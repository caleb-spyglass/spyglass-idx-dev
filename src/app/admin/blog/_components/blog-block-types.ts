/**
 * Blog-specific block types — extends the page builder block system
 * with blog-specific blocks (TOC) and utilities.
 */

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  content: Record<string, unknown>;
}

export type BlogBlockType =
  | 'heading'
  | 'text'
  | 'image'
  | 'video'
  | 'html'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'toc'       // blog-specific: auto-generated table of contents
  | 'quote';    // blog-specific: blockquote

export interface BlogWidgetCategory {
  label: string;
  widgets: BlogWidgetDef[];
}

export interface BlogWidgetDef {
  type: BlogBlockType;
  label: string;
  icon: string;
  color: string;
}

export const BLOG_WIDGET_CATEGORIES: BlogWidgetCategory[] = [
  {
    label: 'CONTENT',
    widgets: [
      { type: 'heading', label: 'Heading', icon: 'H', color: 'bg-blue-500' },
      { type: 'text', label: 'Text', icon: '¶', color: 'bg-yellow-500' },
      { type: 'image', label: 'Image', icon: '🖼', color: 'bg-green-500' },
      { type: 'quote', label: 'Quote', icon: '❝', color: 'bg-amber-500' },
    ],
  },
  {
    label: 'MEDIA',
    widgets: [
      { type: 'video', label: 'Video', icon: '▶', color: 'bg-red-400' },
      { type: 'html', label: 'HTML', icon: '</>', color: 'bg-gray-700' },
    ],
  },
  {
    label: 'LAYOUT',
    widgets: [
      { type: 'toc', label: 'Table of Contents', icon: '📑', color: 'bg-indigo-500' },
      { type: 'button', label: 'Button / CTA', icon: '◉', color: 'bg-purple-500' },
      { type: 'divider', label: 'Divider', icon: '—', color: 'bg-gray-400' },
      { type: 'spacer', label: 'Spacer', icon: '↕', color: 'bg-gray-400' },
    ],
  },
];

export function getDefaultBlogBlockContent(type: BlogBlockType): Record<string, unknown> {
  switch (type) {
    case 'heading':
      return { text: 'New Heading', level: 'h2' };
    case 'text':
      return { html: '<p>Start typing your content here...</p>' };
    case 'image':
      return { src: '', alt: '', caption: '' };
    case 'video':
      return { url: '', provider: 'youtube' };
    case 'html':
      return { code: '<div>Custom HTML</div>' };
    case 'button':
      return { text: 'Click Here', href: '#', variant: 'primary' };
    case 'divider':
      return { style: 'solid' };
    case 'spacer':
      return { height: 40 };
    case 'toc':
      return {}; // auto-generated from headings
    case 'quote':
      return { text: 'Quote text here...', citation: '' };
    default:
      return {};
  }
}

let _counter = 0;
export function generateBlogBlockId(): string {
  _counter++;
  return `blog-block-${Date.now()}-${_counter}`;
}

/** Generate a URL-safe anchor ID from heading text */
export function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Estimate reading time from blocks */
export function estimateReadingTime(blocks: BlogBlock[]): number {
  let wordCount = 0;
  for (const block of blocks) {
    if (block.type === 'heading') {
      const text = (block.content.text as string) || '';
      wordCount += text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === 'text') {
      const html = (block.content.html as string) || '';
      const stripped = html.replace(/<[^>]*>/g, '');
      wordCount += stripped.split(/\s+/).filter(Boolean).length;
    } else if (block.type === 'quote') {
      const text = (block.content.text as string) || '';
      wordCount += text.split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.ceil(wordCount / 250));
}

/** Extract TOC entries from heading blocks */
export function extractTOCFromBlocks(blocks: BlogBlock[]): Array<{ id: string; text: string; level: string }> {
  return blocks
    .filter((b) => b.type === 'heading')
    .filter((b) => {
      const level = (b.content.level as string) || 'h2';
      return level === 'h2' || level === 'h3';
    })
    .map((b) => ({
      id: generateAnchorId((b.content.text as string) || ''),
      text: (b.content.text as string) || '',
      level: (b.content.level as string) || 'h2',
    }));
}

/** Validate heading hierarchy — returns warnings */
export function validateHeadingHierarchy(blocks: BlogBlock[]): string[] {
  const warnings: string[] = [];
  const headings = blocks.filter((b) => b.type === 'heading');

  // Check for H1 usage
  const h1s = headings.filter((b) => b.content.level === 'h1');
  if (h1s.length > 0) {
    warnings.push('H1 is reserved for the page title. Use H2 and below for content headings.');
  }

  // Check for skipped heading levels
  let lastLevel = 1; // title is h1
  for (const h of headings) {
    const level = parseInt((h.content.level as string)?.replace('h', '') || '2', 10);
    if (level > lastLevel + 1) {
      warnings.push(
        `Heading "${(h.content.text as string) || 'Untitled'}" skips from H${lastLevel} to H${level}. Consider using H${lastLevel + 1} instead.`
      );
    }
    lastLevel = level;
  }

  return warnings;
}

/** Convert blocks to HTML for storage */
export function blocksToHtml(blocks: BlogBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'heading': {
          const level = (block.content.level as string) || 'h2';
          const text = (block.content.text as string) || '';
          const id = generateAnchorId(text);
          return `<${level} id="${id}">${text}</${level}>`;
        }
        case 'text':
          return (block.content.html as string) || '';
        case 'image': {
          const src = (block.content.src as string) || '';
          const alt = (block.content.alt as string) || '';
          const caption = (block.content.caption as string) || '';
          if (!src) return '';
          let html = `<figure>`;
          html += `<img src="${src}" alt="${alt}" loading="lazy" />`;
          if (caption) html += `<figcaption>${caption}</figcaption>`;
          html += `</figure>`;
          return html;
        }
        case 'video': {
          const url = (block.content.url as string) || '';
          if (!url) return '';
          // Extract YouTube video ID
          const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
          if (ytMatch) {
            return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
          }
          return `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`;
        }
        case 'html':
          return (block.content.code as string) || '';
        case 'button': {
          const text = (block.content.text as string) || 'Button';
          const href = (block.content.href as string) || '#';
          return `<p><a href="${href}" class="blog-cta-button">${text}</a></p>`;
        }
        case 'divider':
          return '<hr />';
        case 'spacer':
          return `<div style="height:${(block.content.height as number) || 40}px"></div>`;
        case 'toc':
          return '<!-- TOC_PLACEHOLDER -->';
        case 'quote': {
          const text = (block.content.text as string) || '';
          const citation = (block.content.citation as string) || '';
          let html = `<blockquote><p>${text}</p>`;
          if (citation) html += `<cite>${citation}</cite>`;
          html += `</blockquote>`;
          return html;
        }
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n');
}

/** Try to parse existing HTML content back into blocks */
export function htmlToBlocks(html: string): BlogBlock[] {
  // Simple regex-based parser for re-importing existing content
  const blocks: BlogBlock[] = [];
  if (!html || !html.trim()) return blocks;

  // Wrap in a div for easier parsing
  const lines = html.split(/\n/).filter((l) => l.trim());

  for (const line of lines) {
    const trimmed = line.trim();

    // Heading
    const headingMatch = trimmed.match(/^<(h[1-6])[^>]*>(.*?)<\/\1>/i);
    if (headingMatch) {
      blocks.push({
        id: generateBlogBlockId(),
        type: 'heading',
        content: { text: headingMatch[2].replace(/<[^>]*>/g, ''), level: headingMatch[1].toLowerCase() },
      });
      continue;
    }

    // Image / figure
    const imgMatch = trimmed.match(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/i);
    if (imgMatch) {
      const captionMatch = trimmed.match(/<figcaption>(.*?)<\/figcaption>/i);
      blocks.push({
        id: generateBlogBlockId(),
        type: 'image',
        content: { src: imgMatch[1], alt: imgMatch[2], caption: captionMatch?.[1] || '' },
      });
      continue;
    }

    // Blockquote
    const quoteMatch = trimmed.match(/<blockquote>([\s\S]*?)<\/blockquote>/i);
    if (quoteMatch) {
      const textMatch = quoteMatch[1].match(/<p>(.*?)<\/p>/i);
      const citeMatch = quoteMatch[1].match(/<cite>(.*?)<\/cite>/i);
      blocks.push({
        id: generateBlogBlockId(),
        type: 'quote',
        content: {
          text: textMatch?.[1] || quoteMatch[1].replace(/<[^>]*>/g, ''),
          citation: citeMatch?.[1] || '',
        },
      });
      continue;
    }

    // HR
    if (trimmed === '<hr />' || trimmed === '<hr>') {
      blocks.push({ id: generateBlogBlockId(), type: 'divider', content: { style: 'solid' } });
      continue;
    }

    // TOC placeholder
    if (trimmed.includes('TOC_PLACEHOLDER')) {
      blocks.push({ id: generateBlogBlockId(), type: 'toc', content: {} });
      continue;
    }

    // Default: text block
    if (trimmed) {
      blocks.push({
        id: generateBlogBlockId(),
        type: 'text',
        content: { html: trimmed },
      });
    }
  }

  return blocks;
}
