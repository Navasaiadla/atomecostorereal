'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

export interface HeroSlide {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  intervalMs?: number
  className?: string
  priority?: boolean
}

export function HeroCarousel({ slides, intervalMs = 4000, className, priority = true }: HeroCarouselProps) {
  const safeSlides = useMemo(() => (Array.isArray(slides) ? slides.filter(Boolean) : []), [slides])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (safeSlides.length <= 1) return
    const id = setInterval(() => {
      setActiveIndex((idx) => (idx + 1) % safeSlides.length)
    }, Math.max(2000, intervalMs))
    return () => clearInterval(id)
  }, [safeSlides.length, intervalMs])

  function goTo(index: number) {
    if (safeSlides.length === 0) return
    const next = ((index % safeSlides.length) + safeSlides.length) % safeSlides.length
    setActiveIndex(next)
  }

  function next() {
    goTo(activeIndex + 1)
  }

  function prev() {
    goTo(activeIndex - 1)
  }

  if (safeSlides.length === 0) {
    return null
  }

  return (
    <div className={['relative w-full h-full overflow-hidden', className].filter(Boolean).join(' ')} aria-roledescription="carousel">
      {/* Slides */}
      {safeSlides.map((slide, idx) => (
        <div
          key={idx}
          className={[
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            idx === activeIndex ? 'opacity-100' : 'opacity-0'
          ].join(' ')}
          aria-hidden={idx !== activeIndex}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={priority && idx === 0}
            sizes="100vw"
            className={[slide.fit === 'contain' ? 'object-contain' : 'object-cover', 'object-center'].join(' ')}
          />
        </div>
      ))}

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/20 to-black/10 pointer-events-none" />

      {/* Controls */}
      {safeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-xs"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/30 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-xs"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {safeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  'h-2.5 w-2.5 rounded-full transition-all',
                  i === activeIndex ? 'bg-white shadow-md w-5' : 'bg-white/60 hover:bg-white/80'
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}


