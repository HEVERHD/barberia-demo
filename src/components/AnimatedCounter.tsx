"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export default function AnimatedCounter({
  target,
  duration = 1800,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()

          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(parseFloat((eased * target).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals])

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  )
}
