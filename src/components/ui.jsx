import { CaretDown, Check, Star } from '@phosphor-icons/react'
import { money } from '../lib/format'

/* ------------------------------------------------------------------ Button
   Every size clears the 44px minimum touch target. Disabled state carries
   the semantic attribute, reduced opacity AND a cursor change — never just
   a colour shift. */

const BTN_VARIANTS = {
  // The house button: tanned accent, dark type. Carries the brand on dark grounds.
  primary:
    'bg-accent text-on-accent hover:bg-accent-hover active:brightness-95 border border-transparent shadow-[0_2px_10px_-3px_var(--accent-glow)]',
  // Cream/ink inversion, for use on top of photography.
  contrast:
    'bg-inverse text-on-inverse hover:opacity-90 active:opacity-95 border border-transparent',
  outline:
    'border border-line-strong text-fg hover:border-accent hover:text-accent active:bg-surface-2',
  ghost: 'border border-transparent text-fg hover:bg-surface-2 active:bg-surface-3',
  glass:
    'border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20',
  danger: 'border border-transparent bg-danger text-white hover:brightness-110',
}

const BTN_SIZES = {
  sm: 'h-11 px-4 text-[0.8125rem]',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-sm',
}

export function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  const inert = disabled || loading
  return (
    <As
      className={`press sheen nudge inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-[0.06em] uppercase transition-[opacity,background-color,color,border-color] duration-200 ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${
        inert ? 'pointer-events-none cursor-not-allowed opacity-45' : ''
      } ${className}`}
      disabled={As === 'button' ? inert : undefined}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </As>
  )
}

/* ------------------------------------------------------------------- Badge */

const BADGE_TONES = {
  new: 'bg-inverse text-on-inverse',
  bestseller: 'bg-accent-wash text-accent',
  sale: 'bg-sale text-white',
  neutral: 'bg-surface-2 text-fg-muted',
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`eyebrow inline-flex items-center rounded-xs px-2 py-1 leading-none ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export const BADGE_LABEL = { new: 'New', bestseller: 'Best seller', sale: 'On sale' }

/* ------------------------------------------------------------------- Price
   Tabular figures stop the layout twitching as digits change, and the
   discount is announced, not just struck through. */

export function Price({ price, compareAt, className = '', size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-[0.9375rem]', lg: 'text-xl' }
  return (
    <p className={`tnum flex items-baseline gap-2 ${sizes[size]} ${className}`}>
      <span className={compareAt ? 'font-medium text-sale' : 'font-medium text-fg'}>
        {money(price)}
      </span>
      {compareAt && (
        <>
          <span className="text-fg-subtle line-through" aria-hidden="true">
            {money(compareAt)}
          </span>
          <span className="u-sr-only">
            reduced from {money(compareAt)}, save {money(compareAt - price)}
          </span>
        </>
      )}
    </p>
  )
}

/* ------------------------------------------------------------------ Rating
   The numeric value sits next to the stars, so the rating is never
   communicated by shape/colour alone. */

export function Rating({ value, count, size = 14, className = '' }) {
  // Phosphor has no half-star weight, so the filled row is overlaid on the
  // outline row and clipped to the exact percentage.
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} weight="regular" className="text-accent opacity-45" />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} weight="fill" className="shrink-0 text-accent" />
          ))}
        </span>
      </span>
      <span className="tnum text-xs text-fg-muted">
        {value.toFixed(1)}
        {count != null && <span className="text-fg-subtle"> ({count})</span>}
      </span>
      <span className="u-sr-only">
        Rated {value} out of 5{count != null ? ` from ${count} reviews` : ''}
      </span>
    </span>
  )
}

/* --------------------------------------------------------------- Accordion
   Native <details> — keyboard, screen-reader and find-in-page support for
   free, which a div-based accordion would have to reimplement badly. */

export function Accordion({ title, children, defaultOpen = false }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex list-none items-center justify-between gap-4 py-4 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        {title}
        <CaretDown
          size={16}
          className="shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-fg-muted">{children}</div>
    </details>
  )
}

/* ------------------------------------------------------------------ Swatch */

export function ColorSwatch({ color, selected, size = 'md', ...props }) {
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'
  return (
    <button
      type="button"
      // 44px hit area via padding, while the dot itself stays small.
      className="press grid h-11 w-11 place-items-center rounded-xs transition-colors hover:bg-surface-2"
      aria-pressed={selected}
      title={color.name}
      {...props}
    >
      <span
        className={`grid place-items-center rounded-full ring-1 ring-black/15 transition-[box-shadow] ${dim} ${
          selected ? 'ring-2 ring-fg ring-offset-2 ring-offset-surface' : ''
        }`}
        style={{ backgroundColor: color.hex }}
      >
        {selected && (
          <Check
            size={size === 'sm' ? 9 : 12}
            weight="bold"
            className="text-white mix-blend-difference"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="u-sr-only">{color.name}</span>
    </button>
  )
}

/* -------------------------------------------------------------- Section head */

export function SectionHead({ eyebrow, title, action, className = '' }) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <div>
        {eyebrow && <p className="eyebrow mb-3 text-accent">{eyebrow}</p>}
        <h2 className="text-2xl md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

/* ---------------------------------------------------------------- Skeleton */

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="u-skeleton aspect-[3/4] w-full rounded-sm" />
      <div className="u-skeleton mt-4 h-3.5 w-3/5 rounded-xs" />
      <div className="u-skeleton mt-2 h-3 w-2/5 rounded-xs" />
      <div className="u-skeleton mt-3 h-3.5 w-1/4 rounded-xs" />
    </div>
  )
}

/* ------------------------------------------------------------- Empty state */

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      {Icon && (
        <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-surface-2">
          <Icon size={26} className="text-fg-muted" aria-hidden="true" />
        </span>
      )}
      <h2 className="text-2xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-fg-muted">{body}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}
