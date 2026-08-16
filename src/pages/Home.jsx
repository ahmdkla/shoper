import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowsClockwise,
  Scissors,
  ShieldCheck,
  Truck,
} from '@phosphor-icons/react'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { EDITORIAL, PRODUCT_IMAGES } from '../data/images'
import ProductCard from '../components/ProductCard'
import ProductImage, { Photo } from '../components/ProductImage'
import { Button } from '../components/ui'
import { compactNumber } from '../lib/format'
import { useStore } from '../context/StoreContext'
import { CountUp, Reveal, useParallax } from '../lib/motion'
import { Pause, Play } from '@phosphor-icons/react'
import { useState } from 'react'

const bySlug = (s) => PRODUCTS.find((p) => p.slug === s)

const DROPS = [
  'leather-overshirt',
  'selvedge-denim-workshirt',
  'rider-leather-jacket',
  'wool-two-piece-suit',
  'suede-trucker-jacket',
  'dryfit-quarter-zip',
].map(bySlug)

const BEST = PRODUCTS.filter((p) => p.badge === 'bestseller').slice(0, 8)

const VALUES = [
  { Icon: Truck, title: 'Free shipping over $200', body: 'Dispatched within 24 hours, tracked end to end.' },
  { Icon: ArrowsClockwise, title: '30-day returns', body: 'Wear it around the house. Change your mind.' },
  { Icon: Scissors, title: 'Free repairs for life', body: 'Zips, seams, buttons — we fix what we sold you.' },
  { Icon: ShieldCheck, title: 'Traceable hides', body: 'Every leather piece names its tannery.' },
]

const TICKER = [
  'Full-grain leather',
  'Japanese selvedge',
  'Rope-dyed indigo',
  'Vegetable tanned',
  'Shuttle loomed',
  'Repaired for life',
  'Cut in small runs',
]

