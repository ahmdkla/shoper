import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  InstagramLogo,
  PinterestLogo,
  TiktokLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { CATEGORIES } from '../data/products'
import ThemeToggle from './ThemeToggle'
import MotionToggle from './MotionToggle'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Leather', to: '/shop?material=leather' },
      { label: 'Denim', to: '/shop?material=denim' },
      { label: 'New in', to: '/shop?badge=new' },
      { label: 'Best sellers', to: '/shop?badge=bestseller' },
      { label: 'Sale', to: '/shop?badge=sale' },
    ],
  },
  {
    title: 'Categories',
    links: CATEGORIES.map((c) => ({ label: c.name, to: `/shop?category=${c.id}` })),
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & delivery', to: '/shop' },
      { label: 'Returns & exchanges', to: '/shop' },
      { label: 'Size guide', to: '/shop' },
      { label: 'Leather care', to: '/shop' },
      { label: 'Denim care', to: '/shop' },
      { label: 'Contact us', to: '/shop' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our materials', to: '/shop' },
      { label: 'Tannery partners', to: '/shop' },
      { label: 'Repairs programme', to: '/shop' },
      { label: 'Careers', to: '/shop' },
      { label: 'Privacy policy', to: '/shop' },
      { label: 'Terms of use', to: '/shop' },
    ],
  },
]

const SOCIALS = [
  { Icon: InstagramLogo, label: 'Instagram' },
  { Icon: TiktokLogo, label: 'TikTok' },
  { Icon: YoutubeLogo, label: 'YouTube' },
  { Icon: PinterestLogo, label: 'Pinterest' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | error | done
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    // Validate on submit, state the cause and the fix, and put the message
    // next to the field rather than at the top of the page.
    if (!email.trim()) {
      setStatus('error')
      setError('Enter your email address so we know where to send it.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus('error')
      setError('That address is missing an @ or a domain — check it and try again.')
      return
    }
    setStatus('done')
    setError('')
  }

  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      {/* Newsletter */}
      <div className="border-b border-line">
        <div className="u-container grid gap-8 py-14 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <h2 className="text-2xl md:text-3xl">Join & get 10% off</h2>
            <p className="mt-3 max-w-md text-sm text-fg-muted">
              New drops, restocks on the jackets that sell out, and care guides worth
              actually reading. Two emails a month, no more.
            </p>
          </div>

          {status === 'done' ? (
            <p
              role="status"
              className="flex items-center gap-3 border border-success/40 bg-surface px-5 py-4 text-sm text-success"
            >
              <CheckCircle size={20} weight="fill" aria-hidden="true" />
              You are on the list. Your code is on its way to {email}.
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="md:justify-self-end md:w-full md:max-w-md">
              <label htmlFor="newsletter-email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') {
                      setStatus('idle')
                      setError('')
                    }
                  }}
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? 'newsletter-error' : 'newsletter-help'}
                  placeholder="you@example.com"
                  className="h-12 w-full border border-line-strong bg-surface px-4 text-base outline-none placeholder:text-fg-subtle"
                />
                <button
                  type="submit"
                  className="grid h-12 w-12 shrink-0 place-items-center bg-inverse text-on-inverse transition-opacity hover:opacity-88"
                  aria-label="Subscribe to the newsletter"
                >
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
              {status === 'error' ? (
                <p id="newsletter-error" role="alert" className="mt-2 text-sm text-danger">
                  {error}
                </p>
              ) : (
                <p id="newsletter-help" className="mt-2 text-xs text-fg-subtle">
                  Unsubscribe any time. We never sell your details.
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Link columns */}
      <div className="u-container grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <p className="font-display text-2xl tracking-[0.22em] uppercase">Shoper</p>
          <p className="mt-4 max-w-xs text-sm text-fg-muted">
            Leather and denim first. Built to be worn in, not worn out.
          </p>
          <div className="mt-6 flex gap-1">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-xs text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="eyebrow mb-4 font-sans text-fg-subtle">{col.title}</h3>
            <ul className="space-y-1">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="inline-flex min-h-9 items-center text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="u-container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} Shoper. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-xs text-fg-subtle">Theme</span>
            <ThemeToggle />
            <span className="ml-2 text-xs text-fg-subtle">Animation</span>
            <MotionToggle showHint={false} />
          </div>
        </div>
      </div>
    </footer>
  )
}
