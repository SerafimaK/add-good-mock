<script setup>
import { useCart, PRODUCTS } from '../stores/cart.js'

const { state, total, remove, toggle } = useCart()
</script>

<template>
  <Teleport to="body">
    <div class="cart-overlay" :class="{ open: state.isOpen }" @click="toggle"></div>
    <div class="cart-drawer" :class="{ open: state.isOpen }">
      <div class="cart-header">
        <h3>Your Bag</h3>
        <button class="cart-close" @click="toggle">&times;</button>
      </div>
      <div class="cart-items">
        <div v-if="state.items.length === 0" class="cart-empty">Your bag is empty</div>
        <div v-for="(item, i) in state.items" :key="item.uid" class="ci">
          <div class="ci-color" :class="'ci-' + PRODUCTS[item.boosterId].cls"></div>
          <div class="ci-info">
            <div class="ci-name">{{ PRODUCTS[item.boosterId].name }}</div>
            <div class="ci-sub">{{ item.sub }}</div>
          </div>
          <div class="ci-right">
            <div class="ci-price">${{ item.price.toFixed(2) }}</div>
            <button class="ci-remove" @click="remove(i)">Remove</button>
          </div>
        </div>
      </div>
      <div v-if="state.items.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>Total</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <button class="checkout-btn">Checkout</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cart-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 300;
  opacity: 0; pointer-events: none; transition: opacity .3s;
}
.cart-overlay.open { opacity: 1; pointer-events: all; }
.cart-drawer {
  position: fixed; top: 0; right: 0; width: 380px; max-width: 90vw; height: 100vh;
  background: var(--bg2); z-index: 301; transform: translateX(100%);
  transition: transform .4s var(--ease-out);
  display: flex; flex-direction: column; box-shadow: -10px 0 40px rgba(0,0,0,.1);
}
.cart-drawer.open { transform: translateX(0); }
.cart-header {
  padding: 1.5rem 2rem; border-bottom: 1px solid rgba(0,0,0,.06);
  display: flex; justify-content: space-between; align-items: center;
}
.cart-header h3 { font-family: var(--serif); font-size: 1.3rem; font-weight: 400; }
.cart-close {
  background: none; border: none; font-size: 1.5rem; cursor: pointer;
  color: var(--mid); transition: color .2s; line-height: 1;
}
.cart-close:hover { color: var(--dark); }
.cart-items { flex: 1; overflow-y: auto; padding: 1.5rem 2rem; }
.cart-empty { text-align: center; padding: 3rem 0; color: var(--lt); font-size: .95rem; }
.ci {
  display: flex; gap: 1rem; padding: 1rem 0;
  border-bottom: 1px solid rgba(0,0,0,.04); align-items: center;
}
.ci-color { width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0; }
.ci-glow  { background: linear-gradient(135deg, #F5E2A0, #D4930F); }
.ci-plump { background: linear-gradient(135deg, #7DDBA0, #1B854A); }
.ci-firm  { background: linear-gradient(135deg, #72C2E0, #1A78A5); }
.ci-info { flex: 1; }
.ci-name { font-weight: 600; font-size: .9rem; margin-bottom: .15rem; }
.ci-sub { font-size: .72rem; color: var(--mid); }
.ci-right { text-align: right; }
.ci-price { font-family: var(--serif); font-style: italic; font-size: 1rem; margin-bottom: .3rem; }
.ci-remove {
  background: none; border: none; font-size: .68rem; color: var(--lt); cursor: pointer;
  text-transform: uppercase; letter-spacing: .08em; transition: color .2s;
  font-family: var(--sans);
}
.ci-remove:hover { color: #c44; }
.cart-footer { padding: 1.5rem 2rem; border-top: 1px solid rgba(0,0,0,.06); }
.cart-total {
  display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 600;
}
.cart-total span:last-child { font-family: var(--serif); font-style: italic; font-size: 1.2rem; }
.checkout-btn {
  display: block; width: 100%; padding: .9rem; border: none; border-radius: 50px;
  background: var(--dark); color: var(--bg); font-family: var(--sans); font-size: .85rem;
  font-weight: 600; letter-spacing: .05em; text-transform: uppercase; cursor: pointer;
  transition: all .3s;
}
.checkout-btn:hover { background: var(--forest); }
</style>
