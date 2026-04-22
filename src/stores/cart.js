import { reactive, computed } from 'vue'

export const BASE_PRICE = 11.90
export const BONUS_PRICE = 1.00
export const FREE_SHIPPING_QTY = 3

export const PRODUCTS = {
  glow: { id: 'glow', name: 'Glow', sub: 'Rice Ferment + Niacinamide', cls: 'glow', icon: '🌾' },
  plump: { id: 'plump', name: 'Plump', sub: 'Snow Mushroom + HA', cls: 'plump', icon: '🍄' },
  firm: { id: 'firm', name: 'Firm', sub: 'Sea Kelp + Peptides', cls: 'firm', icon: '🌊' },
}

const BONUS_NAMES = {
  centella: 'Centella',
  ghk_cu: 'GHK-Cu',
  licorice: 'Licorice',
  beta_glucan: 'Beta-Glucan',
  pga: 'PGA',
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

  const freeShipping = computed(() => state.items.length >= FREE_SHIPPING_QTY)

  function add(boosterId, bonuses = []) {
    const price = BASE_PRICE + (bonuses.length * BONUS_PRICE)

    const bonusNames = bonuses.map(b => BONUS_NAMES[b] || b)
    let sub = PRODUCTS[boosterId].sub
    if (bonusNames.length) sub += ' + ' + bonusNames.join(', ')

    state.items.push({
      uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      boosterId,
      bonuses: [...bonuses],
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

  return { state, count, total, freeShipping, add, remove, toggle, showToast, clearCart, PRODUCTS }
}
