import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowsClockwise,
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  Ruler,
  ShieldCheck,
  Truck,
} from '@phosphor-icons/react'
import { PRODUCTS, getProduct } from '../data/products'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import { Accordion, Badge, BADGE_LABEL, Button, Price, Rating, SectionHead } from '../components/ui'
import { useStore } from '../context/StoreContext'
import { money } from '../lib/format'
import NotFound from './NotFound'

/** Four gallery views built from one silhouette: full shot, two fabric
 *  close-ups (the procedural textures hold up under magnification), and a
 *  back view. Each is a transform on the same source — no extra assets. */
const VIEWS = [
  { id: 'front', label: 'Front', scale: 1, x: 0, y: 0 },
  { id: 'fabric', label: 'Fabric detail', scale: 3.2, x: 4, y: -12 },
  { id: 'construction', label: 'Construction', scale: 2.4, x: -8, y: 14 },
  { id: 'full', label: 'Full length', scale: 1.15, x: 0, y: 2 },
]

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { addToCart, toggleWishlist, isWishlisted, pushRecent } = useStore()

  const [color, setColor] = useState(product?.colors[0])
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [view, setView] = useState(VIEWS[0])
  const [sizeError, setSizeError] = useState('')
  const sizeRef = useRef(null)

  // Reset local selections when navigating between products.
  useEffect(() => {
    if (!product) return
    setColor(product.colors[0])
    setSize('')
    setQty(1)
    setView(VIEWS[0])
    setSizeError('')
    pushRecent(product.slug)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => {
    if (!product) return []
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.material === product.material || p.category === product.category),
    ).slice(0, 4)
  }, [product])

  if (!product) return <NotFound />

  const saved = isWishlisted(product.id)

  function handleAdd() {
    if (!size) {
      // Error sits next to the control it belongs to, states the fix, and
      // moves focus there so keyboard and screen-reader users land on it.
      setSizeError('Choose a size before adding this to your bag.')
      sizeRef.current?.focus()
      return
    }
    setSizeError('')
    addToCart(product, { size, color, qty })
  }

  return (
    <>
      <div className="u-container py-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
            <li>
              <Link to="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop" className="hover:text-fg">
                Clothing
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/shop?category=${product.category}`} className="hover:text-fg">
                {product.categoryName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="u-container pb-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ------------------------------------------------------ Gallery */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-4/5 overflow-hidden rounded-sm border border-line bg-surface-2">
              <div
                className="h-full w-full transition-transform duration-500 ease-out"
                style={{
                  transform: `scale(${view.scale}) translate(${view.x}%, ${view.y}%)`,
                }}
              >
                <ProductImage product={product} color={color} priority />
              </div>

              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge tone={product.badge}>{BADGE_LABEL[product.badge]}</Badge>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from saved' : 'Save this piece'}
                className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-surface/85 text-fg backdrop-blur-sm transition-colors hover:bg-surface"
              >
                <Heart size={19} weight={saved ? 'fill' : 'regular'} aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-3 grid grid-cols-4 gap-3">
              {VIEWS.map((v) => (
                <li key={v.id}>
                  <button
                    onClick={() => setView(v)}
                    aria-pressed={view.id === v.id}
                    aria-label={v.label}
                    title={v.label}
                    className={`block aspect-square w-full overflow-hidden rounded-xs border-2 transition-colors ${
                      view.id === v.id ? 'border-fg' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <span
                      className="block h-full w-full"
                      style={{ transform: `scale(${v.scale}) translate(${v.x}%, ${v.y}%)` }}
                    >
                      <ProductImage product={product} color={color} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* -------------------------------------------------------- Detail */}
          <div>
            <p className="eyebrow text-accent">{product.materialName}</p>
            <h1 className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Rating value={product.rating} count={product.reviews} size={16} />
              <span className="text-xs text-fg-subtle">·</span>
              <span className="tnum text-xs text-fg-subtle">{product.id}</span>
            </div>

            <Price price={product.price} compareAt={product.compareAt} size="lg" className="mt-5" />

            <p className="mt-6 max-w-prose border-t border-line pt-6 text-[0.9375rem] leading-relaxed text-fg-muted">
              {product.blurb}
            </p>

            {/* Colour */}
            <div className="mt-8">
              <p className="text-sm font-medium">
                Colour — <span className="text-fg-muted">{color.name}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Choose colour">
                {product.colors.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c)}
                    aria-pressed={c.key === color.key}
                    aria-label={c.name}
                    title={c.name}
                    className="grid h-12 w-12 place-items-center rounded-xs transition-colors hover:bg-surface-2"
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full ring-1 ring-black/20 ${
                        c.key === color.key ? 'ring-2 ring-fg ring-offset-2 ring-offset-bg' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {c.key === color.key && (
                        <Check
                          size={13}
                          weight="bold"
                          className="text-white mix-blend-difference"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  Size{' '}
                  {size ? (
                    <span className="text-fg-muted">— {size}</span>
                  ) : (
                    <span className="text-fg-subtle">— select one</span>
                  )}
                </p>
                <button className="flex items-center gap-1.5 text-xs text-fg-muted underline underline-offset-4 hover:text-fg">
                  <Ruler size={14} aria-hidden="true" />
                  Size guide
                </button>
              </div>

              <div
                ref={sizeRef}
                tabIndex={-1}
                role="group"
                aria-label="Choose size"
                aria-describedby={sizeError ? 'size-error' : undefined}
                className="mt-2 flex flex-wrap gap-2 outline-none"
              >
                {product.sizes.map((s) => {
                  const soldOut = product.soldOutSizes.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSize(s)
                        setSizeError('')
                      }}
                      disabled={soldOut}
                      aria-pressed={size === s}
                      className={`relative h-12 min-w-14 rounded-xs border px-3 text-sm transition-colors ${
                        size === s
                          ? 'border-transparent bg-inverse font-medium text-on-inverse'
                          : 'border-line-strong hover:bg-surface-2'
                      } ${soldOut ? 'cursor-not-allowed text-fg-subtle line-through opacity-45' : ''}`}
                    >
                      {s}
                      {soldOut && <span className="u-sr-only">, sold out</span>}
                    </button>
                  )
                })}
              </div>

              {sizeError && (
                <p id="size-error" role="alert" className="mt-2 text-sm text-danger">
                  {sizeError}
                </p>
              )}
              <p className="mt-3 text-xs text-fg-subtle">{product.fitNote}</p>
            </div>

            {/* Quantity + add */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div
                className="flex h-14 items-center rounded-xs border border-line-strong"
                role="group"
                aria-label="Quantity"
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="grid h-full w-12 place-items-center disabled:opacity-35"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} aria-hidden="true" />
                </button>
                <span className="tnum w-10 text-center text-sm" aria-live="polite">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  disabled={qty >= 10}
                  className="grid h-full w-12 place-items-center disabled:opacity-35"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} aria-hidden="true" />
                </button>
              </div>

              <Button onClick={handleAdd} size="lg" className="flex-1">
                Add to bag — {money(product.price * qty)}
              </Button>
            </div>

            {/* Reassurance */}
            <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-fg-muted">
              <li className="flex items-center gap-3">
                <Package size={17} className="shrink-0 text-success" aria-hidden="true" />
                In stock — ships within 2–4 business days
              </li>
              <li className="flex items-center gap-3">
                <Truck size={17} className="shrink-0" aria-hidden="true" />
                Free shipping on orders over $200
              </li>
              <li className="flex items-center gap-3">
                <ArrowsClockwise size={17} className="shrink-0" aria-hidden="true" />
                Free returns within 30 days
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck size={17} className="shrink-0" aria-hidden="true" />
                Free repairs for the life of the garment
              </li>
            </ul>

            {/* Details */}
            <div className="mt-10 border-t border-line">
              <Accordion title="Fabric & fit" defaultOpen>
                <dl className="space-y-3">
                  <Spec label="Composition" value={product.fabric} />
                  <Spec label="Fit" value={product.fit} />
                  <Spec label="Material" value={product.materialName} />
                  <Spec label="Sizing" value={product.fitNote} />
                </dl>
              </Accordion>
              <Accordion title="Care instructions">{product.care}</Accordion>
              <Accordion title="Shipping & returns">
                Standard shipping is $12, free over $200, and orders leave our warehouse
                within 24 hours. Returns are free for 30 days from delivery — the piece
                needs its tags on and no signs of wear beyond trying it on.
              </Accordion>
              <Accordion title="Our guarantee">
                Every seam, zip and button is covered for the life of the garment. Send it
                back and we repair it at no cost. If we cannot repair it, we replace it.
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="u-container border-t border-line py-16">
          <SectionHead eyebrow="Complete the look" title="You might also like" className="mb-10" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function Spec({ label, value }) {
  return (
    <div className="flex gap-4">
      <dt className="w-28 shrink-0 text-fg-subtle">{label}</dt>
      <dd className="flex-1 text-fg-muted">{value}</dd>
    </div>
  )
}
