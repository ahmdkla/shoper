import { ArrowCounterClockwise, CheckCircle, Info, X } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'

/**
 * Toasts sit in an aria-live="polite" region: announced to screen readers
 * without stealing focus from whatever the user was doing.
 */
export default function Toasts() {
  const { toasts, dismissToast } = useStore()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
    >
      {toasts.map((t) => {
        const Icon = t.tone === 'success' ? CheckCircle : Info
        return (
          <div
            key={t.id}
            role="status"
            className="u-rise pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-sm border border-line bg-inverse px-4 py-3 text-on-inverse shadow-lg"
          >
            <Icon
              size={18}
              weight="fill"
              className={t.tone === 'success' ? 'text-success' : 'opacity-70'}
              aria-hidden="true"
            />
            <p className="flex-1 text-sm">{t.message}</p>

            {t.undo && (
              <button
                onClick={t.undo}
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-xs px-2 text-xs font-medium tracking-[0.06em] uppercase underline underline-offset-4"
              >
                <ArrowCounterClockwise size={13} aria-hidden="true" />
                Undo
              </button>
            )}

            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xs opacity-70 hover:opacity-100"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
