/**
 * Shoper catalogue — 60 products, 10 per category.
 *
 * Rows are compact tuples so the data stays scannable and diffable; `build()`
 * expands them into full product objects and derives everything that can be
 * derived (slug, sizes, care copy) instead of repeating it 60 times.
 */

// ---------------------------------------------------------------- swatches

export const SWATCHES = {
  ink: { name: 'Ink', hex: '#1A1A1E' },
  black: { name: 'Black', hex: '#141414' },
  charcoal: { name: 'Charcoal', hex: '#33363B' },
  espresso: { name: 'Espresso', hex: '#3E2A20' },
  cognac: { name: 'Cognac', hex: '#7B4A2C' },
  tan: { name: 'Tan', hex: '#B08154' },
  sable: { name: 'Sable', hex: '#8A6A4B' },
  rust: { name: 'Rust', hex: '#8C4A2F' },
  clay: { name: 'Clay', hex: '#A9705A' },
  sand: { name: 'Sand', hex: '#C8B49A' },
  ecru: { name: 'Ecru', hex: '#DCD3C3' },
  bone: { name: 'Bone', hex: '#EDE7DC' },
  white: { name: 'White', hex: '#FFFFFF' },
  olive: { name: 'Olive', hex: '#5A5F49' },
  sage: { name: 'Sage', hex: '#8A9A82' },
  indigo: { name: 'Indigo', hex: '#2E4A78' },
  rinse: { name: 'Rinse', hex: '#1F3557' },
  navy: { name: 'Navy', hex: '#22314F' },
  stone: { name: 'Stone Wash', hex: '#8FA3BE' },
  slate: { name: 'Slate', hex: '#4A5568' },
}

// ---------------------------------------------------------------- taxonomy

export const CATEGORIES = [
  { id: 'shirts', name: 'Shirts', blurb: 'Selvedge, suede and oxford.' },
  { id: 'tshirts', name: 'T-Shirts', blurb: 'Heavyweight cotton, cut boxy.' },
  { id: 'jackets', name: 'Jackets', blurb: 'The house speciality.' },
  { id: 'pants', name: 'Pants', blurb: 'Raw denim to wool trouser.' },
  { id: 'dryfit', name: 'Dryfit', blurb: 'Moisture-moving technical knit.' },
  { id: 'suits', name: 'Suits', blurb: 'Tailored, travel-ready.' },
]

export const MATERIALS = [
  { id: 'leather', name: 'Leather' },
  { id: 'denim', name: 'Denim' },
  { id: 'cotton', name: 'Cotton' },
  { id: 'wool', name: 'Wool' },
  { id: 'linen', name: 'Linen' },
  { id: 'technical', name: 'Technical' },
]

const SIZE_SETS = {
  standard: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  waist: ['28', '30', '32', '34', '36', '38'],
  suit: ['36R', '38R', '40R', '42R', '44R', '46R'],
}

const SIZES_BY_CATEGORY = {
  pants: 'waist',
  suits: 'suit',
}

const CARE = {
  leather:
    'Wipe with a dry cloth. Condition twice a year with a neutral leather balm. Never machine wash; dry away from direct heat.',
  denim:
    'Wash cold inside-out, sparingly — the fades are yours to earn. Hang dry. Expect indigo transfer on light surfaces for the first few wears.',
  cotton: 'Machine wash cold with like colours. Tumble dry low. Warm iron if needed.',
  wool: 'Dry clean recommended. Steam between wears and rest on a broad hanger for 24 hours.',
  linen: 'Machine wash cold on gentle. Line dry. Creasing is characteristic of the fibre.',
  technical:
    'Machine wash cold. No fabric softener — it clogs the wicking structure. Tumble dry low or hang dry.',
}

