import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeSlash, Info, ShieldCheck } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { Button } from '../components/ui'
import { Photo } from '../components/ProductImage'
import { EDITORIAL } from '../data/images'

export default function Auth({ mode: initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode)
  const { signIn, signUp, user } = useAuth()
  const { toast } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || '/account'

  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const firstField = useRef(null)

  useEffect(() => setMode(initialMode), [initialMode])
  useEffect(() => {
    if (user) navigate(next, { replace: true })
  }, [user, navigate, next])

  function validate() {
    const e = {}
    if (mode === 'signup' && !values.name.trim()) {
      e.name = 'Tell us what to call you.'
    }
    if (!values.email.trim()) {
      e.email = 'Enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      e.email = 'That address is missing an @ or a domain — check it and try again.'
    }
    if (!values.password) {
      e.password = 'Enter a password.'
    } else if (mode === 'signup' && values.password.length < 8) {
      e.password = 'Use at least 8 characters — longer is better than complicated.'
    }
    return e
  }

  async function submit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus()
      return
    }

    setBusy(true)
    const result = mode === 'signup' ? await signUp(values) : await signIn(values)
    setBusy(false)

    if (!result.ok) {
      setErrors({ [result.field]: result.error })
      document.getElementById(result.field)?.focus()
      return
    }
    toast(mode === 'signup' ? 'Account created. Welcome to Shoper.' : 'Signed in.', 'success')
    navigate(next, { replace: true })
  }

  const isSignup = mode === 'signup'

  return (
    <div className="u-container py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-line lg:grid-cols-2">
        {/* Editorial side */}
        <div className="relative hidden min-h-[34rem] lg:block">
          <Photo
            id={EDITORIAL.heroLeather}
            alt="A member of the Shoper community wearing a full-grain leather jacket"
            sizes="50vw"
            className="absolute inset-0 h-full w-full"
            priority
          />
          <div className="u-scrim absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="eyebrow text-accent">Members</p>
            <h2 className="mt-4 font-display text-4xl text-white">
              Your jackets, your fades, your repairs.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/80">
              An account keeps your bag across devices, tracks every order, and stores the
              repair history of everything you own from us.
            </p>
          </div>
        </div>

        {/* Form side */}
        <div className="bg-surface p-7 sm:p-10 lg:p-14">
          <div
            className="mb-8 inline-flex rounded-md border border-line bg-bg p-1"
            role="tablist"
            aria-label="Account access"
          >
            {[
              { id: 'signin', label: 'Sign in' },
              { id: 'signup', label: 'Create account' },
            ].map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={mode === t.id}
                onClick={() => {
                  setMode(t.id)
                  setErrors({})
                }}
                className={`h-10 rounded-sm px-4 text-sm transition-colors ${
                  mode === t.id
                    ? 'bg-accent font-medium text-on-accent'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-4xl">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-3 text-sm text-fg-muted">
            {isSignup
              ? 'One account for your bag, saved pieces and order history.'
              : 'Sign in to pick up where you left off.'}
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {isSignup && (
              <Field
                id="name"
                label="Your name"
                autoComplete="name"
                value={values.name}
                error={errors.name}
                inputRef={firstField}
                onChange={(v) => setValues((s) => ({ ...s, name: v }))}
              />
            )}

            <Field
              id="email"
              label="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={(v) => setValues((s) => ({ ...s, email: v }))}
            />

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  value={values.password}
                  onChange={(e) => setValues((s) => ({ ...s, password: e.target.value }))}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-help'}
                  className={`h-12 w-full rounded-sm border bg-bg px-3 pr-12 text-base outline-none transition-colors ${
                    errors.password ? 'border-danger' : 'border-line-strong focus:border-accent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  aria-pressed={showPw}
                  className="absolute top-0 right-0 grid h-12 w-12 place-items-center text-fg-muted hover:text-fg"
                >
                  {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" role="alert" className="mt-1.5 text-sm text-danger">
                  {errors.password}
                </p>
              ) : (
                <p id="password-help" className="mt-1.5 text-xs text-fg-subtle">
                  {isSignup ? 'At least 8 characters.' : 'Stored only in this browser.'}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" loading={busy} className="w-full">
              {isSignup ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 flex items-start gap-2.5 rounded-sm border border-line bg-bg p-3 text-xs text-fg-muted">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            Accounts are stored in this browser only, with passwords salted and hashed. No
            data leaves your device, and there is no password recovery.
          </p>

          <p className="mt-5 text-sm text-fg-muted">
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <button
              onClick={() => {
                setMode(isSignup ? 'signin' : 'signup')
                setErrors({})
              }}
              className="font-medium text-accent underline underline-offset-4"
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>

          <p className="mt-8 flex items-center gap-2 border-t border-line pt-6 text-xs text-fg-subtle">
            <Info size={14} aria-hidden="true" />
            You can also{' '}
            <Link to="/checkout" className="underline underline-offset-4">
              check out as a guest
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ id, label, error, value, onChange, inputRef, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-sm border bg-bg px-3 text-base outline-none transition-colors ${
          error ? 'border-danger' : 'border-line-strong focus:border-accent'
        }`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
