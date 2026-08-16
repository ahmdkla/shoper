import { Link, useNavigate } from 'react-router-dom'
import { Heart, Package, ShieldCheck, SignOut, UserCircle } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { PRODUCTS } from '../data/products'
import ProductImage from '../components/ProductImage'
import ThemeToggle from '../components/ThemeToggle'
import MotionToggle from '../components/MotionToggle'
import { Button, EmptyState } from '../components/ui'
import { money } from '../lib/format'

export default function Account() {
  const { wishlist, recent, toast } = useStore()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const recentProducts = recent
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean)

  if (!user) {
    return (
      <div className="u-container py-12">
        <EmptyState
          icon={UserCircle}
          title="You are not signed in"
          body="Create an account to keep your bag, saved pieces and order history together."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button as={Link} to="/signup" size="lg">
                Create account
              </Button>
              <Button as={Link} to="/signin" variant="outline" size="lg">
                Sign in
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="u-container py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-fg-muted">
          <li>
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            Account
          </li>
        </ol>
      </nav>

      {/* Identity */}
      <div className="u-card flex flex-wrap items-center justify-between gap-6 rounded-lg p-6 md:p-8">
        <div className="flex items-center gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent font-display text-2xl text-on-accent">
            {user.name.trim().charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl md:text-3xl">{user.name}</h1>
            <p className="mt-1 text-sm text-fg-muted">{user.email}</p>
            <p className="mt-0.5 text-xs text-fg-subtle">Member since {memberSince}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            signOut()
            toast('Signed out.', 'info')
            navigate('/')
          }}
        >
          <SignOut size={16} aria-hidden="true" />
          Sign out
        </Button>
      </div>

      {/* Orders */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">Orders</h2>
        {user.orders.length === 0 ? (
          <div className="u-card mt-5 rounded-lg p-8 text-center">
            <Package size={26} className="mx-auto text-fg-muted" aria-hidden="true" />
            <p className="mt-4 text-sm text-fg-muted">
              No orders yet. Once you place one, tracking and receipts live here.
            </p>
            <Button as={Link} to="/shop" variant="outline" size="sm" className="mt-6">
              Start shopping
            </Button>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {user.orders.map((o) => (
              <li key={o.id} className="u-card rounded-lg p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="tnum font-medium">{o.id}</p>
                  <p className="text-xs text-fg-muted">
                    {new Date(o.placedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <p className="mt-1 text-sm text-fg-muted">
                  {o.itemCount} {o.itemCount === 1 ? 'item' : 'items'} ·{' '}
                  <span className="tnum">{money(o.total)}</span>
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {o.items.map((it) => {
                    const p = PRODUCTS.find((x) => x.slug === it.slug)
                    return (
                      <li
                        key={it.key}
                        className="h-16 w-13 overflow-hidden rounded-sm border border-line"
                      >
                        {p && <ProductImage product={p} color={it.color} sizes="52px" />}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tiles */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Tile
          Icon={Heart}
          title="Saved"
          body={`${wishlist.length} ${wishlist.length === 1 ? 'piece' : 'pieces'} kept for later.`}
          action={
            <Button as={Link} to="/saved" variant="outline" size="sm">
              View saved
            </Button>
          }
        />
        <Tile
          Icon={ShieldCheck}
          title="Repairs"
          body="Free repairs for the life of any Shoper garment. Book a slot and we send a prepaid label."
          action={
            <Button variant="outline" size="sm" onClick={() => toast('Repairs booking is not wired up yet.', 'info')}>
              Book a repair
            </Button>
          }
        />
      </div>

      {/* Preferences */}
      <section className="u-card mt-10 rounded-lg p-6 md:p-8">
        <h2 className="font-display text-2xl">Preferences</h2>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            <p className="text-sm font-medium">Store theme</p>
            <p className="mt-1 max-w-md text-sm text-fg-muted">
              Leather runs tanned browns and cream. Denim runs deep indigo and cool white.
              Your choice is remembered on this device.
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            <p className="text-sm font-medium">Animation</p>
            <p className="mt-1 max-w-md text-sm text-fg-muted">
              Auto follows your device's accessibility setting. Override it if you want
              this site to move regardless.
            </p>
          </div>
          <MotionToggle />
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Recently viewed</h2>
          <ul className="u-scrollbar-none mt-6 flex gap-4 overflow-x-auto pb-2">
            {recentProducts.map((p) => (
              <li key={p.id} className="w-36 shrink-0">
                <Link to={`/product/${p.slug}`} className="group block">
                  <span className="block aspect-3/4 overflow-hidden rounded-md border border-line">
                    <ProductImage product={p} sizes="144px" />
                  </span>
                  <span className="mt-2 block text-sm font-medium">{p.name}</span>
                  <span className="tnum block text-xs text-fg-muted">${p.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Tile({ Icon, title, body, action }) {
  return (
    <div className="u-card flex flex-col rounded-lg p-6">
      <Icon size={24} className="text-accent" aria-hidden="true" />
      <h2 className="mt-4 text-base font-medium">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-fg-muted">{body}</p>
      <div className="mt-6">{action}</div>
    </div>
  )
}
