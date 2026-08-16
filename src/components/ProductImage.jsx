import { memo, useEffect, useRef, useState } from 'react'
import { unsplash, unsplashTiny } from '../data/images'

/**
 * Tracks whether an <img> has painted.
 *
 * The onLoad prop alone is not enough: a cached or eagerly-fetched image can
 * finish before React attaches the handler, and the load event is then missed
 * entirely — leaving the image stuck at opacity 0 forever. So we also check
 * `complete` once the ref is attached.
 */
function useImageLoaded() {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el?.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])

  return [ref, loaded, () => setLoaded(true)]
}

/**
 * ProductImage
 *
 * The catalogue ships without photography, so rather than fall back to broken
 * <img> tags or grey boxes, each product renders as a real garment silhouette
 * filled with a material-accurate fabric texture (denim twill, leather grain,
 * wool herringbone, technical mesh...). It is fully deterministic — same
 * product + colour always paints the same image.
 *
 * When you have real photography, drop files in /public/products/<slug>.webp
 * and add `image: '/products/<slug>.webp'` to the product row. This component
 * renders the photo instead, with identical dimensions, so nothing reflows.
 */

const VB_W = 300
const VB_H = 400

// ------------------------------------------------------------- silhouettes

const SILHOUETTES = {
  tshirts: {
    hem: 300,
    body:
      'M112 70 L86 78 L54 118 L72 148 L98 132 L98 300 L202 300 L202 132 L228 148 L246 118 L214 78 L188 70 ' +
      'C182 92 168 100 150 100 C132 100 118 92 112 70 Z',
    details: [
      'M112 70 C118 92 132 100 150 100 C168 100 182 92 188 70', // neck rib
      'M98 132 L98 300', // side seam L
      'M202 132 L202 300', // side seam R
      'M72 148 L98 132', // sleeve hem L
      'M228 148 L202 132', // sleeve hem R
    ],
  },
  shirts: {
    hem: 300,
    // The collar points are part of the silhouette, not a detail stroke —
    // details are clipped to the body, so anything drawn above the shoulder
    // line would simply disappear.
    body:
      'M124 60 L114 80 L88 86 L62 118 L50 238 L80 248 L98 148 L98 300 L202 300 L202 148 L220 248 L250 238 L238 118 L212 86 L186 80 L176 60 ' +
      'L150 102 Z',
    details: [
      'M114 80 L150 112 L186 80', // collar band under the points
      'M150 102 L150 300', // placket
      'M98 148 L98 300',
      'M202 148 L202 300',
      'M50 238 L80 248', // cuff L
      'M250 238 L220 248', // cuff R
      'M112 156 L138 156', // chest pocket
    ],
    buttons: [
      [150, 140],
      [150, 180],
      [150, 220],
      [150, 260],
    ],
  },
  jackets: {
    hem: 282,
    // Cropped moto/trucker length with a broader shoulder — this is what
    // separates it from the shirt at a glance.
    body:
      'M110 68 L76 80 L52 118 L40 234 L74 244 L92 148 L92 282 L208 282 L208 148 L226 244 L260 234 L248 118 L224 80 L190 68 ' +
      'L150 116 Z',
    details: [
      'M110 68 L150 116 L190 68', // open front V
      'M150 116 L150 282', // centre zip
      'M110 68 L126 122 L150 116', // lapel L
      'M190 68 L174 122 L150 116', // lapel R
      'M92 148 L92 282',
      'M208 148 L208 282',
      'M96 240 L128 240', // pocket L
      'M204 240 L172 240', // pocket R
      'M92 268 L208 268', // waist band
      'M40 234 L74 244', // cuff L
      'M260 234 L226 244', // cuff R
    ],
  },
  suits: {
    hem: 304,
    // Blazer: notch lapel breaking low, longer skirt than the jacket.
    body:
      'M112 70 L80 82 L56 118 L46 240 L78 250 L96 150 L96 304 L204 304 L204 150 L222 250 L254 240 L244 118 L220 82 L188 70 ' +
      'L150 156 Z',
    details: [
      'M112 70 L150 156 L188 70', // lapel V
      'M112 70 L128 130 L150 156', // notch lapel L
      'M188 70 L172 130 L150 156',
      'M128 130 L110 120', // notch cut L
      'M172 130 L190 120', // notch cut R
      'M150 156 L150 304',
      'M96 150 L96 304',
      'M204 150 L204 304',
      'M102 258 L136 258', // flap pocket L
      'M198 258 L164 258',
      'M118 186 L138 186', // breast pocket
    ],
    buttons: [
      [150, 190],
      [150, 226],
    ],
  },
  pants: {
    hem: 352,
    body: 'M96 76 L204 76 L198 352 L156 352 L150 196 L144 352 L102 352 Z',
    details: [
      'M96 96 L204 96', // waistband
      'M150 96 L150 196', // fly
      'M126 130 L126 352', // crease L
      'M174 130 L174 352', // crease R
      'M102 100 L118 126', // pocket L
      'M198 100 L182 126', // pocket R
    ],
  },
  dryfit: {
    hem: 292,
    body:
      'M116 72 L92 80 L66 114 L84 144 L106 128 L106 292 L194 292 L194 128 L216 144 L234 114 L208 80 L184 72 ' +
      'C179 90 166 98 150 98 C134 98 121 90 116 72 Z',
    details: [
      'M116 72 C121 90 134 98 150 98 C166 98 179 90 184 72', // neck
      'M92 80 L106 128', // raglan seam L
      'M208 80 L194 128', // raglan seam R
      'M106 292 L194 292',
    ],
    mesh: [
      [110, 146, 22, 128], // x, y, w, h — side ventilation panels
      [168, 146, 22, 128],
    ],
  },
}

