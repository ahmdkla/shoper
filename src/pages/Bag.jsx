import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingBag, Trash, Truck } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { getProduct, PRODUCTS } from '../data/products'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import { Button, EmptyState, SectionHead } from '../components/ui'
import { cartTotals, money } from '../lib/format'

export default function Bag() {
  const { cart, updateQty, removeLine } = useStore()
  const t = cartTotals(cart)

  const suggestions = PRODUCTS.filter(
    (p) => !cart.some((l) => l.id === p.id) && p.badge === 'bestseller',
  ).slice(0, 4)

  return (
    <div className="u-container py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-fg-muted">
          <li>
            <Link to="/" className="hover:text-fg">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            Bag
          </li>
        </ol>
      </nav>

      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Your bag</h1>
        <p className="tnum text-sm text-fg-muted">
          {t.count} {t.count === 1 ? 'item' : 'items'}
        </p>
      </div>

      {cart.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          body="Nothing in here yet. The jackets are where most people start — it is what we do best."
          action={
            <Button as={Link} to="/shop" size="lg">
              Shop all pieces
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          {/* Lines */}
          <div>
            <ul className="divide-y divide-line border-b border-line">
              {cart.map((line) => {
                const product = getProduct(line.slug)
                return (
                  <li key={line.key} className="flex gap-4 py-6 sm:gap-6">
                    <Link
                      to={`/product/${line.slug}`}
                      className="h-36 w-27 shrink-0 overflow-hidden rounded-sm border border-line bg-surface-2 sm:h-44 sm:w-33"
                    >
                      {product && <ProductImage product={product} color={line.color} />}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-base font-medium">
                            <Link to={`/product/${line.slug}`}>{line.name}</Link>
                          </h2>
                          <p className="mt-1 text-sm text-fg-muted">
                            {line.color.name} · Size {line.size}
                          </p>
                          <p className="tnum mt-1 text-xs text-fg-subtle">
                            {money(line.price)} each
                          </p>
                        </div>
                        <p className="tnum shrink-0 text-base font-medium">
                          {money(line.price * line.qty)}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                        <div
                          className="flex items-center border border-line"
                          role="group"
                          aria-label={`Quantity for ${line.name}`}
                        >
                          <button
                            onClick={() => updateQty(line.key, line.qty - 1)}
                            className="grid h-11 w-11 place-items-center hover:bg-surface-2"
                            aria-label={`Decrease quantity of ${line.name}`}
                          >
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <span className="tnum w-10 text-center text-sm" aria-live="polite">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => updateQty(line.key, line.qty + 1)}
                            disabled={line.qty >= 10}
                            className="grid h-11 w-11 place-items-center hover:bg-surface-2 disabled:opacity-40"
                            aria-label={`Increase quantity of ${line.name}`}
                          >
                            <Plus size={14} aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeLine(line.key)}
                          className="flex h-11 items-center gap-2 px-2 text-sm text-fg-muted transition-colors hover:text-danger"
                        >
                          <Trash size={15} aria-hidden="true" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <Link
              to="/shop"
              className="mt-6 inline-flex h-11 items-center gap-2 text-sm text-fg-muted hover:text-fg"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-sm border border-line bg-surface-2 p-6">
              <h2 className="eyebrow mb-5 font-sans text-fg-subtle">Order summary</h2>

              <dl className="space-y-3 text-sm">
                <Row label="Subtotal" value={money(t.subtotal)} />
                <Row
                  label="Shipping"
                  value={t.shipping === 0 ? 'Free' : money(t.shipping)}
                  hint={
                    t.remainingForFreeShipping > 0
                      ? `${money(t.remainingForFreeShipping)} away from free`
                      : null
                  }
                />
                <Row label="Estimated tax" value={money(t.tax)} />
                <div className="flex items-baseline justify-between border-t border-line pt-4 text-base font-medium">
                  <dt>Total</dt>
                  <dd className="tnum">{money(t.total)}</dd>
                </div>
              </dl>

              <form
                className="mt-6 border-t border-line pt-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="promo" className="mb-2 block text-sm font-medium">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo"
                    type="text"
                    placeholder="Enter code"
                    autoComplete="off"
                    className="h-12 w-full border border-line-strong bg-surface px-3 text-base outline-none placeholder:text-fg-subtle"
                  />
                  <Button type="submit" variant="outline" className="shrink-0">
                    Apply
                  </Button>
                </div>
              </form>

              <Button as={Link} to="/checkout" size="lg" className="mt-6 w-full">
                Proceed to checkout
              </Button>

              <ul className="mt-5 space-y-2 text-xs text-fg-muted">
                <li className="flex items-center gap-2">
                  <Truck size={15} aria-hidden="true" /> Free returns within 30 days
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={15} aria-hidden="true" /> Secure checkout, encrypted
                  end to end
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-24 border-t border-line pt-16">
          <SectionHead eyebrow="Complete the look" title="You might also like" className="mb-10" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {suggestions.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Row({ label, value, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-fg-muted">
        {label}
        {hint && <span className="tnum mt-0.5 block text-xs text-fg-subtle">{hint}</span>}
      </dt>
      <dd className="tnum">{value}</dd>
    </div>
  )
}
