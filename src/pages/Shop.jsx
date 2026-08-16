import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CaretLeft, CaretRight, FunnelSimple, MagnifyingGlass, X } from '@phosphor-icons/react'
import { CATEGORIES, MATERIALS, PRODUCTS, SWATCHES } from '../data/products'
import ProductCard from '../components/ProductCard'
import { Button, EmptyState } from '../components/ui'

const PER_PAGE = 12

const PRICE_BANDS = [
  { id: 'u50', label: 'Under $50', test: (p) => p.price < 50 },
  { id: '50-100', label: '$50 – $100', test: (p) => p.price >= 50 && p.price < 100 },
  { id: '100-250', label: '$100 – $250', test: (p) => p.price >= 100 && p.price < 250 },
  { id: '250-500', label: '$250 – $500', test: (p) => p.price >= 250 && p.price < 500 },
  { id: '500p', label: '$500+', test: (p) => p.price >= 500 },
]

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest first' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

const ALL_SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))]
const ALL_COLORS = [...new Set(PRODUCTS.flatMap((p) => p.colors.map((c) => c.key)))]

const BADGE_LABELS = { new: 'New in', bestseller: 'Best sellers', sale: 'On sale' }

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const list = (key) => params.get(key)?.split(',').filter(Boolean) ?? []

  const selected = {
    category: list('category'),
    material: list('material'),
    size: list('size'),
    color: list('color'),
    price: list('price'),
    badge: params.get('badge') ?? '',
    q: params.get('q') ?? '',
  }
  const sort = params.get('sort') ?? 'featured'
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1)

  /** Writes a param and always resets pagination — page 3 of a new filter is
   *  almost never what the user meant. */
  function update(key, value) {
    const next = new URLSearchParams(params)
    if (!value || value.length === 0) next.delete(key)
    else next.set(key, Array.isArray(value) ? value.join(',') : value)
    next.delete('page')
    setParams(next, { replace: false })
  }

  function toggle(key, value) {
    const current = list(key)
    update(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value])
  }

  function clearAll() {
    setParams(new URLSearchParams(), { replace: false })
  }

  // ------------------------------------------------------------- filtering

  const filtered = useMemo(() => {
    let out = PRODUCTS

    if (selected.q) {
      const q = selected.q.toLowerCase()
      out = out.filter((p) =>
        [p.name, p.materialName, p.categoryName, p.blurb, p.fabric]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    }
    if (selected.category.length) out = out.filter((p) => selected.category.includes(p.category))
    if (selected.material.length) out = out.filter((p) => selected.material.includes(p.material))
    if (selected.badge) out = out.filter((p) => p.badge === selected.badge)
    if (selected.size.length)
      out = out.filter((p) => p.sizes.some((s) => selected.size.includes(s)))
    if (selected.color.length)
      out = out.filter((p) => p.colors.some((c) => selected.color.includes(c.key)))
    if (selected.price.length) {
      const bands = PRICE_BANDS.filter((b) => selected.price.includes(b.id))
      out = out.filter((p) => bands.some((b) => b.test(p)))
    }

    const sorted = [...out]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest')
      sorted.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0))
    return sorted
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const shown = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  // Paging moves the user to a new set of results; keeping the old scroll
  // position would drop them into the middle of the grid.
  useEffect(() => {
    if (params.get('page')) window.scrollTo({ top: 220, behavior: 'smooth' })
  }, [params])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const activeCount =
    selected.category.length +
    selected.material.length +
    selected.size.length +
    selected.color.length +
    selected.price.length +
    (selected.badge ? 1 : 0) +
    (selected.q ? 1 : 0)

  const heading = selected.badge
    ? BADGE_LABELS[selected.badge]
    : selected.q
      ? `Results for “${selected.q}”`
      : selected.category.length === 1
        ? CATEGORIES.find((c) => c.id === selected.category[0])?.name
        : selected.material.length === 1
          ? `${MATERIALS.find((m) => m.id === selected.material[0])?.name} pieces`
          : 'All clothing'

  const filterPanel = (
    <FilterPanel selected={selected} toggle={toggle} clearAll={clearAll} activeCount={activeCount} />
  )

  return (
    <>
      {/* Breadcrumb + title */}
      <div className="border-b border-line bg-surface">
        <div className="u-container py-8 md:py-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-fg-muted">
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
              <li aria-current="page" className="text-fg">
                {heading}
              </li>
            </ol>
          </nav>

          <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3rem)]">{heading}</h1>
          <p className="tnum mt-2 text-sm text-fg-muted">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}, cut and finished
            in small runs.
          </p>
        </div>
      </div>

      <div className="u-container py-8 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 max-h-[calc(100dvh-9rem)] overflow-y-auto pr-2 pb-8">
              {filterPanel}
            </div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex h-11 items-center gap-2 rounded-xs border border-line-strong px-4 text-sm lg:hidden"
              >
                <FunnelSimple size={17} aria-hidden="true" />
                Filters
                {activeCount > 0 && (
                  <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.6875rem] text-on-accent">
                    {activeCount}
                  </span>
                )}
              </button>

              <p className="tnum hidden text-sm text-fg-muted lg:block" aria-live="polite">
                Showing {shown.length ? (safePage - 1) * PER_PAGE + 1 : 0}–
                {(safePage - 1) * PER_PAGE + shown.length} of {filtered.length}
              </p>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="hidden text-sm text-fg-muted sm:block">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => update('sort', e.target.value)}
                  className="h-11 rounded-xs border border-line-strong bg-surface px-3 text-sm"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <ul className="mb-8 flex flex-wrap items-center gap-2">
                {selected.q && (
                  <Chip onRemove={() => update('q', '')}>Search: {selected.q}</Chip>
                )}
                {selected.badge && (
                  <Chip onRemove={() => update('badge', '')}>
                    {BADGE_LABELS[selected.badge]}
                  </Chip>
                )}
                {selected.category.map((c) => (
                  <Chip key={c} onRemove={() => toggle('category', c)}>
                    {CATEGORIES.find((x) => x.id === c)?.name}
                  </Chip>
                ))}
                {selected.material.map((m) => (
                  <Chip key={m} onRemove={() => toggle('material', m)}>
                    {MATERIALS.find((x) => x.id === m)?.name}
                  </Chip>
                ))}
                {selected.size.map((s) => (
                  <Chip key={s} onRemove={() => toggle('size', s)}>
                    Size {s}
                  </Chip>
                ))}
                {selected.color.map((c) => (
                  <Chip key={c} onRemove={() => toggle('color', c)}>
                    {SWATCHES[c]?.name}
                  </Chip>
                ))}
                {selected.price.map((p) => (
                  <Chip key={p} onRemove={() => toggle('price', p)}>
                    {PRICE_BANDS.find((b) => b.id === p)?.label}
                  </Chip>
                ))}
                <li>
                  <button
                    onClick={clearAll}
                    className="h-9 px-2 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
                  >
                    Clear all
                  </button>
                </li>
              </ul>
            )}

            {/* Grid */}
            {shown.length === 0 ? (
              <EmptyState
                icon={MagnifyingGlass}
                title="Nothing matches those filters"
                body="Try removing a filter or two — narrowing by size and colour together often leaves very little."
                action={<Button onClick={clearAll}>Clear all filters</Button>}
              />
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} priority={i < 3} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-1">
                <button
                  onClick={() => update('page', String(safePage - 1))}
                  disabled={safePage === 1}
                  className="grid h-11 w-11 place-items-center rounded-xs border border-line disabled:opacity-35"
                  aria-label="Previous page"
                >
                  <CaretLeft size={16} aria-hidden="true" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => update('page', String(n))}
                    aria-current={n === safePage ? 'page' : undefined}
                    className={`tnum h-11 w-11 rounded-xs text-sm transition-colors ${
                      n === safePage
                        ? 'bg-inverse font-medium text-on-inverse'
                        : 'border border-line hover:bg-surface-2'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => update('page', String(safePage + 1))}
                  disabled={safePage === totalPages}
                  className="grid h-11 w-11 place-items-center rounded-xs border border-line disabled:opacity-35"
                  aria-label="Next page"
                >
                  <CaretRight size={16} aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Filter drawer — mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="u-fade-in absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="u-slide-in absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-bg">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <h2 className="text-lg">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="grid h-11 w-11 place-items-center rounded-xs hover:bg-surface-2"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="shrink-0 border-t border-line p-4">
              <Button onClick={() => setDrawerOpen(false)} size="lg" className="w-full">
                Show {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------ Filter panel */

function FilterPanel({ selected, toggle, clearAll, activeCount }) {
  const count = (key, value) =>
    PRODUCTS.filter((p) =>
      key === 'category' ? p.category === value : p.material === value,
    ).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="eyebrow text-fg-subtle">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
          >
            Clear all
          </button>
        )}
      </div>

      <Group title="Category">
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c.id}
            label={c.name}
            count={count('category', c.id)}
            checked={selected.category.includes(c.id)}
            onChange={() => toggle('category', c.id)}
          />
        ))}
      </Group>

      <Group title="Material">
        {MATERIALS.map((m) => (
          <CheckRow
            key={m.id}
            label={m.name}
            count={count('material', m.id)}
            checked={selected.material.includes(m.id)}
            onChange={() => toggle('material', m.id)}
          />
        ))}
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => {
            const on = selected.size.includes(s)
            return (
              <button
                key={s}
                onClick={() => toggle('size', s)}
                aria-pressed={on}
                className={`h-11 min-w-11 rounded-xs border px-3 text-sm transition-colors ${
                  on
                    ? 'border-transparent bg-inverse font-medium text-on-inverse'
                    : 'border-line-strong hover:bg-surface-2'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Price">
        {PRICE_BANDS.map((b) => (
          <CheckRow
            key={b.id}
            label={b.label}
            count={PRODUCTS.filter(b.test).length}
            checked={selected.price.includes(b.id)}
            onChange={() => toggle('price', b.id)}
          />
        ))}
      </Group>

      <Group title="Colour">
        <div className="flex flex-wrap gap-1">
          {ALL_COLORS.map((key) => {
            const c = SWATCHES[key]
            const on = selected.color.includes(key)
            return (
              <button
                key={key}
                onClick={() => toggle('color', key)}
                aria-pressed={on}
                aria-label={c.name}
                title={c.name}
                className="grid h-11 w-11 place-items-center rounded-xs hover:bg-surface-2"
              >
                <span
                  className={`h-5 w-5 rounded-full ring-1 ring-black/20 ${
                    on ? 'ring-2 ring-fg ring-offset-2 ring-offset-bg' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            )
          })}
        </div>
      </Group>
    </div>
  )
}

function Group({ title, children }) {
  return (
    <fieldset className="border-t border-line pt-6">
      <legend className="mb-3 text-sm font-medium">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  )
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xs px-1 text-sm hover:bg-surface-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-accent"
      />
      <span className="flex-1">{label}</span>
      <span className="tnum text-xs text-fg-subtle">{count}</span>
    </label>
  )
}

function Chip({ children, onRemove }) {
  return (
    <li>
      <button
        onClick={onRemove}
        className="flex h-9 items-center gap-2 rounded-xs border border-line bg-surface px-3 text-xs transition-colors hover:border-line-strong"
      >
        {children}
        <X size={12} weight="bold" className="text-fg-muted" aria-hidden="true" />
        <span className="u-sr-only">Remove filter</span>
      </button>
    </li>
  )
}
