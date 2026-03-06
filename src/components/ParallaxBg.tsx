"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function ParallaxBg() {
  const imgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (!imgRef.current) return

      // Zoom out from 1.15 → 1.0 over first 800px of scroll (depth illusion)
      const scale = Math.max(1.0, 1.15 - y * 0.00019)
      // Slight upward drift as page scrolls (slow parallax)
      const translateY = y * 0.18
      imgRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`

      // Overlay darkens a bit as you scroll past the hero
      if (overlayRef.current) {
        const extraDark = Math.min(0.18, y * 0.00018)
        overlayRef.current.style.opacity = String(0.68 + extraDark)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    // Run once to set initial state
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        ref={imgRef}
        className="absolute inset-[-15%]"
        style={{ willChange: "transform", transformOrigin: "center center" }}
      >
        <Image
          src="/barberia.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ filter: "blur(1px)" }}
          priority
        />
      </div>
      {/* Dark overlay — starts at 68% black, darkens slightly on scroll */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ background: "black", opacity: 0.68 }}
      />
    </div>
  )
}
