import { reactive, computed } from 'vue'

export const PRODUCTS = {
  glow: { id: 'glow', name: 'Glow', sub: 'Rice Ferment + Niacinamide', price: 11.90, cls: 'glow', icon: '🌾' },
  plump: { id: 'plump', name: 'Plump', sub: 'Snow Mushroom + HA', price: 11.90, cls: 'plump', icon: '🍄' },
  firm: { id: 'firm', name: 'Firm', sub: 'Sea Kelp + Peptides', price: 11.90, cls: 'firm', icon: '🌊' },
  trio: { id: 'trio', name: 'The Trio', sub: 'Glow + Plump + Firm', price: 29.90, cls: 'glow', icon: '✨' },
}

const state = reactive({
  items: [],
  isOpen: false,
  toast: { message: '', visible: false },
})

let toastTimer = null

export function useCart() {
  const count = computed(() => state.items.length)
  const total = computed(() => state.items.reduce((s, id) => s + PRODUCTS[id].price, 0))

  function add(id) {
    state.items.push(id)
    showToast(`${PRODUCTS[id].name} added to bag`)
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

  return { state, count, total, add, remove, toggle, showToast, PRODUCTS }
}
