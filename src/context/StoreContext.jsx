import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const KEYS = {
  cart: 'shoper.cart',
  wishlist: 'shoper.wishlist',
  theme: 'shoper.theme',
  motion: 'shoper.motion',
  recent: 'shoper.recent',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode / quota — degrade to in-memory only */
  }
}

/**
 * Plain-string write, for the two preferences the boot script in index.html
 * reads before React exists. That script compares the raw value, so anything
 * JSON-encoded here ("on" with quotes) silently fails to match and the
 * preference is lost on the next page load.
 */
function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode / quota */
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read(KEYS.cart, []))
  const [wishlist, setWishlist] = useState(() => read(KEYS.wishlist, []))
  const [recent, setRecent] = useState(() => read(KEYS.recent, []))
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  // Theme is read from the DOM, not from storage, because index.html has
  // already applied it before first paint. This keeps the two in sync.
  const [theme, setThemeState] = useState(
    () =>
      (typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme')) ||
      'leather',
  )

  // 'auto' follows the operating system; 'on'/'off' override it for this site.
  const [motion, setMotionState] = useState(
    () =>
      (typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-motion')) ||
      'auto',
  )

  /** What the OS itself reports, for labelling the 'auto' option honestly. */
  const [osReducedMotion, setOsReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setOsReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (motion === 'auto') {
      // Auto must be stored, not cleared: an empty key means "no choice yet",
      // which the boot script treats as the default (on).
      document.documentElement.removeAttribute('data-motion')
      writeRaw(KEYS.motion, 'auto')
    } else {
      document.documentElement.setAttribute('data-motion', motion)
      writeRaw(KEYS.motion, motion)
    }
  }, [motion])

  useEffect(() => write(KEYS.cart, cart), [cart])
  useEffect(() => write(KEYS.wishlist, wishlist), [wishlist])
  useEffect(() => write(KEYS.recent, recent), [recent])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    writeRaw(KEYS.theme, theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'denim' ? '#F6F8FB' : '#FAF7F2')
  }, [theme])

  // ------------------------------------------------------------- toasts

  const toast = useCallback((message, tone = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, tone }])
    // 4s sits inside the 3–5s window; long enough to read, short enough
    // not to linger over the content it covers.
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const dismissToast = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  )

  // --------------------------------------------------------------- cart

  const lineKey = (id, size, colorKey) => `${id}__${size}__${colorKey}`

  const addToCart = useCallback(
    (product, { size, color, qty = 1 }) => {
      const key = lineKey(product.id, size, color.key)
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key)
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        }
        return [
          ...prev,
          {
            key,
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            category: product.category,
            material: product.material,
            size,
            color,
            qty,
          },
        ]
      })
      setCartOpen(true)
      toast(`${product.name} added to your bag`, 'success')
    },
    [toast],
  )

  const updateQty = useCallback((key, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 10) } : l)),
    )
  }, [])

  const removeLine = useCallback(
    (key) => {
      // Look the line up before mutating, so the toast never runs inside a
      // state updater (StrictMode double-invokes those).
      const line = cart.find((l) => l.key === key)
      setCart((prev) => prev.filter((l) => l.key !== key))
      if (!line) return

      // Removal is reversible — the undo lives in the toast.
      const id = Date.now() + Math.random()
      setToasts((t) => [
        ...t,
        {
          id,
          message: `${line.name} removed`,
          tone: 'info',
          undo: () => {
            setCart((c) => (c.some((x) => x.key === key) ? c : [...c, line]))
            setToasts((t) => t.filter((x) => x.id !== id))
          },
        },
      ])
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
    },
    [cart],
  )

  const clearCart = useCallback(() => setCart([]), [])

  // ----------------------------------------------------------- wishlist

  const toggleWishlist = useCallback(
    (product) => {
      const has = wishlist.includes(product.id)
      setWishlist((prev) =>
        has ? prev.filter((x) => x !== product.id) : [...prev, product.id],
      )
      toast(has ? `${product.name} removed from saved` : `${product.name} saved`, 'info')
    },
    [wishlist, toast],
  )

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])

  // ------------------------------------------------------ recently viewed

  const pushRecent = useCallback((slug) => {
    setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8))
  }, [])

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWishlist,
      isWishlisted,
      recent,
      pushRecent,
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((t) => (t === 'leather' ? 'denim' : 'leather')),
      motion,
      setMotion: setMotionState,
      osReducedMotion,
      motionActive: motion === 'on' || (motion === 'auto' && !osReducedMotion),
      toasts,
      toast,
      dismissToast,
    }),
    [
      cart,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      cartOpen,
      wishlist,
      toggleWishlist,
      isWishlisted,
      recent,
      pushRecent,
      theme,
      motion,
      osReducedMotion,
      toasts,
      toast,
      dismissToast,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
