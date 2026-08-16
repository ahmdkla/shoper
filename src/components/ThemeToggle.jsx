import { useStore } from '../context/StoreContext'

/**
 * The two house themes are a brand feature, not a hidden setting, so this is
 * a labelled segmented control rather than an icon-only toggle: each option
 * shows its material swatch AND its name, and the active one is marked by
 * position, weight and background — never by colour alone.
 */

const OPTIONS = [
  { id: 'leather', label: 'Leather', dot: '#7B4A2C' },
  { id: 'denim', label: 'Denim', dot: '#2E4A78' },
]

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useStore()

  return (
    <div
      role="radiogroup"
      aria-label="Store theme"
      className="inline-flex items-center gap-0.5 rounded-xs border border-line bg-surface p-0.5"
    >
      {OPTIONS.map((o) => {
        const active = theme === o.id
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            aria-label={`${o.label} theme`}
            onClick={() => setTheme(o.id)}
            title={`${o.label} theme`}
            className={`flex h-9 items-center gap-2 rounded-xs px-2.5 text-xs transition-colors duration-200 ${
              active
                ? 'bg-inverse font-medium text-on-inverse'
                : 'text-fg-muted hover:bg-surface-2'
            }`}
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/20"
              style={{ backgroundColor: o.dot }}
            />
            <span className={compact ? 'hidden sm:inline' : ''}>{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
