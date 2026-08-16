import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Lightning, ShoppingBag } from '@phosphor-icons/react'
import ProductImage from './ProductImage'
import { Badge, BADGE_LABEL, Price, Rating } from './ui'
import { useStore } from '../context/StoreContext'
import { Reveal } from '../lib/motion'

export default function ProductCard({
  product,
  index = 0,
  priority = false,
  showRating = true,
  sizes,
}) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore()
  const [color, setColor] = useState(product.colors[0])
  const navigate = useNavigate()
  const saved = isWishlisted(product.id)

  const quickSize =
    product.sizes.find((s) => !product.soldOutSizes.includes(s)) ?? product.sizes[0]

  const add = () => addToCart(product, { size: quickSize, color })
  const buyNow = () => {
    addToCart(product, { size: quickSize, color })
    navigate('/checkout')
  }

  return (
    // Entrance and hover-lift must live on DIFFERENT elements. Both set the
    // `transition` shorthand, and since it is one property the later rule wins
    // outright — putting them together silently drops the opacity fade and the
    // card snaps in instead of easing.
    <Reveal
      as="div"
      variant="rise"
      // Capped so the last card in a grid does not wait a second to appear.
      delay={Math.min(index, 7) * 45}
      className="h-full"
    >
      <article className="group u-card lift @container flex h-full flex-col overflow-hidden rounded-md">
      <div className="relative">
        <Link
          to={`/product/${product.slug}`}
          className="block aspect-3/4 w-full overflow-hidden"
          aria-label={product.name}
        >
          <ProductImage
            product={product}
            color={color}
            priority={priority}
            sizes={sizes}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {product.badge ? (
            <Badge tone={product.badge}>{BADGE_LABEL[product.badge]}</Badge>
          ) : (
            <span />
          )}
          <button
            onClick={() => toggleWishlist(product)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
            className="press pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition-colors hover:scale-110 hover:bg-black/70"
          >
            <Heart size={19} weight={saved ? 'fill' : 'regular'} aria-hidden="true" />
          </button>
        </div>

        {/* Material tag, bottom-left over the photo — reinforces the house story. */}
        <span className="eyebrow pointer-events-none absolute bottom-3 left-3 rounded-xs bg-black/55 px-2 py-1 text-[0.625rem] text-white/90 backdrop-blur-sm">
          {product.materialName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans text-[0.9375rem] leading-snug font-medium">
            <Link to={`/product/${product.slug}`} className="hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <Price price={product.price} compareAt={product.compareAt} className="shrink-0" />
        </div>

        <p className="mt-1 text-[0.8125rem] text-fg-muted">{color.name}</p>

        {showRating && <Rating value={product.rating} count={product.reviews} size={12} className="mt-2" />}

        {product.colors.length > 1 && (
          <div className="mt-3 flex items-center gap-1" role="group" aria-label="Choose colour">
            {product.colors.map((c) => (
              <button
                key={c.key}
                onClick={() => setColor(c)}
                aria-pressed={c.key === color.key}
                aria-label={c.name}
                title={c.name}
                className="press grid h-7 w-7 place-items-center rounded-full"
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full ring-1 ring-white/25 transition-shadow ${
                    c.key === color.key ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Dual action, as on the reference: secondary add, primary buy.
            Side by side only once THIS CARD is wide enough for both labels.
            A container query, not a viewport one: the same card renders 3-up
            and 4-up in different sections, so viewport width says nothing
            useful about how much room the buttons actually have. */}
        <div className="mt-auto grid grid-cols-1 gap-2 pt-4 @xs:grid-cols-2">
          <button
            onClick={add}
            className="press flex h-11 items-center justify-center gap-2 rounded-sm border border-line-strong px-3 text-[0.6875rem] font-medium tracking-[0.06em] whitespace-nowrap uppercase transition-colors hover:border-accent hover:text-accent"
          >
            <ShoppingBag size={17} weight="bold" className="shrink-0" aria-hidden="true" />
            Add to cart
            <span className="u-sr-only">, {product.name}, size {quickSize}</span>
          </button>
          <button
            onClick={buyNow}
            className="press sheen flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-3 text-[0.6875rem] font-medium tracking-[0.06em] whitespace-nowrap text-on-accent uppercase transition-colors hover:bg-accent-hover"
          >
            <Lightning size={17} weight="fill" className="shrink-0" aria-hidden="true" />
            Buy now
            <span className="u-sr-only">, {product.name}, size {quickSize}</span>
          </button>
        </div>
      </div>
      </article>
    </Reveal>
  )
}