// Sizing note shown under the fit block, keyed by category.
const FIT_NOTE = {
  shirts: 'Model is 6\'1" / 185cm wearing size M.',
  tshirts: 'Model is 6\'1" / 185cm wearing size M.',
  jackets: 'Model is 6\'1" / 185cm wearing size M. Size up to layer over knitwear.',
  pants: 'Model is 6\'1" / 185cm wearing size 32.',
  dryfit: 'Model is 6\'1" / 185cm wearing size M. Athletic cut.',
  suits: 'Model is 6\'1" / 185cm wearing 40R.',
}

// ---------------------------------------------------------------- rows
// [name, category, material, price, compareAt, colors, rating, reviews, badge, blurb, fabric, fit]

const ROWS = [
  // ---------------------------------------------------------- SHIRTS (10)
  ['Western Denim Shirt','shirts','denim',79,0,['rinse','stone','indigo'],4.6,214,'bestseller',
   'Sawtooth pockets, pearl snaps and a yoke cut straight from a 1950s workwear pattern. Rigid at first, softer every wash.',
   '100% cotton denim, 8.5oz','Regular'],
  ['Leather Overshirt','shirts','leather',429,0,['cognac','espresso','black'],4.9,86,'new',
   'A shirt cut from lamb nappa so light you forget it is leather. Wear it as a third layer over a tee, or alone.',
   '100% lamb nappa leather, unlined','Relaxed'],
  ['Oxford Button-Down','shirts','cotton',49,65,['white','bone','stone'],4.5,631,'sale',
   'The one you reach for without thinking. Woven oxford with a soft roll collar that holds its shape through the week.',
   '100% cotton oxford, 140gsm','Regular'],
  ['Selvedge Denim Workshirt','shirts','denim',98,0,['indigo','rinse'],4.7,143,'',
   'Woven on shuttle looms and finished with a clean selvedge placket. Built to fade around the elbows and cuffs first.',
   '100% Japanese selvedge denim, 6.5oz','Regular'],
  ['Suede Snap Shirt','shirts','leather',349,0,['tan','sable'],4.8,64,'',
   'Goat suede with a dry, matte hand. Snaps rather than buttons, so it opens in one pull.',
   '100% goat suede','Regular'],
  ['Linen Camp Collar','shirts','linen',59,0,['bone','sage','ecru'],4.4,297,'',
   'An open collar and a straight hem, cut wide through the body to move air. For the three hottest months.',
   '100% European linen, 120gsm','Relaxed'],
  ['Flannel Overshirt','shirts','cotton',69,0,['olive','charcoal','rust'],4.6,388,'bestseller',
   'Brushed twice for weight without bulk. Sits over a tee as a jacket, under a coat as a shirt.',
   '100% brushed cotton flannel, 220gsm','Relaxed'],
  ['Chambray Shirt','shirts','denim',54,0,['stone','indigo'],4.3,256,'',
   'Denim character at half the weight. Softer from the first wear, and it takes a wash without complaint.',
   '100% cotton chambray, 4.5oz','Regular'],
  ['Merino Travel Shirt','shirts','wool',119,0,['ink','navy'],4.7,112,'',
   'Fine-gauge merino that resists creasing in a bag and odour on a long flight. Looks like a shirt, behaves like a knit.',
   '100% merino wool, 17.5 micron','Slim'],
  ['Twill Utility Shirt','shirts','cotton',64,0,['olive','sand','charcoal'],4.4,178,'',
   'Two bellows pockets, a hidden pen slot and a hem that stays tucked. Quietly useful.',
   '100% cotton twill, 180gsm','Regular'],

  // -------------------------------------------------------- T-SHIRTS (10)
  ['Heavyweight Boxy Tee','tshirts','cotton',29,0,['bone','ink','olive'],4.8,1204,'bestseller',
   'A 240gsm tee with enough body to hold its shape off the shoulder. Our most reordered piece, three years running.',
   '100% combed cotton, 240gsm','Boxy'],
  ['Pima Crew Tee','tshirts','cotton',34,0,['white','bone','navy'],4.6,842,'',
   'Long-staple Peruvian pima, knitted fine. Smoother against the skin and far less prone to pilling.',
   '100% Peruvian pima cotton, 180gsm','Regular'],
  ['Indigo-Dyed Tee','tshirts','denim',39,0,['indigo','rinse'],4.7,318,'new',
   'Rope-dyed in indigo the same way our denim is, so it fades along the seams and collar with wear.',
   '100% rope-dyed indigo cotton, 200gsm','Regular'],
  ['Pocket Slub Tee','tshirts','cotton',32,0,['ecru','sage','charcoal'],4.4,466,'',
   'Irregular slub yarn gives the surface a hand-loomed texture. No two panels read exactly alike.',
   '100% slub cotton, 190gsm','Regular'],
  ['Long Sleeve Rib Tee','tshirts','cotton',42,0,['ink','bone'],4.5,231,'',
   'A 2x1 rib that hugs without gripping, with cuffs that stay put under a jacket sleeve.',
   '95% cotton, 5% elastane rib','Slim'],
  ['Garment-Dyed Tee','tshirts','cotton',36,48,['clay','sand','olive'],4.5,392,'sale',
   'Dyed after it is sewn, so the colour settles unevenly at the seams — broken-in on day one.',
   '100% cotton, garment dyed, 210gsm','Relaxed'],
  ['Merino Base Tee','tshirts','wool',79,0,['ink','navy','stone'],4.8,157,'',
   'Wear it four days running. Merino regulates temperature and simply does not hold odour the way cotton does.',
   '100% merino wool, 150gsm','Slim'],
  ['Henley Slub Tee','tshirts','cotton',44,0,['bone','espresso'],4.3,208,'',
   'Three buttons, no collar. The placket sits open without gaping.',
   '100% slub cotton, 200gsm','Regular'],
  ['Boxy Striped Tee','tshirts','cotton',38,0,['bone','indigo'],4.4,275,'',
   'Yarn-dyed stripes — woven in, not printed on, so they never crack or lift.',
   '100% yarn-dyed cotton, 220gsm','Boxy'],
  ['Supima Vee Tee','tshirts','cotton',31,0,['white','charcoal'],4.2,189,'',
   'A shallow vee that stays flat under a shirt. Reinforced at the point so it will not stretch out.',
   '100% supima cotton, 170gsm','Regular'],

  // --------------------------------------------------------- JACKETS (10)
  ['Rider Leather Jacket','jackets','leather',649,0,['black','cognac','espresso'],4.9,342,'bestseller',
   'Asymmetric zip, snap-down lapels, and a waist belt that lets you close it against wind. Full-grain cowhide that stiffens in the cold and softens to your shape.',
   'Full-grain cowhide, 1.2mm, viscose lined','Regular'],
  ['Type III Denim Jacket','jackets','denim',129,0,['rinse','stone','indigo'],4.7,528,'bestseller',
   'The pointed-yoke silhouette, cut slightly longer in the body. Rigid denim that will hold your creases within a month.',
   '100% cotton denim, 12.5oz rigid','Regular'],
  ['Suede Trucker Jacket','jackets','leather',529,0,['tan','sable'],4.8,127,'',
   'A trucker pattern rendered in goat suede. All the shape of denim, none of the weight.',
   '100% goat suede, cupro lined','Regular'],
  ['Sherpa-Lined Denim Jacket','jackets','denim',159,0,['indigo','ecru'],4.6,289,'',
   'Bonded sherpa through the body and collar. Rated comfortably to around 5°C over a knit.',
   'Cotton denim shell, recycled polyester sherpa','Relaxed'],
  ['Café Racer Jacket','jackets','leather',579,0,['black','espresso'],4.8,196,'',
   'A clean band collar and a straight centre zip. Minimal hardware, so it reads sharp under a coat.',
   'Lamb nappa leather, 1.0mm, viscose lined','Slim'],
  ['Leather Bomber','jackets','leather',599,0,['espresso','black'],4.7,163,'',
   'Ribbed collar, cuffs and hem in wool. The body is drum-dyed so the colour runs right through the hide.',
   'Drum-dyed lambskin, merino rib trim','Regular'],
  ['Waxed Cotton Field Jacket','jackets','cotton',219,0,['olive','sand'],4.6,241,'',
   'Four bellows pockets and a wax finish that beats rain off. Re-wax it each autumn and it will outlast the decade.',
   '100% waxed cotton, 8oz, cotton lined','Relaxed'],
  ['Oversized Denim Chore Coat','jackets','denim',149,0,['indigo','stone'],4.5,204,'new',
   'French workwear proportions — dropped shoulder, square body, three patch pockets that actually hold a phone.',
   '100% cotton denim, 10oz','Oversized'],
  ['Shearling Collar Jacket','jackets','leather',699,0,['cognac','espresso'],4.9,98,'',
   'Our warmest piece. Shearling at the collar, quilted through the body, and a hide thick enough to block wind outright.',
   'Full-grain cowhide, real shearling collar','Regular'],
  ['Quilted Liner Jacket','jackets','technical',139,0,['ink','olive'],4.4,317,'',
   'Designed to zip inside our field jacket, or wear alone. Packs down to the size of a folded shirt.',
   'Recycled nylon shell, PrimaLoft fill','Slim'],

  // ----------------------------------------------------------- PANTS (10)
  ['Slim Selvedge Jeans','pants','denim',119,0,['rinse','indigo'],4.8,673,'bestseller',
   'Japanese selvedge on a slim straight block. Rigid out of the box — give it a month and it becomes yours specifically.',
   '100% Japanese selvedge denim, 13.5oz','Slim'],
  ['Straight Leg Jeans','pants','denim',89,0,['stone','indigo','rinse'],4.6,914,'',
   'A true straight from hip to hem. The block most people should start with.',
   '99% cotton, 1% elastane, 12oz','Straight'],
  ['Relaxed Tapered Jeans','pants','denim',99,0,['indigo','ink'],4.5,402,'',
   'Room through the seat and thigh, then a clean taper below the knee so it stacks properly on a boot.',
   '100% cotton denim, 12.5oz','Relaxed'],
  ['Leather Trouser','pants','leather',459,0,['black','espresso'],4.7,74,'new',
   'Cut on a trouser block rather than a jean block — pressed crease, slant pockets, no topstitching.',
   'Lamb nappa leather, 0.8mm, fully lined','Slim'],
  ['Wide-Leg Denim','pants','denim',109,0,['stone','rinse'],4.5,266,'',
   'A full 22cm leg opening with a high, clean waist. Wears long, so mind the hem.',
   '100% cotton denim, 11oz','Wide'],
  ['Cotton Chino','pants','cotton',59,0,['sand','olive','ink'],4.4,588,'',
   'Peached twill with just enough stretch to sit through a commute without bagging at the knee.',
   '98% cotton, 2% elastane twill','Slim'],
  ['Wool Pleated Trouser','pants','wool',149,0,['charcoal','navy'],4.6,183,'',
   'Single forward pleat, extended waistband tab. Dresses a plain tee up considerably.',
   '100% tropical wool, 260g','Regular'],
  ['Carpenter Denim Pant','pants','denim',94,0,['ecru','indigo'],4.4,221,'',
   'Hammer loop, rule pocket, double-layered knee. Workwear detailing that has stayed useful.',
   '100% cotton denim, 12oz','Relaxed'],
  ['Linen Drawstring Pant','pants','linen',69,0,['bone','sage'],4.3,246,'',
   'An unstructured waist and a wide leg. The pair you live in from June to September.',
   '100% European linen, 160gsm','Relaxed'],
  ['Cargo Utility Pant','pants','cotton',79,0,['olive','charcoal'],4.5,334,'',
   'Bellows pockets angled forward so they stay reachable when seated. Ripstop resists snagging.',
   '100% cotton ripstop, 200gsm','Relaxed'],

  // ---------------------------------------------------------- DRYFIT (10)
  ['Dryfit Training Tee','dryfit','technical',39,0,['ink','navy','olive'],4.6,712,'bestseller',
   'A four-channel yarn that pulls sweat off the skin and spreads it wide to dry fast. Flat seams, no chafe.',
   '88% recycled polyester, 12% elastane, 130gsm','Athletic'],
  ['Dryfit Long Sleeve','dryfit','technical',49,0,['charcoal','stone'],4.5,388,'',
   'Thumbholes at the cuff and a slightly dropped hem at the back for cold starts.',
   '90% recycled polyester, 10% elastane','Athletic'],
  ['Dryfit Running Short','dryfit','technical',44,0,['ink','olive'],4.7,529,'',
   '7-inch inseam with a bonded liner, a zip key pocket and a phone sleeve that does not bounce.',
   'Recycled polyester ripstop, liner: 92% poly / 8% elastane','Athletic'],
  ['Dryfit Compression Tight','dryfit','technical',59,0,['black','charcoal'],4.4,297,'',
   'Graduated compression through the calf. Squat-proof at the seat — we tested it specifically.',
   '78% recycled nylon, 22% elastane, 240gsm','Compression'],
  ['Dryfit Quarter-Zip','dryfit','technical',69,0,['navy','ink'],4.6,204,'new',
   'A brushed inner face for shoulder-season runs, with a zip garage so it never catches your chin.',
   '100% recycled polyester, grid fleece','Athletic'],
  ['Dryfit Mesh Panel Tank','dryfit','technical',34,0,['ink','stone'],4.3,246,'',
   'Open mesh down the spine and under the arm, where you actually run hot.',
   '92% recycled polyester, 8% elastane','Athletic'],
  ['Dryfit Track Pant','dryfit','technical',74,0,['black','charcoal'],4.5,318,'',
   'Tapered with a full-length ankle zip, so it comes off over a shoe.',
   '100% recycled polyester tricot','Tapered'],
  ['Dryfit Windbreaker','dryfit','technical',99,0,['ink','olive','navy'],4.7,176,'',
   'Packs into its own chest pocket. Wind-resistant to roughly 40km/h and still breathes uphill.',
   '100% recycled nylon ripstop, 20D','Athletic'],
  ['Dryfit Polo','dryfit','technical',54,0,['navy','bone','olive'],4.4,289,'',
   'A collar that holds shape through a round of golf and a lunch afterwards.',
   '92% recycled polyester, 8% elastane piqué','Regular'],
  ['Dryfit Seamless Base Layer','dryfit','technical',64,0,['charcoal','ink'],4.6,152,'',
   'Knitted in one piece on a circular machine — no side seams at all, so nothing rubs under a pack.',
   '80% recycled nylon, 20% elastane, seamless','Compression'],

  // ----------------------------------------------------------- SUITS (10)
  ['Wool Two-Piece Suit','suits','wool',399,0,['charcoal','navy'],4.7,214,'bestseller',
   'A half-canvassed jacket with a soft shoulder, cut to work as separates when you need it to.',
   '100% super 110s wool, half canvas','Regular'],
  ['Denim Tailored Blazer','suits','denim',249,0,['indigo','rinse'],4.6,138,'new',
   'Tailoring rendered in 10oz denim. Structured enough for the office, relaxed enough for a Friday.',
   '100% cotton denim, 10oz, unstructured','Slim'],
  ['Linen Summer Suit','suits','linen',329,0,['bone','sand'],4.5,96,'',
   'Unlined and unpadded, so it breathes. It will crease — that is the point of the fabric.',
   '100% Irish linen, unlined','Regular'],
  ['Travel Stretch Suit','suits','technical',359,0,['ink','navy'],4.8,187,'',
   'Four-way stretch with a wrinkle-recovery finish. Hangs it out overnight and the flight is gone from it.',
   '96% polyester, 4% elastane, stretch weave','Slim'],
  ['Leather Tailored Blazer','suits','leather',749,0,['espresso','black'],4.9,58,'',
   'Our most technically difficult piece — a notch lapel and a full canvas, executed in lamb nappa.',
   'Lamb nappa leather, 0.9mm, full canvas','Slim'],
  ['Herringbone Wool Suit','suits','wool',449,0,['charcoal','espresso'],4.7,124,'',
   'A broad herringbone with real depth to it. Reads as texture across a room, not as pattern.',
   '100% wool herringbone, 300g, half canvas','Regular'],
  ['Unstructured Cotton Suit','suits','cotton',289,0,['sand','olive'],4.4,142,'',
   'No canvas, no shoulder pad — it drapes off the body like a shirt. Washes at home.',
   '100% cotton twill, unstructured','Relaxed'],
  ['Double-Breasted Wool Suit','suits','wool',479,0,['navy','ink'],4.6,87,'',
   'Six-on-two with a peak lapel. Cut long enough that it still works open.',
   '100% super 120s wool, half canvas','Regular'],
  ['Denim Suit Set','suits','denim',299,0,['rinse','stone'],4.5,109,'',
   'Matching jacket and trouser in a mid-weight denim. Wear it as a set, or split it and nobody knows.',
   '100% cotton denim, 11oz','Regular'],
  ['Tuxedo Dinner Suit','suits','wool',529,0,['ink','black'],4.8,73,'',
   'Grosgrain-faced peak lapel and a covered button. The one you own for ten years and wear six times.',
   '100% wool barathea, satin facing','Slim'],
]

