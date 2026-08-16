import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash, Truck, X } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { cartTotals, money } from '../lib/format'
import { getProduct } from '../data/products'
import ProductImage from './ProductImage'
import { Button, EmptyState } from './ui'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeLine } = useStore()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const restoreFocusTo = useRef(null)

  const t = cartTotals(cart)

  useEffect(() => {
    if (cartOpen) {
      restoreFocusTo.current = document.activeElement
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      restoreFocusTo.current?.focus?.()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  // Escape closes; Tab is trapped inside the panel while it is open.
  useEffect(() => {
    if (!cartOpen) return
    function onKey(e) {
      if (e.key === 'Escape') {
        setCartOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  const pct = Math.min(100, (t.subtotal / 200) * 100)

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      {/* 50% scrim — strong enough to isolate the panel from the page behind. */}
      <div className="u-fade-in absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />

      <div
        ref={panelRef}
        className="u-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg shadow-2xl"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="text-lg">
            Your bag{' '}
            <span className="tnum text-sm text-fg-muted">
              ({t.count} {t.count === 1 ? 'item' : 'items'})
            </span>
          </h2>
          <button
            ref={closeRef}
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="grid h-11 w-11 place-items-center rounded-xs hover:bg-surface-2"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {cart.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            body="Nothing in here yet. Start with the jackets — it is what we do best."
            action={
              <Button as={Link} to="/shop" onClick={() => setCartOpen(false)}>
                Shop all
              </Button>
            }
          />
        ) : (
          <>
            {/* Progress toward free shipping — a concrete, useful nudge. */}
            <div className="shrink-0 border-b border-line bg-surface-2 px-5 py-3">
              <p className="flex items-center gap-2 text-xs text-fg-muted">
                <Truck size={16} aria-hidden="true" />
                {t.remainingForFreeShipping > 0 ? (
                  <>
                    <span className="tnum">{money(t.remainingForFreeShipping)}</span> away from
                    free shipping
                  </>
                ) : (
                  <span className="font-medium text-success">
                    Free shipping unlocked on this order
                  </span>
                )}
              </p>
              <div
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-3"
                role="progressbar"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress toward free shipping"
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.map((line) => {
                const product = getProduct(line.slug)
                return (
                  <li key={line.key} className="flex gap-4 py-5">
                    <Link
                      to={`/product/${line.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="h-28 w-21 shrink-0 overflow-hidden rounded-xs border border-line bg-surface-2"
                    >
                      {product && <ProductImage product={product} color={line.color} />}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        to={`/product/${line.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-medium"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-fg-muted">
                        {line.color.name} · Size {line.size}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center border border-line">
                          <button
                            onClick={() => updateQty(line.key, line.qty - 1)}
                            className="grid h-9 w-9 place-items-center hover:bg-surface-2"
                            aria-label={`Decrease quantity of ${line.name}`}
                          >
                            <Minus size={13} aria-hidden="true" />
                          </button>
                          <span className="tnum w-8 text-center text-sm" aria-live="polite">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => updateQty(line.key, line.qty + 1)}
                            disabled={line.qty >= 10}
                            className="grid h-9 w-9 place-items-center hover:bg-surface-2 disabled:opacity-40"
                            aria-label={`Increase quantity of ${line.name}`}
                          >
                            <Plus size={13} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="tnum text-sm font-medium">{money(line.price * line.qty)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeLine(line.key)}
                      aria-label={`Remove ${line.name} from bag`}
                      className="grid h-9 w-9 shrink-0 place-items-center self-start rounded-xs text-fg-subtle hover:bg-surface-2 hover:text-danger"
                    >
                      <Trash size={16} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="shrink-0 border-t border-line px-5 py-5">
              <dl className="space-y-2 text-sm">
                <Row label="Subtotal" value={money(t.subtotal)} />
                <Row
                  label="Shipping"
                  value={t.shipping === 0 ? 'Free' : money(t.shipping)}
                />
                <Row label="Estimated tax" value={money(t.tax)} />
                <div className="flex items-baseline justify-between border-t border-line pt-3 text-base font-medium">
                  <dt>Total</dt>
                  <dd className="tnum">{money(t.total)}</dd>
                </div>
              </dl>

              <Button
                as={Link}
                to="/checkout"
                onClick={() => setCartOpen(false)}
                size="lg"
                className="mt-4 w-full"
              >
                Proceed to checkout
              </Button>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-3 h-11 w-full text-sm text-fg-muted underline underline-offset-4"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="tnum">{value}</dd>
    </div>
  )
}
