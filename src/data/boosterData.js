// Product catalog:
// - Content (name, tagline, benefit, story, effects, compatibleBonuses, basePrice, nickname, price)
//   is fetched from the API and merged into BOOSTERS / BONUSES at app startup (see loadProducts).
// - Visual/design tokens (colors, element labels, images, positions) live here as static maps
//   keyed by product id. They are merged onto the API response at load time.

import { getBoosters, getBonuses } from '../api/products.js'

export const BOOSTER_ORDER = ['glow', 'plump', 'firm']

// UI-only metadata for boosters — colors, element labels, artwork
const BOOSTER_UI = {
  glow: {
    num: '01',
    element: 'Field',
    color: '#C89B3C',
    toneRgb: '221, 186, 124',
    toneInk: '#6d4f1c',
    btnText: '#614617',
    heroImage: '/lines_no_background/rice-removebg-preview.png',
    icon: '/icon_rice.png',
  },
  plump: {
    num: '02',
    element: 'Forest',
    color: '#4A7C59',
    toneRgb: '149, 193, 143',
    toneInk: '#245833',
    btnText: '#1d5030',
    heroImage: '/lines_no_background/mushroom-removebg-preview.png',
    icon: '/icon_mushroom.png',
  },
  firm: {
    num: '03',
    element: 'Sea',
    color: '#1E3A5F',
    toneRgb: '132, 182, 207',
    toneInk: '#225571',
    btnText: '#1c4d67',
    heroImage: '/lines_no_background/sea_kelp-removebg-preview.png',
    icon: '/icon_seaweed.png',
  },
}

// UI-only metadata for bonus ingredients — artwork
const BONUS_UI = {
  centella:    { image: '/lines_no_background/centella-removebg-preview.png' },
  ghk_cu:      { image: '/molecule-1.png' },
  licorice:    { image: '/lines_no_background/licorice-removebg-preview.png' },
  beta_glucan: { image: '/molecule-2.png' },
  pga:         { image: '/molecule-3.png' },
}

// Populated by loadProducts() before app mount.
// Same references are shared with all components that import them.
export const BOOSTERS = {}
export const BONUSES = {}

// Position map for bonus ingredient drawings around the flask
export const BONUS_POSITIONS = {
  centella:    { top: '5%',  left: '2%',  width: '42%' },
  ghk_cu:      { top: '8%',  right: '0%', width: '38%' },
  licorice:    { bottom: '11%', left: '-2%', width: '40%' },
  beta_glucan: { bottom: '15%', right: '-2%', width: '38%' },
  pga:         { top: '45%', right: '-2%', width: '38%' },
}

// Temporary: Red Gold was removed from the product but some components still
// reference it. Keeping a stub until FlaskComposition/cart/FAQ are cleaned up.
export const RED_GOLD = {
  id: 'red_gold',
  name: 'Red Gold',
  ingredient: 'Astaxanthin',
  image: '/lines_no_background/red_splash-removebg-preview.png',
}

export async function loadProducts() {
  const [boosters, bonuses] = await Promise.all([getBoosters(), getBonuses()])

  for (const b of boosters) {
    BOOSTERS[b.id] = { ...b, ...(BOOSTER_UI[b.id] || {}) }
  }
  for (const b of bonuses) {
    BONUSES[b.id] = { ...b, ...(BONUS_UI[b.id] || {}) }
  }
}
