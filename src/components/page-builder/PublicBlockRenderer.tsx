'use client';

import React from 'react';

// ── Block types ──────────────────────────────────────────

interface BlockData {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: BlockData[][];
}

// ── Helper: extract YouTube/Vimeo embed URL ──────────────────────
function getVideoEmbedUrl(url: string): string {
  if (!url) return '';
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

// ── Star rating ──────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );
}

// ── Public Block Renderer ──────────────────────────────────

export function PublicBlockRenderer({ block }: { block: BlockData }) {
  const { type, props } = block;

  switch (type) {
    case 'heading': {
      const level = props.level || 2;
      const style = { textAlign: props.alignment || 'left' as any, color: props.color || 'inherit' };
      const sizes: Record<number, string> = {
        1: 'text-4xl font-bold', 2: 'text-3xl font-bold', 3: 'text-2xl font-semibold',
        4: 'text-xl font-semibold', 5: 'text-lg font-medium', 6: 'text-base font-medium',
      };
      const cls = `${sizes[level]} leading-tight`;
      const text = props.text || '';
      if (level === 1) return <h1 className={cls} style={style}>{text}</h1>;
      if (level === 3) return <h3 className={cls} style={style}>{text}</h3>;
      if (level === 4) return <h4 className={cls} style={style}>{text}</h4>;
      if (level === 5) return <h5 className={cls} style={style}>{text}</h5>;
      if (level === 6) return <h6 className={cls} style={style}>{text}</h6>;
      return <h2 className={cls} style={style}>{text}</h2>;
    }

    case 'text':
      return (
        <div
          className="prose prose-sm max-w-none"
          style={{ textAlign: props.alignment || 'left' }}
          dangerouslySetInnerHTML={{ __html: (props.content || '').replace(/\n/g, '<br/>') }}
        />
      );

    case 'image': {
      if (!props.url) return null;
      const img = <img src={props.url} alt={props.alt || ''} className="max-w-full rounded-lg" style={{ width: props.width || '100%' }} />;
      return (
        <div style={{ textAlign: props.alignment || 'center' }}>
          {props.link ? <a href={props.link} target="_blank" rel="noopener noreferrer">{img}</a> : img}
        </div>
      );
    }

    case 'button': {
      const btnStyles: Record<string, string> = {
        primary: 'bg-[#EF4923] text-white hover:bg-[#d63d1c]',
        secondary: 'bg-gray-800 text-white hover:bg-gray-700',
        outline: 'border-2 border-[#EF4923] text-[#EF4923] hover:bg-[#EF4923] hover:text-white',
      };
      const btnSizes: Record<string, string> = {
        sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg',
      };
      return (
        <div style={{ textAlign: props.alignment || 'center' }}>
          <a
            href={props.url || '#'}
            className={`inline-block rounded-lg font-medium transition-colors ${btnStyles[props.style || 'primary']} ${btnSizes[props.size || 'md']}`}
          >
            {props.text || 'Button'}
          </a>
        </div>
      );
    }

    case 'spacer':
      return <div style={{ height: `${props.height || 40}px` }} />;

    case 'divider':
      return (
        <hr style={{ borderStyle: props.style || 'solid', borderColor: props.color || '#e5e7eb', width: props.width || '100%', borderWidth: '1px 0 0 0' }} />
      );

    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: props.code || '' }} />;

    case 'video': {
      const embedUrl = getVideoEmbedUrl(props.url || '');
      if (!embedUrl) return null;
      return (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`${embedUrl}${props.autoplay ? '?autoplay=1&mute=1' : ''}`}
            className="absolute inset-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    case 'columns': {
      const colCount = props.columns || 2;
      const children = block.children || [];
      return (
        <div className={`grid gap-6 ${colCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {Array.from({ length: colCount }).map((_, colIndex) => (
            <div key={colIndex}>
              {(children[colIndex] || []).map((child) => (
                <div key={child.id} className="mb-4 last:mb-0">
                  <PublicBlockRenderer block={child} />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    case 'hero':
      return (
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            backgroundImage: props.bgImage ? `url(${props.bgImage})` : undefined,
            backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '400px',
          }}
        >
          {props.overlay && <div className="absolute inset-0 bg-black/50" />}
          {!props.bgImage && <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{props.heading || ''}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">{props.subtext || ''}</p>
            <div className="flex gap-4 flex-wrap justify-center">
              {props.ctaText && (
                <a href={props.ctaUrl || '#'} className="px-8 py-3 bg-[#EF4923] text-white rounded-lg font-medium hover:bg-[#d63d1c] transition-colors">
                  {props.ctaText}
                </a>
              )}
              {props.ctaText2 && (
                <a href={props.ctaUrl2 || '#'} className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  {props.ctaText2}
                </a>
              )}
            </div>
          </div>
        </div>
      );

    case 'cards': {
      const cards = props.cards || [];
      const cols = props.columns || 3;
      const gridCls = cols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                       cols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                       'grid-cols-1 sm:grid-cols-2';
      return (
        <div className={`grid gap-6 ${gridCls}`}>
          {cards.map((card: any, i: number) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {card.image && <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
                {card.link && <a href={card.link} className="text-sm text-[#EF4923] font-medium mt-3 inline-block hover:underline">Learn more →</a>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case 'testimonial':
      return (
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center max-w-xl mx-auto">
          {props.avatar && <img src={props.avatar} alt={props.author} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />}
          <StarRating rating={props.rating || 5} />
          <blockquote className="text-lg italic text-gray-700 my-4">"{props.quote || ''}"</blockquote>
          <p className="font-semibold text-gray-900">— {props.author || ''}</p>
        </div>
      );

    case 'cta':
      return (
        <div className="rounded-xl p-10 text-center" style={{ backgroundColor: props.bgColor || '#EF4923' }}>
          <h2 className="text-3xl font-bold text-white mb-3">{props.heading || ''}</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">{props.text || ''}</p>
          <a href={props.buttonUrl || '#'} className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {props.buttonText || 'Click Here'}
          </a>
        </div>
      );

    case 'image-gallery': {
      const images = props.images || [];
      if (images.length === 0) return null;
      const gCols = props.columns || 3;
      const gGrid = gCols === 4 ? 'grid-cols-2 md:grid-cols-4' : gCols === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
      return (
        <div className={`grid gap-4 ${gGrid}`}>
          {images.map((img: any, i: number) => (
            <img key={i} src={img.url} alt={img.alt || ''} className="w-full h-48 object-cover rounded-lg" />
          ))}
        </div>
      );
    }

    case 'faq': {
      const items = props.items || [];
      return (
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <details key={i} className="bg-white rounded-lg border shadow-sm group">
              <summary className="p-4 font-medium cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 rounded-lg">
                {item.question || 'Question?'}
                <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-gray-600">{item.answer || ''}</div>
            </details>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Page Renderer (renders array of blocks) ──────────────────────

export function PageRenderer({ blocks }: { blocks: BlockData[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      {blocks.map(block => (
        <PublicBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
