import { useStore } from '../context/StoreContext'

/**
 * Motion preference control.
 *
 * The storefront animates by default. The system-wide "reduce motion" flag is
 * very often switched on for performance or by IT policy rather than for
 * vestibular sensitivity, so treating it as an absolute veto would leave most
 * visitors with a dead-looking shop. Anyone who does want it still has a
 * one-click Off here, plus a pause control on the scrolling banner.
 */
const OPTIONS = [
  { id: 'on', label: 'On' },
  { id: 'auto', label: 'Auto' },
  { id: 'off', label: 'Off' },
]

export default function MotionToggle({ showHint = true }) {
  const { motion, setMotion, osReducedMotion } = useStore()

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Animation"
        className="inline-flex items-center gap-0.5 rounded-sm border border-line bg-surface p-0.5"
      >
        {OPTIONS.map((o) => {
          const active = motion === o.id
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={active}
              onClick={() => setMotion(o.id)}
              className={`press h-9 rounded-xs px-3 text-xs transition-colors ${
                active
                  ? 'bg-accent font-medium text-on-accent'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {showHint && (
        <p className="mt-2 text-xs text-fg-subtle">
          {motion === 'on' && 'Animation is on. This is the default.'}
          {motion === 'auto' &&
            (osReducedMotion
              ? 'Following your system, which has animations turned off.'
              : 'Following your system, which allows animation.')}
          {motion === 'off' && 'Animation is off for this site.'}
        </p>
      )}
    </div>
  )
}
