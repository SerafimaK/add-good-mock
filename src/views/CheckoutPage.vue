<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../stores/cart.js'
import { useAuth } from '../stores/auth.js'
import CheckoutStepShipping from '../components/checkout/CheckoutStepShipping.vue'
import CheckoutStepReview from '../components/checkout/CheckoutStepReview.vue'
import OrderSummary from '../components/checkout/OrderSummary.vue'

const router = useRouter()
const { state: cartState, total, clearCart } = useCart()
const { state: authState, isAuthenticated, register, addOrder, addAddress } = useAuth()

const step = ref(1)
const shippingAddress = ref(null)
const contactInfo = ref(null)
const accountFields = ref(null)
const placing = ref(false)

// Redirect if cart is empty
if (cartState.items.length === 0) {
  router.replace('/')
}

const stepLabels = ['Shipping', 'Review']
const currentStepIndex = computed(() => step.value - 1)

function handleShippingSubmit({ address, contact, accountFields: accFields }) {
  shippingAddress.value = address
  contactInfo.value = contact
  accountFields.value = accFields
  step.value = 2
}

async function handlePlaceOrder() {
  placing.value = true

  // Create account if user opted in
  if (accountFields.value) {
    const ok = await register(
      accountFields.value.name,
      accountFields.value.emailOrPhone,
      accountFields.value.password,
    )
    if (!ok) { placing.value = false; return }
    // Save address to new account
    addAddress({
      label: 'Home',
      fullName: shippingAddress.value.fullName,
      line1: shippingAddress.value.line1,
      line2: shippingAddress.value.line2,
      city: shippingAddress.value.city,
      state: shippingAddress.value.state,
      zip: shippingAddress.value.zip,
      country: shippingAddress.value.country,
      isDefault: true,
    })
  }

  const order = addOrder({
    items: cartState.items.map(item => ({
      boosterId: item.boosterId,
      bonuses: item.bonuses,
      redGold: item.redGold,
      price: item.price,
      sub: item.sub,
    })),
    total: total.value,
    shippingAddress: { ...shippingAddress.value },
    ...(contactInfo.value && { contact: contactInfo.value }),
  })

  clearCart()
  placing.value = false
  router.push({ name: 'order-confirmation', params: { orderId: order.id } })
}
</script>

<template>
  <div class="co">
    <div class="co-inner">
      <router-link to="/" class="co-back">&larr; Back to shop</router-link>
      <h1 class="co-title">Checkout</h1>

      <!-- Step indicator -->
      <div class="co-steps">
        <div
          v-for="(label, i) in stepLabels" :key="i"
          class="co-step"
          :class="{ active: i === currentStepIndex, done: i < currentStepIndex }"
        >
          <div class="co-step-num">{{ i < currentStepIndex ? '&#10003;' : i + 1 }}</div>
          <span>{{ label }}</span>
        </div>
      </div>

      <div class="co-body">
        <div class="co-main">
          <!-- Step 1: Shipping -->
          <CheckoutStepShipping
            v-if="step === 1"
            :addresses="authState.user?.addresses || []"
            :isLoggedIn="isAuthenticated"
            @submit="handleShippingSubmit"
          />

          <!-- Step 2: Review -->
          <CheckoutStepReview
            v-if="step === 2"
            :items="cartState.items"
            :total="total"
            :address="shippingAddress"
            :loading="placing"
            @placeOrder="handlePlaceOrder"
            @back="step = 1"
          />
        </div>

        <!-- Sidebar order summary -->
        <div class="co-sidebar">
          <OrderSummary :items="cartState.items" :total="total" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.co {
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  background: var(--bg);
}
.co-inner { max-width: 900px; margin: 0 auto; }
.co-back {
  display: inline-block;
  font-size: .8rem; color: var(--forest);
  text-decoration: none; margin-bottom: 1rem;
  transition: color .2s;
}
.co-back:hover { color: var(--dark); }
.co-title {
  font-family: var(--serif); font-size: 2.2rem; font-weight: 400;
  color: var(--dark); margin-bottom: 1.5rem;
}

/* Steps indicator */
.co-steps {
  display: flex; gap: .5rem; margin-bottom: 2rem;
}
.co-step {
  display: flex; align-items: center; gap: .4rem;
  font-size: .75rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: .06em; color: var(--lt);
  padding: .4rem .8rem; border-radius: 50px;
  border: 1px solid var(--sand);
  transition: all .2s;
}
.co-step.active { color: var(--dark); border-color: var(--dark); }
.co-step.done { color: var(--forest); border-color: var(--forest); background: rgba(27,133,74,.05); }
.co-step-num {
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; font-weight: 700;
}

/* Layout */
.co-body { display: flex; gap: 2rem; align-items: flex-start; }
.co-main { flex: 1; min-width: 0; }
.co-sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 5rem; }

@media (max-width: 700px) {
  .co { padding: 5rem 1rem 3rem; }
  .co-title { font-size: 1.7rem; }
  .co-body { flex-direction: column-reverse; }
  .co-sidebar { width: 100%; position: static; }
}
</style>