// --------------------------------------------------------------- textures

/** Relative luminance — decides whether seams are drawn light or dark. */
function luminance(hex) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c) : h.match(/.{2}/g)
  const [r, g, b] = n.map((v) => {
    const c = parseInt(v, 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function Texture({ material, uid }) {
  switch (material) {
    case 'denim':
      // Right-hand twill: the diagonal wale that makes denim read as denim.
      return (
        <pattern
          id={`tex-${uid}`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(62)"
        >
          <rect width="8" height="8" fill="none" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeOpacity="0.17" strokeWidth="2" />
          <line x1="4" y1="0" x2="4" y2="8" stroke="#000" strokeOpacity="0.13" strokeWidth="1.5" />
        </pattern>
      )
    case 'leather':
      // Irregular pebbled grain via fractal noise.
      return (
        <pattern id={`tex-${uid}`} width="120" height="120" patternUnits="userSpaceOnUse">
          <filter id={`grain-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="4" seed="7" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="120" height="120" filter={`url(#grain-${uid})`} opacity="0.22" />
        </pattern>
      )
    case 'wool':
      // Herringbone chevron.
      return (
        <pattern id={`tex-${uid}`} width="12" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M0 8 L6 0 L12 8"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.15"
            strokeWidth="1.6"
          />
          <path
            d="M0 4 L6 -4 L12 4"
            fill="none"
            stroke="#000"
            strokeOpacity="0.1"
            strokeWidth="1.2"
          />
        </pattern>
      )
    case 'linen':
      // Slub: irregular thick/thin horizontal picks.
      return (
        <pattern id={`tex-${uid}`} width="14" height="9" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="14" y2="2" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.8" />
          <line x1="0" y1="6" x2="9" y2="6" stroke="#000" strokeOpacity="0.09" strokeWidth="1.2" />
          <line x1="10" y1="6" x2="14" y2="6" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.2" />
        </pattern>
      )
    case 'technical':
      // Fine engineered mesh.
      return (
        <pattern id={`tex-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.1" fill="#fff" fillOpacity="0.17" />
          <circle cx="0" cy="0" r="0.8" fill="#000" fillOpacity="0.1" />
        </pattern>
      )
    default:
      // Cotton — plain weave crosshatch.
      return (
        <pattern id={`tex-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#000" strokeOpacity="0.07" strokeWidth="1" />
          <line x1="0" y1="0" x2="5" y2="0" stroke="#fff" strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
      )
  }
}

// -------------------------------------------------------------- component

/**
 * Photo
 *
 * A responsive Unsplash image with a blurred low-quality placeholder behind it,
 * so the box is filled from the first frame and the real file fades in. The
 * wrapper owns the aspect ratio, which is what keeps CLS at zero.
 */
export function Photo({
  id,
  alt,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  className = '',
  imgClassName = '',
  tint = true,
  onFail,
  children,
}) {
  const [ref, loaded, markLoaded] = useImageLoaded()

  const srcSet = [400, 600, 800, 1200, 1600]
    .map((w) => `${unsplash(id, { w, h: Math.round(w * 1.25) })} ${w}w`)
    .join(', ')

  return (
    <div
      className={`u-imgwrap ${className}`}
      style={{ backgroundImage: `url("${unsplashTiny(id)}")` }}
    >
      <img
        ref={ref}
        src={unsplash(id, { w: 800, h: 1000 })}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={markLoaded}
        onError={onFail}
        data-loaded={loaded}
        className={`u-img u-fadein ${tint ? 'u-tint' : ''} ${imgClassName}`}
      />
      {children}
    </div>
  )
}

function ProductImage({ product, color, className = '', priority = false, bare = false, sizes }) {
  const swatch = color || product.colors[0]
  const shape = SILHOUETTES[product.category] || SILHOUETTES.tshirts
  const uid = `${product.id}-${swatch.key}`.replace(/[^A-Za-z0-9-]/g, '')

  const isDark = luminance(swatch.hex) < 0.42
  const seam = isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.28)'
  const edge = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.26)'

  const label = `${product.name} in ${swatch.name}, ${product.materialName.toLowerCase()}`

  const [failed, setFailed] = useState(false)

  // Photography first. The drawn silhouette below stays as a real fallback for
  // a missing id or a failed request, so a card is never an empty box.
  if (product.photo && !failed) {
    return (
      <Photo
        id={product.photo}
        alt={label}
        priority={priority}
        sizes={sizes}
        className={`h-full w-full ${className}`}
        onFail={() => setFailed(true)}
      />
    )
  }

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <Texture material={product.material} uid={uid} />

        <clipPath id={`clip-${uid}`}>
          <path d={shape.body} />
        </clipPath>

        {/* Studio backdrop — a soft, off-centre falloff. */}
        <radialGradient id={`bg-${uid}`} cx="42%" cy="26%" r="86%">
          <stop offset="0%" stopColor="var(--surface)" />
          <stop offset="100%" stopColor="var(--surface-3)" />
        </radialGradient>

        {/* Directional light so the garment reads as volume, not a flat cutout. */}
        <linearGradient id={`shade-${uid}`} x1="12%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="46%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>
      </defs>

      {/* On a coloured panel the garment sits directly on it — painting our
          own backdrop there would read as a box inside a box. */}
      {!bare && <rect width={VB_W} height={VB_H} fill={`url(#bg-${uid})`} />}

      {/* Contact shadow, anchored to this garment's hem. */}
      <ellipse
        cx="150"
        cy={shape.hem + 14}
        rx={shape.hem > 340 ? 62 : 84}
        ry="9"
        fill="#000"
        opacity="0.08"
      />

      <g clipPath={`url(#clip-${uid})`}>
        <rect width={VB_W} height={VB_H} fill={swatch.hex} />
        <rect width={VB_W} height={VB_H} fill={`url(#tex-${uid})`} />
        <rect width={VB_W} height={VB_H} fill={`url(#shade-${uid})`} />

        {/* Dryfit gets visible mesh ventilation panels. */}
        {shape.mesh?.map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#000"
            opacity="0.13"
            rx="2"
          />
        ))}
      </g>

      {/* Construction lines: seams, plackets, lapels. */}
      <g
        clipPath={`url(#clip-${uid})`}
        fill="none"
        stroke={seam}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shape.details.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {shape.buttons?.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.6" fill={seam} />
      ))}

      {/* Outer edge last, so it stays crisp over everything. */}
      <path
        d={shape.body}
        fill="none"
        stroke={edge}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default memo(ProductImage)
