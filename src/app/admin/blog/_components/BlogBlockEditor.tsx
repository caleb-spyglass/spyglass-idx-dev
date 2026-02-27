'use client';

import { useCallback, useRef, useState } from 'react';
import {
  type BlogBlock,
  type BlogBlockType,
  BLOG_WIDGET_CATEGORIES,
  getDefaultBlogBlockContent,
  generateBlogBlockId,
} from './blog-block-types';
import { TOCBlock } from './TOCBlock';
import { HeadingWarnings } from './HeadingWarnings';

interface BlogBlockEditorProps {
  blocks: BlogBlock[];
  onChange: (blocks: BlogBlock[]) => void;
}

export function BlogBlockEditor({ blocks, onChange }: BlogBlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [showWidgetPicker, setShowWidgetPicker] = useState<number | null>(null);
  const draggedBlockIdRef = useRef<string | null>(null);

  const addBlock = useCallback(
    (type: BlogBlockType, index?: number) => {
      const newBlock: BlogBlock = {
        id: generateBlogBlockId(),
        type,
        content: getDefaultBlogBlockContent(type),
      };
      const newBlocks = [...blocks];
      if (index !== undefined && index >= 0) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      onChange(newBlocks);
      setSelectedBlockId(newBlock.id);
      setShowWidgetPicker(null);
    },
    [blocks, onChange]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      onChange(blocks.filter((b) => b.id !== id));
      if (selectedBlockId === id) setSelectedBlockId(null);
    },
    [blocks, onChange, selectedBlockId]
  );

  const updateBlock = useCallback(
    (id: string, content: Record<string, unknown>) => {
      onChange(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    },
    [blocks, onChange]
  );

  const moveBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const newBlocks = [...blocks];
      const [moved] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex > fromIndex ? toIndex - 1 : toIndex, 0, moved);
      onChange(newBlocks);
    },
    [blocks, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDropTargetIndex(null);

      const widgetType = e.dataTransfer.getData('blog-widget-type') as BlogBlockType;
      const blockId = e.dataTransfer.getData('blog-block-id');

      if (widgetType) {
        addBlock(widgetType, targetIndex);
      } else if (blockId) {
        const fromIndex = blocks.findIndex((b) => b.id === blockId);
        if (fromIndex !== -1) {
          moveBlock(fromIndex, targetIndex);
        }
      }
    },
    [addBlock, blocks, moveBlock]
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Content Blocks
          <span className="text-xs text-gray-400 font-normal">
            ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
          </span>
        </label>
      </div>

      {/* Heading Warnings */}
      <HeadingWarnings blocks={blocks} />

      {/* Block List */}
      <div className="space-y-1">
        {blocks.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
            <p className="text-gray-400 text-sm mb-3">
              No content blocks yet. Add blocks to build your post.
            </p>
            <button
              type="button"
              onClick={() => setShowWidgetPicker(-1)}
              className="px-4 py-2 bg-[#EF4923] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              + Add First Block
            </button>
            {showWidgetPicker === -1 && (
              <WidgetPicker
                onSelect={(type) => addBlock(type, 0)}
                onClose={() => setShowWidgetPicker(null)}
              />
            )}
          </div>
        ) : (
          <>
            {blocks.map((block, index) => (
              <div key={block.id}>
                {/* Drop zone */}
                <div
                  className={`h-1 rounded-full mx-2 transition-all ${
                    dropTargetIndex === index ? 'bg-[#EF4923] my-1.5' : 'bg-transparent'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropTargetIndex(index);
                  }}
                  onDragLeave={() => setDropTargetIndex(null)}
                  onDrop={(e) => handleDrop(e, index)}
                />

                {/* Add block between */}
                <div className="flex justify-center -my-0.5 relative z-10 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() =>
                      setShowWidgetPicker(showWidgetPicker === index ? null : index)
                    }
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-[#EF4923] hover:text-white text-gray-500 text-xs flex items-center justify-center transition-colors"
                    title="Add block here"
                  >
                    +
                  </button>
                </div>
                {showWidgetPicker === index && (
                  <WidgetPicker
                    onSelect={(type) => addBlock(type, index)}
                    onClose={() => setShowWidgetPicker(null)}
                  />
                )}

                {/* Block */}
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('blog-block-id', block.id);
                    e.dataTransfer.effectAllowed = 'move';
                    draggedBlockIdRef.current = block.id;
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                  }}
                  className={`group relative rounded-lg border-2 transition-all ${
                    selectedBlockId === block.id
                      ? 'border-[#EF4923] shadow-sm'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {/* Block controls */}
                  <div
                    className={`absolute -top-3 right-2 flex items-center gap-1 z-10 transition-opacity ${
                      selectedBlockId === block.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded font-medium capitalize">
                      {block.type}
                    </span>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(index, index - 1);
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white w-5 h-5 rounded flex items-center justify-center text-[10px]"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < blocks.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(index, index + 2);
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white w-5 h-5 rounded flex items-center justify-center text-[10px]"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                      title="Delete block"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Block content */}
                  <div className="p-3">
                    <BlogBlockPreview
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onUpdate={(content) => updateBlock(block.id, content)}
                      allBlocks={blocks}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Final drop zone */}
            <div
              className={`h-1 rounded-full mx-2 transition-all ${
                dropTargetIndex === blocks.length ? 'bg-[#EF4923] my-1.5' : 'bg-transparent'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDropTargetIndex(blocks.length);
              }}
              onDragLeave={() => setDropTargetIndex(null)}
              onDrop={(e) => handleDrop(e, blocks.length)}
            />

            {/* Add block at end */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setShowWidgetPicker(
                    showWidgetPicker === blocks.length ? null : blocks.length
                  )
                }
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#EF4923] bg-gray-50 hover:bg-orange-50 rounded-lg border border-gray-200 hover:border-[#EF4923] transition-colors"
              >
                + Add Block
              </button>
            </div>
            {showWidgetPicker === blocks.length && (
              <WidgetPicker
                onSelect={(type) => addBlock(type)}
                onClose={() => setShowWidgetPicker(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Widget Picker ─────────────────────────────────────────────────── */

function WidgetPicker({
  onSelect,
  onClose,
}: {
  onSelect: (type: BlogBlockType) => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 my-2 relative z-20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500">Add a block</span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          ✕
        </button>
      </div>
      <div className="space-y-3">
        {BLOG_WIDGET_CATEGORIES.map((category) => (
          <div key={category.label}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.widgets.map((widget) => (
                <button
                  key={widget.type}
                  type="button"
                  onClick={() => onSelect(widget.type)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                >
                  <span
                    className={`w-5 h-5 ${widget.color} text-white rounded flex items-center justify-center text-[10px]`}
                  >
                    {widget.icon}
                  </span>
                  {widget.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Block Preview (Inline Editing) ──────────────────────────────── */

function BlogBlockPreview({
  block,
  isSelected,
  onUpdate,
  allBlocks,
}: {
  block: BlogBlock;
  isSelected: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  allBlocks: BlogBlock[];
}) {
  const c = block.content;

  switch (block.type) {
    case 'heading': {
      const level = (c.level as string) || 'h2';
      const sizeMap: Record<string, string> = {
        h2: 'text-2xl',
        h3: 'text-xl',
        h4: 'text-lg',
        h5: 'text-base',
        h6: 'text-sm',
      };
      const sizeClass = sizeMap[level] || 'text-2xl';

      return (
        <div>
          {isSelected && (
            <div
              className="flex items-center gap-1 mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {(['h2', 'h3', 'h4', 'h5', 'h6'] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onUpdate({ ...c, level: h })}
                  className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                    level === h
                      ? 'bg-[#EF4923] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {h.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          {isSelected ? (
            <input
              type="text"
              value={(c.text as string) || ''}
              onChange={(e) => onUpdate({ ...c, text: e.target.value })}
              className={`${sizeClass} font-bold w-full border-none outline-none bg-transparent`}
              onClick={(e) => e.stopPropagation()}
              placeholder="Heading text..."
            />
          ) : (
            <p className={`${sizeClass} font-bold text-gray-900`}>
              {(c.text as string) || 'Heading'}
            </p>
          )}
        </div>
      );
    }

    case 'text':
      return (
        <div>
          {isSelected ? (
            <textarea
              value={(c.html as string) || ''}
              onChange={(e) => onUpdate({ ...c, html: e.target.value })}
              className="w-full border-none outline-none bg-transparent resize-none min-h-[60px] text-gray-600 text-sm"
              onClick={(e) => e.stopPropagation()}
              rows={4}
              placeholder="Write your paragraph content here... (HTML supported)"
            />
          ) : (
            <div
              className="text-gray-600 text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: (c.html as string) || '<p>Text block</p>',
              }}
            />
          )}
        </div>
      );

    case 'image': {
      const src = c.src as string;
      const alt = c.alt as string;
      const caption = c.caption as string;
      const showAltWarning = isSelected && src && !alt;

      return (
        <div className="space-y-2">
          {isSelected ? (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="url"
                value={src || ''}
                onChange={(e) => onUpdate({ ...c, src: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Image URL..."
              />
              <div>
                <input
                  type="text"
                  value={alt || ''}
                  onChange={(e) => onUpdate({ ...c, alt: e.target.value })}
                  className={`w-full px-3 py-2 border rounded text-sm ${
                    showAltWarning
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Alt text (required for accessibility & SEO)..."
                />
                {showAltWarning && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Alt text is required for SEO and accessibility
                  </p>
                )}
              </div>
              <input
                type="text"
                value={caption || ''}
                onChange={(e) => onUpdate({ ...c, caption: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Caption (optional)..."
              />
            </div>
          ) : null}
          {src ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || ''}
                className="max-w-full rounded-lg"
              />
              {caption && (
                <p className="text-xs text-gray-500 mt-1 italic">{caption}</p>
              )}
              {!alt && (
                <p className="text-xs text-amber-500 mt-1">⚠️ Missing alt text</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <span className="text-gray-400 text-2xl">🖼</span>
              <p className="text-sm text-gray-400 mt-1">Add image URL</p>
            </div>
          )}
        </div>
      );
    }

    case 'video': {
      const url = c.url as string;
      return (
        <div>
          {isSelected ? (
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="url"
                value={url || ''}
                onChange={(e) => onUpdate({ ...c, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                placeholder="YouTube or video URL..."
              />
            </div>
          ) : null}
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <span className="text-gray-400 text-3xl">▶</span>
            <p className="text-sm text-gray-400 mt-2">
              {url || 'Add video URL'}
            </p>
          </div>
        </div>
      );
    }

    case 'html':
      return (
        <div className="bg-gray-900 rounded-lg p-4">
          {isSelected ? (
            <textarea
              value={(c.code as string) || ''}
              onChange={(e) => onUpdate({ ...c, code: e.target.value })}
              className="w-full bg-transparent text-green-400 font-mono text-sm outline-none resize-none min-h-[80px]"
              onClick={(e) => e.stopPropagation()}
              rows={4}
            />
          ) : (
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              {(c.code as string) || '<div>HTML</div>'}
            </pre>
          )}
        </div>
      );

    case 'button':
      return (
        <div className="space-y-2">
          {isSelected && (
            <div
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={(c.text as string) || ''}
                onChange={(e) => onUpdate({ ...c, text: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Button text..."
              />
              <input
                type="url"
                value={(c.href as string) || ''}
                onChange={(e) => onUpdate({ ...c, href: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Button URL..."
              />
            </div>
          )}
          <button
            type="button"
            className="bg-[#EF4923] text-white px-6 py-2.5 rounded-lg font-medium"
          >
            {(c.text as string) || 'Button'}
          </button>
        </div>
      );

    case 'divider':
      return <hr className="border-gray-300 my-2" />;

    case 'spacer':
      return (
        <div
          style={{ height: (c.height as number) || 40 }}
          className="bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center"
        >
          {isSelected && (
            <input
              type="number"
              value={(c.height as number) || 40}
              onChange={(e) =>
                onUpdate({ ...c, height: parseInt(e.target.value) || 40 })
              }
              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
              onClick={(e) => e.stopPropagation()}
              min={8}
              max={200}
            />
          )}
        </div>
      );

    case 'toc':
      return <TOCBlock blocks={allBlocks} isEditorPreview />;

    case 'quote':
      return (
        <div className="border-l-4 border-[#EF4923] bg-gray-50 rounded-r-lg p-4">
          {isSelected ? (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={(c.text as string) || ''}
                onChange={(e) => onUpdate({ ...c, text: e.target.value })}
                className="w-full border-none outline-none bg-transparent resize-none min-h-[40px] text-gray-700 italic"
                placeholder="Quote text..."
                rows={2}
              />
              <input
                type="text"
                value={(c.citation as string) || ''}
                onChange={(e) => onUpdate({ ...c, citation: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Citation / source..."
              />
            </div>
          ) : (
            <>
              <p className="text-gray-700 italic">
                &ldquo;{(c.text as string) || 'Quote text'}&rdquo;
              </p>
              {(c.citation as string) && (
                <p className="text-sm text-gray-500 mt-1">
                  — {c.citation as string}
                </p>
              )}
            </>
          )}
        </div>
      );

    default:
      return (
        <div className="text-gray-400 text-sm">
          Unknown block type: {block.type}
        </div>
      );
  }
}
