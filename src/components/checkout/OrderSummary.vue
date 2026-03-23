<script setup>
import { PRODUCTS } from '../../stores/cart.js'

defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
})

function itemName(item) {
  return PRODUCTS[item.boosterId]?.name || item.boosterId
}
</script>

<template>
  <div class="os">
    <h3 class="os-title">Order Summary</h3>
    <div v-for="(item, i) in items" :key="i" class="os-item">
      <div class="os-color" :class="'os-' + (PRODUCTS[item.boosterId]?.cls || 'glow')"></div>
      <div class="os-info">
        <div class="os-name">{{ itemName(item) }}</div>
        <div class="os-sub">{{ item.sub }}</div>
      </div>
      <div class="os-price">${{ item.price.toFixed(2) }}</div>
    </div>
    <div class="os-total">
      <span>Total</span>
      <span>${{ total.toFixed(2) }}</span>
    </div>
  </div>
</template>

<style scoped>
.os {
  background: var(--bg2);
  border: 1px solid rgba(0,0,0,.05);
  border-radius: 16px;
  padding: 1.5rem;
}
.os-title {
  font-family: var(--serif); font-size: 1.1rem; font-weight: 400;
  margin-bottom: 1rem;
}
.os-item {
  display: flex; gap: .8rem; align-items: center;
  padding: .6rem 0;
  border-bottom: 1px solid rgba(0,0,0,.04);
}
.os-color { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; }
.os-glow  { background: linear-gradient(135deg, #F5E2A0, #D4930F); }
.os-plump { background: linear-gradient(135deg, #7DDBA0, #1B854A); }
.os-firm  { background: linear-gradient(135deg, #72C2E0, #1A78A5); }
.os-info { flex: 1; }
.os-name { font-weight: 600; font-size: .88rem; }
.os-sub { font-size: .72rem; color: var(--mid); }
.os-price { font-family: var(--serif); font-style: italic; font-size: .95rem; }
.os-total {
  display: flex; justify-content: space-between;
  padding-top: .8rem; margin-top: .4rem;
  font-weight: 700; font-size: 1rem;
}
.os-total span:last-child { font-family: var(--serif); font-style: italic; font-size: 1.15rem; }
</style>
