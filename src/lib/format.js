/** Locale-aware money formatting — never hand-rolled string concatenation. */
const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const money = (n) => fmt.format(n)

const compact = new Intl.NumberFormat('en-US', { notation: 'compact' })
export const compactNumber = (n) => compact.format(n)

export const FREE_SHIPPING_THRESHOLD = 200
export const TAX_RATE = 0.08

export function cartTotals(lines) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    count: lines.reduce((s, l) => s + l.qty, 0),
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  }
}
