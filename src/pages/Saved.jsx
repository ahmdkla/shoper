import { Link } from 'react-router-dom'
import { Heart } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import { Button, EmptyState } from '../components/ui'

export default function Saved() {
  const { wishlist } = useStore()
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <div className="u-container py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-fg-muted">
          <li>
            <Link to="/" className="hover:text-fg">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            Saved
          </li>
        </ol>
      </nav>

      <div className="border-b border-line pb-6">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Saved</h1>
        <p className="tnum mt-2 text-sm text-fg-muted">
          {items.length} {items.length === 1 ? 'piece' : 'pieces'} kept for later.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          body="Tap the heart on any piece to keep it here. Saved items stay in this browser between visits."
          action={
            <Button as={Link} to="/shop" size="lg">
              Browse the catalogue
            </Button>
          }
        />
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
