<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../stores/auth.js'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const { state: authState, isAuthenticated } = useAuth()

const email = ref('')
const agreed = ref(false)
const submitted = ref(false)
const error = ref('')

const hasOrders = computed(() => {
  return isAuthenticated.value && authState.user?.orders?.length > 0
})

const alreadyClaimed = ref(false)

function checkClaimed() {
  try {
    const claimed = JSON.parse(localStorage.getItem('promo_claimed') || '[]')
    return claimed.includes(email.value.toLowerCase())
  } catch { return false }
}

function markClaimed() {
  try {
    const claimed = JSON.parse(localStorage.getItem('promo_claimed') || '[]')
    claimed.push(email.value.toLowerCase())
    localStorage.setItem('promo_claimed', JSON.stringify(claimed))
  } catch {}
}

function submit() {
  error.value = ''
  alreadyClaimed.value = false

  if (!email.value || !email.value.includes('@')) {
    error.value = 'Please enter a valid email address.'
    return
  }
  if (!agreed.value) {
    error.value = 'Please agree to receive our newsletter.'
    return
  }

  if (hasOrders.value) {
    alreadyClaimed.value = true
    return
  }

  if (checkClaimed()) {
    alreadyClaimed.value = true
    return
  }

  markClaimed()
  submitted.value = true
}

function reset() {
  email.value = ''
  agreed.value = false
  submitted.value = false
  error.value = ''
  alreadyClaimed.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="promo">
      <div v-if="open" class="promo-overlay" @click.self="reset">
        <div class="promo-popup">
          <button class="promo-close" @click="reset">&times;</button>

          <template v-if="alreadyClaimed">
            <div class="promo-icon">🎁</div>
            <h3 class="promo-title">This offer is for new customers</h3>
            <p class="promo-text">The 15% discount applies to first purchases only. But we have more surprises coming — stay tuned!</p>
            <button class="promo-btn" @click="reset">Got it</button>
          </template>

          <template v-else-if="submitted">
            <div class="promo-icon">✉️</div>
            <h3 class="promo-title">Check your inbox!</h3>
            <p class="promo-text">We've sent a 15% promo code to <strong>{{ email }}</strong>. Use it at checkout on your first order.</p>
            <button class="promo-btn" @click="reset">Close</button>
          </template>

          <template v-else>
            <h3 class="promo-title">Get 15% off your first order</h3>
            <p class="promo-text">Enter your email and we'll send you a promo code.</p>

            <div class="promo-field">
              <input
                v-model="email"
                type="email"
                class="promo-input"
                placeholder="your@email.com"
                @keyup.enter="submit"
              >
            </div>

            <label class="promo-check">
              <input type="checkbox" v-model="agreed">
              <span>I'd like to receive updates and offers from Add Good</span>
            </label>

            <p v-if="error" class="promo-error">{{ error }}</p>

            <button class="promo-btn" @click="submit">Send my code</button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.promo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.promo-popup {
  background: var(--bg);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  text-align: center;
}

.promo-close {
  position: absolute;
  top: .8rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--lt);
  cursor: pointer;
  line-height: 1;
  transition: color .2s;
}

.promo-close:hover { color: var(--dark); }

.promo-icon {
  font-size: 2.2rem;
  margin-bottom: .8rem;
}

.promo-title {
  font-family: var(--serif);
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--dark);
  margin-bottom: .6rem;
}

.promo-text {
  font-size: .88rem;
  color: var(--mid);
  line-height: 1.55;
  margin-bottom: 1.3rem;
}

.promo-text strong {
  color: var(--dark);
}

.promo-field {
  margin-bottom: 1rem;
}

.promo-input {
  width: 100%;
  font-family: var(--sans);
  font-size: .9rem;
  padding: .75rem 1rem;
  border: 1.5px solid var(--sand, rgba(0,0,0,0.1));
  border-radius: 50px;
  background: var(--bg);
  color: var(--dark);
  outline: none;
  transition: border-color .25s ease, box-shadow .25s ease;
  text-align: center;
}

.promo-input::placeholder { color: var(--lt); }

.promo-input:focus {
  border-color: var(--forest);
  box-shadow: 0 0 0 3px rgba(62,95,55,0.08);
}

.promo-check {
  display: flex;
  align-items: flex-start;
  gap: .5rem;
  font-size: .78rem;
  color: var(--mid);
  text-align: left;
  margin-bottom: 1.2rem;
  cursor: pointer;
  line-height: 1.4;
}

.promo-check input[type="checkbox"] {
  margin-top: .15rem;
  flex-shrink: 0;
  accent-color: var(--forest);
}

.promo-error {
  font-size: .78rem;
  color: #c44;
  margin-bottom: .8rem;
}

.promo-btn {
  display: inline-block;
  padding: .75rem 2rem;
  border: none;
  border-radius: 50px;
  background: var(--dark);
  color: var(--bg);
  font-family: var(--sans);
  font-size: .82rem;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .3s;
}

.promo-btn:hover {
  background: var(--forest);
  transform: translateY(-1px);
}

/* Transition */
.promo-enter-active { transition: opacity .3s ease; }
.promo-leave-active { transition: opacity .2s ease; }
.promo-enter-from, .promo-leave-to { opacity: 0; }

.promo-enter-active .promo-popup {
  animation: popIn .35s var(--ease-out);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
