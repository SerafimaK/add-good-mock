import { reactive, computed } from 'vue'

export const BASE_PRICE = 11.90
export const RED_GOLD_PRICE = 1.00
export const TRIO_PRICE = 29.90

export const PRODUCTS = {
  glow: { id: 'glow', name: 'Glow', sub: 'Rice Ferment + Niacinamide', cls: 'glow', icon: '🌾' },
  plump: { id: 'plump', name: 'Plump', sub: 'Snow Mushroom + HA', cls: 'plump', icon: '🍄' },
  firm: { id: 'firm', name: 'Firm', sub: 'Sea Kelp + Peptides', cls: 'firm', icon: '🌊' },
  trio: { id: 'trio', name: 'The Trio', sub: 'Glow + Plump + Firm', cls: 'glow', icon: '✨' },
}

const BONUS_NAMES = {
  centella: 'Centella',
  bakuchiol: 'Bakuchiol',
  licorice: 'Licorice',
  squalane: 'Squalane',
}

const state = reactive({
  items: [],
  isOpen: false,
  toast: { message: '', visible: false },
})

let toastTimer = null

export function useCart() {
  const count = computed(() => state.items.length)
  const total = computed(() => state.items.reduce((s, item) => s + item.price, 0))

  function add(boosterId, bonuses = [], redGold = false) {
    const price = boosterId === 'trio'
      ? TRIO_PRICE
      : BASE_PRICE + (redGold ? RED_GOLD_PRICE : 0)

    const bonusNames = bonuses.map(b => BONUS_NAMES[b] || b)
    let sub = PRODUCTS[boosterId].sub
    if (bonusNames.length) sub += ' + ' + bonusNames.join(', ')
    if (redGold) sub += ' + Red Gold'

    state.items.push({
      uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      boosterId,
      bonuses: [...bonuses],
      redGold,
      price,
      sub,
    })
    showToast(`${PRODUCTS[boosterId].name} added to bag`)
  }

  function remove(index) {
    state.items.splice(index, 1)
  }

  function toggle() {
    state.isOpen = !state.isOpen
  }

  function showToast(message) {
    state.toast.message = message
    state.toast.visible = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { state.toast.visible = false }, 2200)
  }

  function clearCart() {
    state.items.splice(0, state.items.length)
  }

  return { state, count, total, add, remove, toggle, showToast, clearCart, PRODUCTS }
}
