import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Heart,
  List,
  MagnifyingGlass,
  ShoppingBag,
  User,
  X,
} from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import MotionToggle from './MotionToggle'
import { usePulseKey } from '../lib/motion'
import { CATEGORIES } from '../data/products'
import { cartTotals } from '../lib/format'

const NAV = [
  { to: '/shop', label: 'Shop all' },
  { to: '/shop?material=leather', label: 'Leather' },
  { to: '/shop?material=denim', label: 'Denim' },
  { to: '/shop?category=jackets', label: 'Jackets' },
  { to: '/shop?badge=new', label: 'New in' },
]

export default function Header() {
  const { cart, wishlist, setCartOpen } = useStore()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)
  const menuBtnRef = useRef(null)

  const { count } = cartTotals(cart)
  // Re-keying the badge restarts its pop animation on every change.
  const pulseKey = usePulseKey(count)

  // Navigation must never leave a drawer open behind the new page.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  // Escape closes whichever layer is open, and focus returns to its trigger.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (searchOpen) setSearchOpen(false)
      if (menuOpen) {
        setMenuOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, menuOpen])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // The page behind a full-screen menu must not scroll.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function submitSearch(e) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setSearchOpen(false)
  }

  const iconBtn =
    'press relative grid h-11 w-11 place-items-center rounded-xs text-fg transition-colors hover:bg-surface-2 hover:text-accent'

  return (
    <>
      <a href="#main" className="u-sr-only">
        Skip to main content
      </a>

      {/* Announcement + theme switch */}
      <div className="border-b border-line bg-accent-wash">
        <div className="u-container flex h-11 items-center justify-between gap-4">
          <p className="eyebrow truncate text-accent">
            Free shipping over $200
            <span className="hidden sm:inline"> — 30-day returns, no questions</span>
          </p>
          <ThemeToggle compact />
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/92 backdrop-blur-md">
        <div className="u-container">
          <div className="flex h-18 items-center justify-between gap-4 py-3">
            {/* Left: nav (desktop) / menu (mobile) */}
            <div className="flex flex-1 items-center gap-1">
              <button
                ref={menuBtnRef}
                className={`${iconBtn} lg:hidden`}
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <List size={22} aria-hidden="true" />
              </button>

              <nav aria-label="Primary" className="hidden lg:block">
                <ul className="flex items-center gap-1">
                  {NAV.map((n) => (
                    <li key={n.label}>
                      <NavLink
                        to={n.to}
                        className={({ isActive }) =>
                          `ulink press flex h-11 items-center rounded-xs px-3 text-sm transition-colors hover:text-accent ${
                            isActive && location.search === n.to.split('?')[1]
                              ? 'font-medium text-fg'
                              : 'text-fg-muted'
                          }`
                        }
                      >
                        {n.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Centre: wordmark */}
            <Link
              to="/"
              className="shrink-0 rounded-xs px-2 font-display text-2xl tracking-[0.22em] uppercase transition-[letter-spacing,color] duration-300 hover:tracking-[0.28em] hover:text-accent md:text-[1.75rem]"
              aria-label="Shoper — home"
            >
              Shoper
            </Link>

            {/* Right: utilities */}
            <div className="flex flex-1 items-center justify-end gap-0.5">
              <button
                className={iconBtn}
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                <MagnifyingGlass size={20} aria-hidden="true" />
              </button>

              <Link to="/saved" className={`${iconBtn} relative hidden sm:grid`} aria-label={`Saved items, ${wishlist.length} items`}>
                <Heart size={20} aria-hidden="true" />
                {wishlist.length > 0 && <Dot>{wishlist.length}</Dot>}
              </Link>

              <Link
                to={user ? '/account' : '/signin'}
                className={`${iconBtn} hidden sm:grid`}
                aria-label={user ? `Account, signed in as ${user.name}` : 'Sign in'}
                title={user ? user.name : 'Sign in'}
              >
                {user ? (
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[0.6875rem] font-semibold text-on-accent"
                  >
                    {user.name.trim().charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} aria-hidden="true" />
                )}
              </Link>

              <button
                className={`${iconBtn} relative`}
                onClick={() => setCartOpen(true)}
                aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
              >
                <ShoppingBag size={20} aria-hidden="true" />
                {count > 0 && <Dot key={pulseKey}>{count}</Dot>}
              </button>
            </div>
          </div>

          {/* Search */}
          {searchOpen && (
            <form onSubmit={submitSearch} className="u-fade-in pb-4" role="search">
              <label htmlFor="site-search" className="u-sr-only">
                Search products
              </label>
              <div className="flex items-center gap-2 border border-line-strong bg-surface px-4">
                <MagnifyingGlass size={18} className="shrink-0 text-fg-muted" aria-hidden="true" />
                <input
                  ref={searchRef}
                  id="site-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search leather jackets, selvedge denim, dryfit…"
                  className="h-12 w-full bg-transparent text-base outline-none placeholder:text-fg-subtle"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 px-2 text-xs font-medium tracking-[0.08em] text-accent uppercase"
                >
                  Search
                </button>
              </div>
              <p className="mt-2 text-xs text-fg-subtle">
                Try “rider jacket”, “selvedge”, “merino” or “dryfit polo”.
              </p>
            </form>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div
            className="u-fade-in absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-menu"
            className="u-slide-in absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-bg"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="font-display text-xl tracking-[0.2em] uppercase">Shoper</span>
              <button className={iconBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="space-y-1">
                {NAV.map((n) => (
                  <li key={n.label}>
                    <Link
                      to={n.to}
                      className="flex h-12 items-center rounded-xs px-3 text-base hover:bg-surface-2"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="eyebrow mt-8 mb-2 px-3 text-fg-subtle">Categories</p>
              <ul className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/shop?category=${c.id}`}
                      className="flex h-12 items-center rounded-xs px-3 text-base text-fg-muted hover:bg-surface-2"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 border-t border-line px-3 pt-6">
                <Link to="/saved" className="flex h-12 items-center gap-3 text-base">
                  <Heart size={20} aria-hidden="true" /> Saved ({wishlist.length})
                </Link>
                <Link
                  to={user ? '/account' : '/signin'}
                  className="flex h-12 items-center gap-3 text-base"
                >
                  <User size={20} aria-hidden="true" />
                  {user ? user.name : 'Sign in'}
                </Link>
              </div>
            </nav>

            <div className="border-t border-line p-4">
              <p className="eyebrow mb-3 text-fg-subtle">Theme</p>
              <ThemeToggle />
              <p className="eyebrow mt-5 mb-3 text-fg-subtle">Animation</p>
              <MotionToggle />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Dot({ children }) {
  return (
    <span
      className="pop tnum absolute top-1 right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[0.625rem] font-semibold text-on-accent"
      aria-hidden="true"
    >
      {children}
    </span>
  )
}
