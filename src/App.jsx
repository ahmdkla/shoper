import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Bag from './pages/Bag'
import Checkout from './pages/Checkout'
import Saved from './pages/Saved'
import Account from './pages/Account'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'

/**
 * On route change, move focus to the main region. Without this a screen
 * reader stays parked wherever the old page left it and never announces
 * that a new page arrived.
 */
function RouteFocus({ target }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    // preventScroll matters: a plain focus() scrolls <main> to the top of the
    // viewport, which drags the announcement bar off-screen on every
    // navigation. Scroll position is handled explicitly, above.
    target.current?.focus({ preventScroll: true })
  }, [pathname, target])
  return null
}

export default function App() {
  const mainRef = useRef(null)
  const location = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <RouteFocus target={mainRef} />

      {/* Keyed on pathname so each route entry replays the rise-in. */}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        key={location.pathname}
        className="page-in flex-1 outline-none"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signin" element={<Auth mode="signin" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <Toasts />
    </div>
  )
}
