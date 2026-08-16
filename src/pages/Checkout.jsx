import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle, Info, Lock, ShoppingBag } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { getProduct } from '../data/products'
import ProductImage from '../components/ProductImage'
import { Button, EmptyState } from '../components/ui'
import { cartTotals, money } from '../lib/format'

const STEPS = ['Contact', 'Shipping', 'Payment']

const DELIVERY = [
  { id: 'standard', label: 'Standard', detail: '2–4 business days', price: 0 },
  { id: 'express', label: 'Express', detail: 'Next business day', price: 18 },
  { id: 'pickup', label: 'Collect in store', detail: 'Ready in 2 hours', price: 0 },
]

// Each field declares the autocomplete token and keyboard the browser needs.
const FIELDS = {
  0: [
    { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', inputMode: 'email', required: true, help: 'Your receipt and tracking go here.' },
    { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', inputMode: 'tel', required: false, help: 'Optional — only used for delivery updates.' },
  ],
  1: [
    { name: 'firstName', label: 'First name', autoComplete: 'given-name', required: true, half: true },
    { name: 'lastName', label: 'Last name', autoComplete: 'family-name', required: true, half: true },
    { name: 'address', label: 'Address', autoComplete: 'street-address', required: true },
    { name: 'apartment', label: 'Apartment, suite (optional)', autoComplete: 'address-line2', required: false },
    { name: 'city', label: 'City', autoComplete: 'address-level2', required: true, half: true },
    { name: 'postcode', label: 'Postal code', autoComplete: 'postal-code', inputMode: 'numeric', required: true, half: true },
    { name: 'country', label: 'Country', autoComplete: 'country-name', required: true },
  ],
  2: [
    { name: 'cardName', label: 'Name on card', autoComplete: 'cc-name', required: true },
    { name: 'cardNumber', label: 'Card number', autoComplete: 'cc-number', inputMode: 'numeric', required: true, help: 'Demo only — this form is not connected to a payment processor.' },
    { name: 'expiry', label: 'Expiry (MM/YY)', autoComplete: 'cc-exp', inputMode: 'numeric', required: true, half: true },
    { name: 'cvc', label: 'Security code', autoComplete: 'cc-csc', inputMode: 'numeric', required: true, half: true },
  ],
}

export default function Checkout() {
  const { cart, clearCart } = useStore()
  const { user, recordOrder } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  // Signed-in shoppers should not retype what we already know.
  const [values, setValues] = useState(() =>
    user ? { email: user.email, firstName: user.name.split(' ')[0] ?? '', lastName: user.name.split(' ').slice(1).join(' ') } : {},
  )
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [delivery, setDelivery] = useState(DELIVERY[0])
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const summaryRef = useRef(null)

  const t = cartTotals(cart)
  const total = t.subtotal + delivery.price + t.tax

  function validate(field, value) {
    if (field.required && !String(value ?? '').trim()) {
      return `${field.label.replace(' (optional)', '')} is required.`
    }
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'That address is missing an @ or a domain — check it and try again.'
    }
    if (field.name === 'cardNumber' && value && value.replace(/\s/g, '').length < 13) {
      return 'A card number is at least 13 digits.'
    }
    if (field.name === 'expiry' && value && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return 'Use the MM/YY format, for example 04/28.'
    }
    if (field.name === 'cvc' && value && !/^\d{3,4}$/.test(value)) {
      return 'The security code is 3 or 4 digits.'
    }
    return ''
  }

  function validateStep() {
    const next = {}
    FIELDS[step].forEach((f) => {
      const msg = validate(f, values[f.name])
      if (msg) next[f.name] = msg
    })
    setErrors(next)
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(FIELDS[step].map((f) => [f.name, true])),
    }))
    if (Object.keys(next).length) {
      // Send focus to the first invalid field, and surface a summary above.
      const first = FIELDS[step].find((f) => next[f.name])
      document.getElementById(first.name)?.focus()
      return false
    }
    return true
  }

  function next() {
    if (!validateStep()) return
    if (step < 2) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      place()
    }
  }

  const [orderId] = useState(
    () => `SHP-${Math.floor(100000 + Math.random() * 899999)}`,
  )

  function place() {
    setPlacing(true)
    // Stands in for the network round trip; the button is disabled and shows
    // a spinner throughout so the action cannot be double-submitted.
    setTimeout(() => {
      // Attach the order to the account before the cart is cleared.
      recordOrder({
        id: orderId,
        placedAt: new Date().toISOString(),
        total,
        itemCount: t.count,
        delivery: delivery.label,
        items: cart.map(({ key, slug, name, size, color, qty, price }) => ({
          key,
          slug,
          name,
          size,
          color,
          qty,
          price,
        })),
      })
      setPlacing(false)
      setDone(true)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1400)
  }

  if (done) {
    return (
      <div className="u-container py-20">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/12">
            <CheckCircle size={32} weight="fill" className="text-success" aria-hidden="true" />
          </span>
          <h1 className="mt-8 font-display text-4xl">Order confirmed</h1>
          <p className="mt-4 text-fg-muted">
            Thank you. A confirmation is on its way to{' '}
            <span className="font-medium text-fg">{values.email}</span>. Your order leaves
            our warehouse within 24 hours and you will get tracking as soon as it ships.
          </p>
          <p className="tnum mt-6 inline-block rounded-sm border border-line bg-surface-2 px-4 py-2 text-sm">
            Order <span className="font-medium">#{orderId}</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/shop" size="lg">
              Continue shopping
            </Button>
            {user && (
              <Button as={Link} to="/account" variant="outline" size="lg">
                View order
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="u-container py-12">
        <EmptyState
          icon={ShoppingBag}
          title="There is nothing to check out"
          body="Your bag is empty. Add a piece or two and come back."
          action={
            <Button as={Link} to="/shop" size="lg">
              Shop all pieces
            </Button>
          }
        />
      </div>
    )
  }

  const errorList = FIELDS[step].filter((f) => touched[f.name] && errors[f.name])

  return (
    <div className="u-container py-8 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl md:text-4xl">Checkout</h1>
        <Link
          to="/bag"
          className="flex h-11 items-center gap-2 text-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to bag
        </Link>
      </div>

      {/* Step indicator — position is shown by number, label and fill, so it
          never depends on colour alone. */}
      <ol className="mt-8 flex items-center gap-2" aria-label="Checkout progress">
        {STEPS.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'current' : 'todo'
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                aria-current={state === 'current' ? 'step' : undefined}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-medium ${
                  state === 'todo'
                    ? 'border border-line-strong text-fg-subtle'
                    : 'bg-inverse text-on-inverse'
                }`}
              >
                {state === 'done' ? <Check size={14} weight="bold" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={`hidden text-sm sm:block ${
                  state === 'current' ? 'font-medium' : 'text-fg-muted'
                }`}
              >
                {label}
                {state === 'done' && <span className="u-sr-only"> (completed)</span>}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        {/* Form */}
        <div>
          {errorList.length > 1 && (
            <div
              ref={summaryRef}
              role="alert"
              className="mb-8 rounded-sm border border-danger/40 bg-danger/6 p-4"
            >
              <p className="text-sm font-medium text-danger">
                {errorList.length} fields need attention
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {errorList.map((f) => (
                  <li key={f.name}>
                    <a href={`#${f.name}`} className="text-danger underline underline-offset-4">
                      {f.label}: {errors[f.name]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="text-xl">{STEPS[step]}</h2>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
            {FIELDS[step].map((f) => (
              <Field
                key={f.name}
                field={f}
                value={values[f.name] ?? ''}
                error={touched[f.name] ? errors[f.name] : ''}
                onChange={(v) => {
                  setValues((p) => ({ ...p, [f.name]: v }))
                  if (errors[f.name]) setErrors((p) => ({ ...p, [f.name]: validate(f, v) }))
                }}
                // Validate on blur, not on every keystroke — errors that appear
                // while you are still typing are just noise.
                onBlur={() => {
                  setTouched((p) => ({ ...p, [f.name]: true }))
                  setErrors((p) => ({ ...p, [f.name]: validate(f, values[f.name]) }))
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <fieldset className="mt-10">
              <legend className="mb-3 text-sm font-medium">Delivery method</legend>
              <div className="space-y-2">
                {DELIVERY.map((d) => (
                  <label
                    key={d.id}
                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition-colors ${
                      delivery.id === d.id
                        ? 'border-fg bg-surface-2'
                        : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery.id === d.id}
                      onChange={() => setDelivery(d)}
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{d.label}</span>
                      <span className="block text-xs text-fg-muted">{d.detail}</span>
                    </span>
                    <span className="tnum text-sm">
                      {d.price === 0 ? 'Free' : money(d.price)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <p className="mt-8 flex items-start gap-3 rounded-sm border border-line bg-surface-2 p-4 text-sm text-fg-muted">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              This is a demonstration checkout. No card details are transmitted, stored or
              charged — wire it to a real processor such as Stripe before going live.
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row-reverse">
            <Button onClick={next} size="lg" loading={placing} className="flex-1">
              {placing ? 'Placing order' : step < 2 ? 'Continue' : `Pay ${money(total)}`}
            </Button>
            {step > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep((s) => s - 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={placing}
              >
                Back
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-sm border border-line bg-surface-2 p-6">
            <h2 className="eyebrow mb-5 font-sans text-fg-subtle">
              Order summary ({t.count})
            </h2>

            <ul className="max-h-72 space-y-4 overflow-y-auto">
              {cart.map((line) => {
                const product = getProduct(line.slug)
                return (
                  <li key={line.key} className="flex gap-3">
                    <div className="relative h-20 w-15 shrink-0 overflow-hidden rounded-xs border border-line bg-surface">
                      {product && <ProductImage product={product} color={line.color} />}
                      <span className="tnum absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-inverse px-1 text-[0.625rem] text-on-inverse">
                        {line.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{line.name}</p>
                      <p className="text-xs text-fg-muted">
                        {line.color.name} · {line.size}
                      </p>
                    </div>
                    <p className="tnum text-sm">{money(line.price * line.qty)}</p>
                  </li>
                )
              })}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-muted">Subtotal</dt>
                <dd className="tnum">{money(t.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">{delivery.label}</dt>
                <dd className="tnum">
                  {delivery.price === 0 ? 'Free' : money(delivery.price)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">Estimated tax</dt>
                <dd className="tnum">{money(t.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-base font-medium">
                <dt>Total</dt>
                <dd className="tnum">{money(total)}</dd>
              </div>
            </dl>

            <p className="mt-5 flex items-center gap-2 text-xs text-fg-muted">
              <Lock size={14} aria-hidden="true" />
              Encrypted end to end
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ field, value, error, onChange, onBlur }) {
  const describedBy = error ? `${field.name}-error` : field.help ? `${field.name}-help` : undefined
  return (
    <div className={field.half ? 'col-span-1' : 'col-span-2'}>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium">
        {field.label}
        {field.required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
            <span className="u-sr-only"> (required)</span>
          </>
        )}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type ?? 'text'}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-required={field.required}
        className={`h-12 w-full rounded-xs border bg-surface px-3 text-base outline-none transition-colors ${
          error ? 'border-danger' : 'border-line-strong focus:border-fg'
        }`}
      />
      {error ? (
        <p id={`${field.name}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : field.help ? (
        <p id={`${field.name}-help`} className="mt-1.5 text-xs text-fg-subtle">
          {field.help}
        </p>
      ) : null}
    </div>
  )
}
