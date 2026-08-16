import { useEffect, useRef, useState } from 'react'

/**
 * True when motion should be suppressed.
 *
 * A site-level override wins over the OS: someone whose system animations are
 * switched off globally can still opt back in here, and vice versa. With no
 * override we follow the operating system, so the default is always the
 * conservative one.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  const pref = document.documentElement.getAttribute('data-motion')
  if (pref === 'on') return false
  if (pref === 'off') return true
  return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Marks an element as in-view once it crosses the viewport.
 *
 * `once` is the default: re-animating every time something scrolls past gets
 * tiring fast, and it makes long pages feel unstable.
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No IntersectionObserver, or motion is off: show content immediately.
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    io.observe(el)

    // Failsafe. Reveals start at opacity 0, so anything that stops the
    // observer from firing — a throttled background tab, a stalled frame,
    // a browser quirk — would leave content permanently invisible. Content
    // being seen matters far more than the animation, so after a grace
    // period we show it regardless.
    const bail = setTimeout(() => setInView(true), 2500)

    return () => {
      clearTimeout(bail)
      io.disconnect()
    }
  }, [threshold, rootMargin, once])

  return [ref, inView]
}

/**
 * Reveal
 *
 * Wraps children in a scroll-triggered entrance. `variant` picks the direction,
 * `delay` staggers siblings. The CSS does the work; this only flips the
 * data attribute.
 */
export function Reveal({
  as: As = 'div',
  variant = 'up',
  delay = 0,
  threshold,
  className = '',
  style,
  children,
  ...rest
}) {
  const [ref, inView] = useInView(threshold != null ? { threshold } : undefined)

  return (
    <As
      ref={ref}
      data-inview={inView}
      className={`rv rv-${variant} ${className}`}
      style={{ '--rv-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </As>
  )
}

/**
 * Counts up to a number once it scrolls into view.
 *
 * Driven by requestAnimationFrame against real elapsed time rather than a
 * fixed per-frame step, so the duration holds on any refresh rate.
 */
export function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  const [value, setValue] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!inView) return

    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo: fast out of the gate, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setValue(target * eased)
      if (t < 1) frame.current = requestAnimationFrame(tick)
      else setValue(target)
    }

    frame.current = requestAnimationFrame(tick)

    // Guarantee the real figure lands even if rAF never runs to completion —
    // a counter stuck on "0+ reviews" is worse than no animation at all.
    const settle = setTimeout(() => setValue(target), duration + 400)

    return () => {
      cancelAnimationFrame(frame.current)
      clearTimeout(settle)
    }
  }, [inView, target, duration])

  return [ref, Number(value.toFixed(decimals))]
}

/** A number that counts up when scrolled to. */
export function CountUp({ to, decimals = 0, format, className = '', suffix = '' }) {
  const [ref, value] = useCountUp(to, { decimals })
  const shown = format ? format(value) : value.toFixed(decimals)
  return (
    <span ref={ref} className={className}>
      {shown}
      {suffix}
    </span>
  )
}

/**
 * Re-fires a CSS animation whenever `value` changes, by swapping the React key.
 * Used for the bag badge so every add visibly registers.
 */
export function usePulseKey(value) {
  const [key, setKey] = useState(0)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value
      setKey((k) => k + 1)
    }
  }, [value])

  return key
}

/**
 * Subtle parallax for a decorative layer. Returns a ref to attach and drives
 * a CSS variable rather than re-rendering on every scroll frame.
 */
export function useParallax(strength = 12) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // -1 (just below the fold) .. 1 (just above it). Clamped: once the
      // element is well off-screen this ratio keeps growing, and an unclamped
      // offset would shove the image past its overscale headroom and expose
      // the container edge on the way back up.
      const raw = (rect.top + rect.height / 2 - vh / 2) / vh
      const progress = Math.max(-1, Math.min(1, raw))
      el.style.setProperty('--par', `${(progress * strength).toFixed(2)}px`)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}