export default function Home() {
  const { theme, motionActive } = useStore()
  // WCAG 2.2.2: auto-moving content needs a way to stop it.
  const [tickerPaused, setTickerPaused] = useState(false)
  // Decorative layer only — never the copy or the controls.
  const heroRef = useParallax(18)
  const heroPhoto = theme === 'denim' ? EDITORIAL.heroDenim : EDITORIAL.heroLeather

  const counts = CATEGORIES.map((c) => ({
    ...c,
    count: PRODUCTS.filter((p) => p.category === c.id).length,
    photo: PRODUCT_IMAGES[PRODUCTS.find((p) => p.category === c.id).slug],
  }))

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="u-container pt-5">
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative aspect-4/5 sm:aspect-16/10 lg:aspect-21/9">
            <div
              ref={heroRef}
              className="absolute inset-0 will-change-transform"
              style={{ transform: 'translate3d(0, var(--par, 0px), 0) scale(1.06)' }}
            >
              <Photo
                id={heroPhoto}
                alt={
                  theme === 'denim'
                    ? 'Model wearing a Shoper indigo denim jacket'
                    : 'Model wearing a Shoper full-grain leather jacket'
                }
                sizes="100vw"
                priority
                className="absolute inset-0 h-full w-full"
              />
            </div>
            {/* Two scrims: one for the copy side, one to seat the base. */}
            <div className="u-scrim-strong absolute inset-0" />
            <div className="u-scrim absolute inset-0" />

            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-2xl p-7 sm:p-12 lg:p-16">
                <Reveal as="p" variant="left" className="eyebrow text-accent">
                  {theme === 'denim' ? 'The Indigo Room' : 'The Tannery Edit'}
                </Reveal>

                <Reveal
                  as="h1"
                  variant="up"
                  delay={60}
                  className="mt-5 font-display text-[clamp(2.1rem,5.6vw,4.5rem)] leading-[1.03] text-white"
                >
                  Built to be worn in,
                  <span className="block text-accent italic">not worn out.</span>
                </Reveal>

                <Reveal
                  as="p"
                  variant="up"
                  delay={190}
                  className="mt-5 max-w-lg text-[0.9375rem] text-white/80 sm:text-base"
                >
                  Full-grain leather and Japanese selvedge denim, cut on patterns we have
                  spent years refining.
                </Reveal>

                <Reveal variant="up" delay={280} className="mt-8 flex flex-wrap gap-3">
                  <Button as={Link} to="/shop" size="lg">
                    Shop the edit
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                  <Button as={Link} to="/shop?material=leather" variant="glass" size="lg">
                    View leather
                  </Button>
                </Reveal>

                <Reveal
                  as="dl"
                  variant="up"
                  delay={380}
                  className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-6"
                >
                  {[
                    {
                      label: 'Reviews',
                      to: PRODUCTS.reduce((sum, p) => sum + p.reviews, 0),
                      format: (v) => compactNumber(Math.round(v)),
                      suffix: '+',
                    },
                    { label: 'Pieces', to: PRODUCTS.length },
                    { label: 'Avg rating', to: 4.6, decimals: 1 },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="u-sr-only">{stat.label}</dt>
                      <dd className="tnum font-display text-2xl text-white sm:text-3xl">
                        <CountUp
                          to={stat.to}
                          decimals={stat.decimals ?? 0}
                          format={stat.format}
                          suffix={stat.suffix ?? ''}
                        />
                      </dd>
                      <p className="mt-0.5 text-xs text-white/65">{stat.label}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== TICKER */}
      <section className="relative mt-6 border-y border-line bg-band">
        <div className="overflow-hidden py-3" aria-hidden="true">
          <div className="u-marquee" data-paused={tickerPaused}>
            {[0, 1].map((dup) => (
              <ul key={dup} className="flex shrink-0 items-center gap-10 pr-10">
                {TICKER.map((t) => (
                  <li key={t} className="eyebrow flex items-center gap-10 text-fg-subtle">
                    {t}
                    <span className="h-1 w-1 rounded-full bg-accent" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* The list itself is decorative and hidden from assistive tech, but
            the control must not be. Only shown when it is actually moving. */}
        {motionActive && (
          <button
            onClick={() => setTickerPaused((p) => !p)}
            aria-pressed={tickerPaused}
            aria-label={tickerPaused ? 'Resume the scrolling banner' : 'Pause the scrolling banner'}
            className="press absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg/80 text-fg-muted backdrop-blur-sm transition-colors hover:text-accent"
          >
            {tickerPaused ? (
              <Play size={13} weight="fill" aria-hidden="true" />
            ) : (
              <Pause size={13} weight="fill" aria-hidden="true" />
            )}
          </button>
        )}
      </section>

      {/* ================================================ FEATURE TRIPTYCH */}
      <section className="u-container py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureTile
            photo={PRODUCT_IMAGES['suede-trucker-jacket']}
            eyebrow="Leather"
            title="Hides that scar, soften and darken with you."
            cta="Find your fit"
            to="/shop?material=leather"
            delay={0}
          />
          <FeatureTile
            photo={EDITORIAL.denimStack}
            eyebrow="Denim"
            title="Rope-dyed indigo, woven slowly in Okayama."
            cta="Get your pair"
            to="/shop?material=denim"
            delay={70}
          />
          <FeatureTile
            photo={EDITORIAL.rail}
            eyebrow="Style stack"
            title="Layer it."
            cta="Shop jackets"
            to="/shop?category=jackets"
            centred
            delay={140}
          />
        </div>
      </section>

      {/* ====================================================== CATEGORIES */}
      <section className="u-container pb-4" aria-labelledby="cat-head">
        <SectionHead
          id="cat-head"
          eyebrow="Browse"
          title="Our category list"
          sub="Six categories, ten pieces in each — cut and finished in small runs."
        />
        <ul className="u-scrollbar-none mt-10 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
          {counts.map((c, i) => (
            <Reveal
              as="li"
              key={c.id}
              variant="rise"
              delay={Math.min(i, 5) * 45}
              className="w-44 shrink-0 sm:w-auto"
            >
              <Link
                to={`/shop?category=${c.id}`}
                className="group lift relative block aspect-4/5 overflow-hidden rounded-md border border-line"
              >
                <Photo
                  id={c.photo}
                  alt=""
                  sizes="(max-width: 640px) 45vw, 16vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-108"
                />
                <div className="u-scrim absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-lg text-white">{c.name}</p>
                  <p className="tnum text-xs text-white/70">{c.count} items</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* =========================================================== DROPS */}
      <section className="u-container py-16 md:py-20">
        <SectionHead
          eyebrow="New arrivals"
          title="Newly dropped collections"
          sub="Fresh off the pattern table, in the materials the house is built on."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
          {DROPS.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              showRating={false}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 31vw"
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button as={Link} to="/shop?badge=new" variant="outline">
            See more collections
          </Button>
        </div>
      </section>

      {/* ================================================== MATERIAL SPLIT */}
      <section className="border-y border-line bg-band py-16 md:py-24">
        <div className="u-container">
          <SectionHead
            eyebrow="What we actually do"
            title="Two materials, taken seriously"
            sub="Everything else in the catalogue exists to go with these."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <MaterialPanel
              to="/shop?material=leather"
              photo={EDITORIAL.leatherCraft}
              label="Leather"
              title="Full-grain, vegetable tanned"
              body="Hides from two family tanneries in Tuscany. The top layer is left untouched, so it scars, softens and darkens into a record of where you have worn it."
              count={PRODUCTS.filter((p) => p.material === 'leather').length}
              product={bySlug('rider-leather-jacket')}
            />
            <MaterialPanel
              to="/shop?material=denim"
              photo={EDITORIAL.denimRail}
              label="Denim"
              title="Japanese selvedge, shuttle loomed"
              body="Woven slowly on vintage looms in Okayama. Rope-dyed indigo penetrates only the outer yarn — which is exactly why it fades the way it does."
              count={PRODUCTS.filter((p) => p.material === 'denim').length}
              product={bySlug('slim-selvedge-jeans')}
              delay={60}
            />
          </div>
        </div>
      </section>

      {/* =================================================== RECOMMENDED */}
      <section className="u-container py-16 md:py-24">
        <SectionHead
          eyebrow="Picked for you"
          title="Most recommended collections"
          sub="Where most people start, and what they come back for."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <BentoTile
            photo={EDITORIAL.campaign}
            label="The everyday tee"
            to="/shop?category=tshirts"
            className="lg:col-span-2 lg:row-span-2"
          />
          <BentoTile photo={PRODUCT_IMAGES['type-iii-denim-jacket']} label="Denim jackets" to="/shop?category=jackets&material=denim" delay={90} />
          <BentoTile photo={PRODUCT_IMAGES['slim-selvedge-jeans']} label="Raw denim" to="/shop?material=denim&category=pants" delay={110} />
          <BentoTile photo={EDITORIAL.workshop} label="Repairs & care" to="/account" delay={165} />
          <BentoTile photo={PRODUCT_IMAGES['wool-two-piece-suit']} label="Tailoring" to="/shop?category=suits" delay={220} />
        </div>
      </section>

      {/* =========================================================== PROMO */}
      <section className="u-container pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-lg border border-line">
          <Photo
            id={EDITORIAL.rail}
            alt=""
            sizes="100vw"
            className="absolute inset-0 h-full w-full"
          />
          <div className="u-scrim-strong absolute inset-0" />
          <Reveal variant="left" className="relative max-w-xl p-8 sm:p-14 md:p-20">
            <p className="eyebrow text-accent">Mid-season</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.2rem)] text-white">
              Take 20% off every second layer
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/75">
              Applies automatically to overshirts, chore coats and quilted liners when you
              buy two or more. Until the end of the month.
            </p>
            <Button as={Link} to="/shop?category=jackets" size="lg" className="mt-8">
              Shop layers
              <ArrowRight size={15} aria-hidden="true" />
            </Button>
          </Reveal>
        </div>
      </section>

      {/* =================================================== BEST SELLERS */}
      <section className="u-container pb-16 md:pb-24">
        <SectionHead
          eyebrow="Reordered most"
          title="Summer collections"
          sub="The pieces our customers buy twice."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {BEST.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 23vw"
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button as={Link} to="/shop?badge=bestseller" variant="outline">
            See more collections
          </Button>
        </div>
      </section>

      {/* ========================================================== VALUES */}
      <section className="u-container pb-20">
        <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, body }, i) => (
            <Reveal
              as="li"
              key={title}
              variant="up"
              delay={Math.min(i, 5) * 45}
              className="bg-surface p-6 transition-colors hover:bg-surface-2"
            >
              <Icon size={24} className="text-accent" aria-hidden="true" />
              <h3 className="mt-4 font-sans text-sm font-medium">{title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{body}</p>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  )
}

/* ------------------------------------------------------------ fragments */

function SectionHead({ id, eyebrow, title, sub }) {
  return (
    <div className="text-center">
      <Reveal as="p" variant="down" className="eyebrow text-accent">
        {eyebrow}
      </Reveal>
      <Reveal
        as="h2"
        variant="up"
        delay={80}
        id={id}
        className="mt-3 font-display text-[clamp(1.65rem,3.4vw,2.75rem)]"
      >
        {title}
      </Reveal>
      {sub && (
        <Reveal
          as="p"
          variant="up"
          delay={160}
          className="mx-auto mt-3 max-w-xl text-sm text-fg-muted"
        >
          {sub}
        </Reveal>
      )}
    </div>
  )
}

function FeatureTile({ photo, eyebrow, title, cta, to, centred = false, delay = 0 }) {
  return (
    <Reveal
      as={Link}
      variant="rise"
      delay={delay}
      to={to}
      className="group lift relative block aspect-4/3 overflow-hidden rounded-md border border-line md:aspect-3/4"
    >
      <Photo
        id={photo}
        alt=""
        sizes="(max-width: 768px) 100vw, 33vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-106"
      />
      {/* Two stacked scrims: the gradient seats the copy, the flat wash keeps
          the eyebrow legible even where the photo goes bright. */}
      <div className="absolute inset-0 bg-black/38" />
      <div className="u-scrim absolute inset-0" />

      <div
        className={`absolute inset-0 flex flex-col p-6 ${
          centred ? 'items-center justify-center text-center' : 'justify-end items-start'
        }`}
      >
        <p className="eyebrow text-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{eyebrow}</p>
        <h3
          className={`mt-2 font-display text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] ${
            centred ? 'text-3xl' : 'max-w-xs text-xl sm:text-2xl'
          }`}
        >
          {title}
        </h3>
        <span className="nudge mt-5 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-5 text-[0.6875rem] font-medium tracking-[0.08em] text-on-accent uppercase transition-colors group-hover:bg-accent-hover">
          {cta}
          <ArrowRight size={14} className="nudge-target" aria-hidden="true" />
        </span>
      </div>
    </Reveal>
  )
}

function MaterialPanel({ to, photo, label, title, body, count, product, delay = 0 }) {
  return (
    <Reveal
      as={Link}
      variant="rise"
      delay={delay}
      to={to}
      className="group u-card lift relative flex min-h-96 flex-col justify-end overflow-hidden rounded-lg"
    >
      <Photo
        id={photo}
        alt=""
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
      />
      {/* These panels carry a full paragraph over unpredictable photography,
          so the wash is flat and heavy rather than a soft gradient. */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/55 to-transparent" />

      {/* The product itself, floated over the material shot. */}
      <div className="float absolute top-6 right-5 h-40 w-32 overflow-hidden rounded-md border border-white/15 shadow-2xl sm:h-52 sm:w-40">
        <ProductImage product={product} sizes="160px" />
      </div>

      <div className="relative max-w-md p-7 sm:p-9">
        <p className="eyebrow text-accent">
          {label} · {count} pieces
        </p>
        <h3 className="mt-3 font-display text-2xl text-white sm:text-3xl">{title}</h3>
        <p className="mt-3 text-sm text-white/75">{body}</p>
        <span className="nudge mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4">
          Explore {label.toLowerCase()}
          <ArrowRight size={15} className="nudge-target" aria-hidden="true" />
        </span>
      </div>
    </Reveal>
  )
}

function BentoTile({ photo, label, to, className = '', delay = 0 }) {
  return (
    <Reveal
      as={Link}
      variant="scale"
      delay={delay}
      to={to}
      className={`group lift relative block aspect-4/3 overflow-hidden rounded-md border border-line ${className}`}
    >
      <Photo
        id={photo}
        alt=""
        sizes="(max-width: 768px) 100vw, 33vw"
        className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
      />
      <div className="u-scrim absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
        <p className="font-display text-xl text-white">{label}</p>
        <span className="inline-flex h-9 shrink-0 items-center rounded-sm bg-white/95 px-3 text-[0.625rem] font-medium tracking-[0.08em] text-black uppercase transition-colors group-hover:bg-accent group-hover:text-on-accent">
          View all
        </span>
      </div>
    </Reveal>
  )
}
