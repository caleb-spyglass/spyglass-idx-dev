'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  FilmIcon,
} from '@heroicons/react/24/outline';

interface PhotoGalleryProps {
  photos: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoGallery({ photos, initialIndex = 0, isOpen, onClose }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [gridView, setGridView] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const pinchRef = useRef({ initialDistance: 0, initialScale: 1 });
  const panRef = useRef({ startX: 0, startY: 0, startTranslateX: 0, startTranslateY: 0 });

  // Swipe state
  const swipeRef = useRef({ startX: 0, startY: 0, startTime: 0, moved: false });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Sync initialIndex when it changes or gallery opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setGridView(false);
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Focus management
  useEffect(() => {
    if (isOpen && galleryRef.current) {
      galleryRef.current.focus();
    }
  }, [isOpen]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen || photos.length === 0) return;
    const toPreload = [
      photos[(currentIndex + 1) % photos.length],
      photos[(currentIndex - 1 + photos.length) % photos.length],
    ];
    toPreload.forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [currentIndex, isOpen, photos]);

  // Auto-scroll thumbnail strip to keep active thumbnail visible
  useEffect(() => {
    if (!thumbnailStripRef.current || gridView) return;
    const strip = thumbnailStripRef.current;
    const activeThumb = strip.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      const stripRect = strip.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      const scrollLeft = activeThumb.offsetLeft - stripRect.width / 2 + thumbRect.width / 2;
      strip.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentIndex, gridView]);

  const navigateTo = useCallback((index: number, dir: 'left' | 'right') => {
    if (transitioning || photos.length <= 1) return;
    // Reset zoom when navigating
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setDirection(dir);
    setTransitioning(true);
    // After fade out, change the image
    setTimeout(() => {
      setCurrentIndex(index);
      // After changing, fade in
      setTimeout(() => {
        setTransitioning(false);
        setDirection(null);
      }, 20);
    }, 150);
  }, [transitioning, photos.length]);

  const goNext = useCallback(() => {
    navigateTo((currentIndex + 1) % photos.length, 'right');
  }, [currentIndex, photos.length, navigateTo]);

  const goPrev = useCallback(() => {
    navigateTo((currentIndex - 1 + photos.length) % photos.length, 'left');
  }, [currentIndex, photos.length, navigateTo]);

  const goToIndex = useCallback((idx: number) => {
    if (idx === currentIndex) return;
    navigateTo(idx, idx > currentIndex ? 'right' : 'left');
  }, [currentIndex, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (scale > 1) {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!gridView) goPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!gridView) goNext();
          break;
        case 'g':
          setGridView((v) => !v);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goNext, goPrev, gridView, scale]);

  // Touch handlers for swipe & pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current.initialDistance = Math.hypot(dx, dy);
      pinchRef.current.initialScale = scale;
    } else if (e.touches.length === 1) {
      if (scale > 1) {
        // Pan start when zoomed
        panRef.current.startX = e.touches[0].clientX;
        panRef.current.startY = e.touches[0].clientY;
        panRef.current.startTranslateX = translate.x;
        panRef.current.startTranslateY = translate.y;
      }
      // Swipe start
      swipeRef.current.startX = e.touches[0].clientX;
      swipeRef.current.startY = e.touches[0].clientY;
      swipeRef.current.startTime = Date.now();
      swipeRef.current.moved = false;
    }
  }, [scale, translate]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch move
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const newScale = Math.min(Math.max(pinchRef.current.initialScale * (distance / pinchRef.current.initialDistance), 1), 4);
      setScale(newScale);
      if (newScale === 1) {
        setTranslate({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan when zoomed
      e.preventDefault();
      const dx = e.touches[0].clientX - panRef.current.startX;
      const dy = e.touches[0].clientY - panRef.current.startY;
      setTranslate({
        x: panRef.current.startTranslateX + dx,
        y: panRef.current.startTranslateY + dy,
      });
      swipeRef.current.moved = true;
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - swipeRef.current.startX;
      if (Math.abs(dx) > 10) {
        swipeRef.current.moved = true;
      }
    }
  }, [scale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // If was pinching, check if scale dropped to 1
    if (scale <= 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }

    // Swipe detection (only when not zoomed)
    if (scale <= 1 && e.changedTouches.length === 1 && !gridView) {
      const dx = e.changedTouches[0].clientX - swipeRef.current.startX;
      const dy = e.changedTouches[0].clientY - swipeRef.current.startY;
      const dt = Date.now() - swipeRef.current.startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Horizontal swipe: must be mostly horizontal, at least 50px, under 500ms
      if (absDx > 50 && absDx > absDy * 1.5 && dt < 500) {
        if (dx > 0) {
          goPrev();
        } else {
          goNext();
        }
      }
    }
  }, [scale, gridView, goNext, goPrev]);

  // Double-tap to zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      if (scale > 1) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        setScale(2.5);
      }
    }
    lastTapRef.current = now;
  }, [scale]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || photos.length === 0) return null;

  return (
    <div
      ref={galleryRef}
      className="fixed inset-0 bg-black z-[60] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      tabIndex={-1}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <span className="text-white text-sm font-medium" aria-live="polite">
          Photo {currentIndex + 1} of {photos.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridView((v) => !v)}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label={gridView ? 'Switch to slideshow view' : 'Switch to grid view'}
            title={gridView ? 'Slideshow' : 'Grid'}
          >
            {gridView ? (
              <FilmIcon className="w-6 h-6" />
            ) : (
              <Squares2X2Icon className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Close gallery"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      {gridView ? (
        /* Grid View */
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setGridView(false);
                }}
                className="relative aspect-[4/3] overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <span className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Slideshow View */
        <>
          <div
            ref={imageContainerRef}
            className="flex-1 flex items-center justify-center relative select-none overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              handleTouchEnd(e);
              handleDoubleTap(e);
            }}
          >
            {/* Previous button */}
            {photos.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-2 md:left-4 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
                aria-label="Previous photo"
              >
                <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            )}

            {/* Main image with crossfade */}
            <img
              src={photos[currentIndex]}
              alt={`Photo ${currentIndex + 1} of ${photos.length}`}
              className="max-h-[75vh] max-w-[90vw] object-contain"
              style={{
                opacity: transitioning ? 0 : 1,
                transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                transition: transitioning
                  ? 'opacity 150ms ease-out'
                  : 'opacity 150ms ease-in, transform 200ms ease-out',
                willChange: 'opacity, transform',
                touchAction: scale > 1 ? 'none' : 'pan-y',
              }}
              draggable={false}
            />

            {/* Next button */}
            {photos.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-2 md:right-4 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
                aria-label="Next photo"
              >
                <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          <div
            ref={thumbnailStripRef}
            className="flex-shrink-0 px-4 py-3 flex gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
            role="tablist"
            aria-label="Photo thumbnails"
          >
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Photo ${idx + 1}`}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                  idx === currentIndex
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