// ---------------------------------------------------------------- build

import { PRODUCT_IMAGES } from './images'

const slugify = (s) =>
  s
    .toLowerCase()
    // Transliterate accents first, so "Café" becomes "cafe" and not "caf".
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function build() {
  return ROWS.map((r, i) => {
    const [
      name,
      category,
      material,
      price,
      compareAt,
      colors,
      rating,
      reviews,
      badge,
      blurb,
      fabric,
      fit,
    ] = r

    const slug = slugify(name)

    return {
      id: `SHP-${String(i + 1).padStart(3, '0')}`,
      slug,
      // Verified Unsplash photo id; ProductImage falls back to the drawn
      // silhouette if this is ever missing or the request fails.
      photo: PRODUCT_IMAGES[slug] ?? null,
      name,
      category,
      categoryName: CATEGORIES.find((c) => c.id === category).name,
      material,
      materialName: MATERIALS.find((m) => m.id === material).name,
      price,
      compareAt: compareAt || null,
      colors: colors.map((k) => ({ key: k, ...SWATCHES[k] })),
      sizes: SIZE_SETS[SIZES_BY_CATEGORY[category] || 'standard'],
      rating,
      reviews,
      badge, // 'new' | 'bestseller' | 'sale' | ''
      blurb,
      fabric,
      fit,
      fitNote: FIT_NOTE[category],
      care: CARE[material],
      // A few sizes are deliberately out of stock so the UI has to handle it.
      soldOutSizes: i % 7 === 3 ? [SIZE_SETS[SIZES_BY_CATEGORY[category] || 'standard'][1]] : [],
    }
  })
}

export const PRODUCTS = build()

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)

export const priceBounds = PRODUCTS.reduce(
  (acc, p) => ({ min: Math.min(acc.min, p.price), max: Math.max(acc.max, p.price) }),
  { min: Infinity, max: 0 },
)

export const countBy = (key) =>
  PRODUCTS.reduce((acc, p) => {
    acc[p[key]] = (acc[p[key]] || 0) + 1
    return acc
  }, {})
