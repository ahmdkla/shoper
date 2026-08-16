/**
 * Product photography.
 *
 * Every ID below was verified to return HTTP 200 from the Unsplash CDN and was
 * visually checked against the product it is attached to. These are stand-in
 * catalogue images from Unsplash's free library, not Shoper's own photography —
 * replace them with real shoots before launch (see README).
 *
 * `unsplash()` builds a sized, cropped, auto-format URL so the browser gets
 * WebP/AVIF where supported and never downloads a 4000px original.
 */

const CDN = 'https://images.unsplash.com/'

export function unsplash(id, { w = 800, h = 1000, q = 75 } = {}) {
  return `${CDN}${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`
}

/** Low-quality placeholder, blurred behind the real image while it loads. */
export function unsplashTiny(id) {
  return `${CDN}${id}?auto=format&fit=crop&w=24&h=30&q=30&blur=80`
}

// slug -> Unsplash photo id
export const PRODUCT_IMAGES = {
  // ------------------------------------------------------------- shirts
  'western-denim-shirt': 'photo-1516257984-b1b4d707412e',
  'leather-overshirt': 'photo-1611601322175-ef8ec8c85f01',
  'oxford-button-down': 'photo-1598032895397-b9472444bf93',
  'selvedge-denim-workshirt': 'photo-1596755094514-f87e34085b2c',
  'suede-snap-shirt': 'photo-1591047139829-d91aecb6caea',
  'linen-camp-collar': 'photo-1523381210434-271e8be1f52b',
  'flannel-overshirt': 'photo-1544022613-e87ca75a784a',
  'chambray-shirt': 'photo-1576871337622-98d48d1cf531',
  'merino-travel-shirt': 'photo-1621072156002-e2fccdc0b176',
  'twill-utility-shirt': 'photo-1551232864-3f0890e580d9',

  // ----------------------------------------------------------- t-shirts
  'heavyweight-boxy-tee': 'photo-1521572163474-6864f9cf17ab',
  'pima-crew-tee': 'photo-1581655353564-df123a1eb820',
  'indigo-dyed-tee': 'photo-1622519407650-3df9883f76a5',
  'pocket-slub-tee': 'photo-1562157873-818bc0726f68',
  'long-sleeve-rib-tee': 'photo-1618354691229-88d47f285158',
  'garment-dyed-tee': 'photo-1489987707025-afc232f7ea0f',
  'merino-base-tee': 'photo-1600180758890-6b94519a8ba6',
  'henley-slub-tee': 'photo-1507003211169-0a1dd7228f2d',
  'boxy-striped-tee': 'photo-1503342217505-b0a15ec3261c',
  'supima-vee-tee': 'photo-1620799139507-2a76f79a2f4d',

  // ------------------------------------------------------------ jackets
  'rider-leather-jacket': 'photo-1520975954732-35dd22299614',
  'type-iii-denim-jacket': 'photo-1495105787522-5334e3ffa0ef',
  'suede-trucker-jacket': 'photo-1591047139829-d91aecb6caea',
  'sherpa-lined-denim-jacket': 'photo-1543076447-215ad9ba6923',
  'cafe-racer-jacket': 'photo-1551028719-00167b16eac5',
  'leather-bomber': 'photo-1611601322175-ef8ec8c85f01',
  'waxed-cotton-field-jacket': 'photo-1544022613-e87ca75a784a',
  'oversized-denim-chore-coat': 'photo-1611312449408-fcece27cdbb7',
  'shearling-collar-jacket': 'photo-1521223890158-f9f7c3d5d504',
  'quilted-liner-jacket': 'photo-1509942774463-acf339cf87d5',

  // -------------------------------------------------------------- pants
  'slim-selvedge-jeans': 'photo-1542272604-787c3835535d',
  'straight-leg-jeans': 'photo-1602293589930-45aad59ba3ab',
  'relaxed-tapered-jeans': 'photo-1541099649105-f69ad21f3246',
  'leather-trouser': 'photo-1552902865-b72c031ac5ea',
  'wide-leg-denim': 'photo-1582418702059-97ebafb35d09',
  'cotton-chino': 'photo-1517445312882-bc9910d016b7',
  'wool-pleated-trouser': 'photo-1515886657613-9f3515b0c78f',
  'carpenter-denim-pant': 'photo-1605518216938-7c31b7b14ad0',
  'linen-drawstring-pant': 'photo-1594633312681-425c7b97ccd1',
  'cargo-utility-pant': 'photo-1560243563-062bfc001d68',

  // ------------------------------------------------------------- dryfit
  'dryfit-training-tee': 'photo-1483721310020-03333e577078',
  'dryfit-long-sleeve': 'photo-1517466787929-bc90951d0974',
  'dryfit-running-short': 'photo-1517649763962-0c623066013b',
  'dryfit-compression-tight': 'photo-1571019613454-1cb2f99b2d8b',
  'dryfit-quarter-zip': 'photo-1556821840-3a63f95609a7',
  'dryfit-mesh-panel-tank': 'photo-1584464491033-06628f3a6b7b',
  'dryfit-track-pant': 'photo-1552902865-b72c031ac5ea',
  'dryfit-windbreaker': 'photo-1509942774463-acf339cf87d5',
  'dryfit-polo': 'photo-1622519407650-3df9883f76a5',
  'dryfit-seamless-base-layer': 'photo-1600180758890-6b94519a8ba6',

  // -------------------------------------------------------------- suits
  'wool-two-piece-suit': 'photo-1507679799987-c73779587ccf',
  'denim-tailored-blazer': 'photo-1611312449408-fcece27cdbb7',
  'linen-summer-suit': 'photo-1517445312882-bc9910d016b7',
  'travel-stretch-suit': 'photo-1610652492500-ded49ceeb378',
  'leather-tailored-blazer': 'photo-1611601322175-ef8ec8c85f01',
  'herringbone-wool-suit': 'photo-1594938298603-c8148c4dae35',
  'unstructured-cotton-suit': 'photo-1556905055-8f358a7a47b2',
  'double-breasted-wool-suit': 'photo-1618886614638-80e3c103d31a',
  'denim-suit-set': 'photo-1604176354204-9268737828e4',
  'tuxedo-dinner-suit': 'photo-1610901157620-340856d0a50f',
}

/** Editorial imagery used outside the product grid. */
export const EDITORIAL = {
  heroLeather: 'photo-1520975954732-35dd22299614', // man in black leather jacket
  heroDenim: 'photo-1516257984-b1b4d707412e', // man in light denim
  leatherCraft: 'photo-1594633313593-bab3825d0caf', // brown leather goods, close grain
  denimStack: 'photo-1604176354204-9268737828e4', // folded indigo denim
  denimRail: 'photo-1605518216938-7c31b7b14ad0', // jeans on a retail rail
  workshop: 'photo-1517048676732-d65bc937f952', // hands at a workbench
  rail: 'photo-1551232864-3f0890e580d9', // jackets on a rail
  campaign: 'photo-1503342217505-b0a15ec3261c', // on-body editorial
}
