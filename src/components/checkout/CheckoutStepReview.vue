<script setup>
import OrderSummary from './OrderSummary.vue'

defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  address: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['placeOrder', 'back'])
</script>

<template>
  <div class="csr">
    <h2 class="csr-title">Review your order</h2>

    <OrderSummary :items="items" :total="total" />

    <div class="csr-addr">
      <h3 class="csr-addr-title">Shipping to</h3>
      <div class="csr-addr-body">
        <div>{{ address.fullName }}</div>
        <div>{{ address.line1 }}</div>
        <div v-if="address.line2">{{ address.line2 }}</div>
        <div>{{ address.city }}, {{ address.state }} {{ address.zip }}</div>
        <div>{{ address.country }}</div>
      </div>
    </div>

    <div v-if="error" class="csr-error">{{ error }}</div>

    <div class="csr-actions">
      <button class="csr-back" @click="emit('back')">Back</button>
      <button class="csr-place" :disabled="loading" @click="emit('placeOrder')">
        {{ loading ? 'Placing order...' : 'Place Order' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.csr-title {
  font-family: var(--serif); font-size: 1.5rem; font-weight: 400;
  margin-bottom: 1.5rem;
}
.csr-addr {
  margin-top: 1.2rem;
  padding: 1.2rem 1.5rem;
  background: var(--bg2);
  border: 1px solid rgba(0,0,0,.05);
  border-radius: 14px;
}
.csr-addr-title {
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--lt); margin-bottom: .5rem;
}
.csr-addr-body { font-size: .88rem; color: var(--mid); line-height: 1.5; }
.csr-actions {
  display: flex; gap: 1rem; margin-top: 1.5rem;
}
.csr-back {
  flex: 0 0 auto;
  padding: .85rem 1.8rem; border: 1.5px solid var(--sand); border-radius: 50px;
  background: transparent; font-family: var(--sans); font-size: .85rem;
  font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
  color: var(--dark); cursor: pointer; transition: all .2s;
}
.csr-back:hover { border-color: var(--dark); }
.csr-place {
  flex: 1;
  padding: .85rem; border: none; border-radius: 50px;
  background: var(--dark); color: var(--bg);
  font-family: var(--sans); font-size: .85rem; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  cursor: pointer; transition: all .3s;
}
.csr-place:hover { background: var(--forest); }
.csr-place:disabled { opacity: .6; cursor: not-allowed; }
.csr-error {
  margin-top: 1rem;
  padding: .55rem .8rem;
  font-size: .82rem;
  color: #c44;
  background: rgba(204,68,68,.06);
  border-radius: 8px;
}
</style>
