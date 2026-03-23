<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../stores/auth.js'
import { PRODUCTS } from '../stores/cart.js'
import OrderSummary from '../components/checkout/OrderSummary.vue'

const route = useRoute()
const { state } = useAuth()

const order = computed(() => {
  if (!state.user) return null
  return state.user.orders.find(o => o.id === route.params.orderId)
})

function itemName(item) {
  return PRODUCTS[item.boosterId]?.name || item.boosterId
}

function estimatedDelivery() {
  const d = new Date()
  d.setDate(d.getDate() + 5)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="oc">
    <div class="oc-inner">
      <div class="oc-check">
        <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h1 class="oc-title">Order confirmed!</h1>
      <p class="oc-subtitle" v-if="order">
        Order <b>#{{ order.id }}</b> has been placed successfully.
      </p>
      <p class="oc-subtitle" v-else>
        Your order has been placed successfully.
      </p>

      <div class="oc-delivery">
        <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        <span>Estimated delivery: <b>{{ estimatedDelivery() }}</b></span>
      </div>

      <template v-if="order">
        <OrderSummary :items="order.items" :total="order.total" />

        <div class="oc-addr" v-if="order.shippingAddress">
          <h3 class="oc-addr-title">Shipping to</h3>
          <div class="oc-addr-body">
            {{ order.shippingAddress.fullName }},
            {{ order.shippingAddress.line1 }},
            {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zip }}
          </div>
        </div>
      </template>

      <router-link to="/" class="oc-btn">Continue Shopping</router-link>
    </div>
  </div>
</template>

<style scoped>
.oc {
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  background: var(--bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.oc-inner {
  max-width: 520px;
  width: 100%;
  text-align: center;
}
.oc-check {
  width: 64px; height: 64px;
  background: rgba(27,133,74,.1);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
}
.oc-check svg {
  width: 32px; height: 32px;
  fill: none; stroke: var(--forest);
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}
.oc-title {
  font-family: var(--serif); font-size: 2rem; font-weight: 400;
  color: var(--dark); margin-bottom: .5rem;
}
.oc-subtitle {
  font-size: .95rem; color: var(--mid); margin-bottom: 1.5rem;
}
.oc-subtitle b { color: var(--dark); }
.oc-delivery {
  display: flex; align-items: center; justify-content: center;
  gap: .6rem;
  padding: .8rem 1.2rem;
  background: rgba(27,133,74,.05);
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: .85rem; color: var(--mid);
}
.oc-delivery svg {
  width: 20px; height: 20px; flex-shrink: 0;
  fill: none; stroke: var(--forest);
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
}
.oc-delivery b { color: var(--dark); }
.oc-addr {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  background: var(--bg2);
  border: 1px solid rgba(0,0,0,.05);
  border-radius: 12px;
  text-align: left;
}
.oc-addr-title {
  font-size: .7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--lt); margin-bottom: .3rem;
}
.oc-addr-body { font-size: .85rem; color: var(--mid); }
.oc-btn {
  display: inline-block;
  margin-top: 2rem;
  padding: .85rem 2.5rem;
  border-radius: 50px;
  background: var(--dark); color: var(--bg);
  font-family: var(--sans); font-size: .85rem; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  text-decoration: none;
  transition: all .3s;
}
.oc-btn:hover { background: var(--forest); }

@media (max-width: 700px) {
  .oc { padding: 5rem 1rem 3rem; }
  .oc-title { font-size: 1.6rem; }
}
</style>
