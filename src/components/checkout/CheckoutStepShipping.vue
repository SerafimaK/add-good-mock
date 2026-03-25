<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../../stores/auth.js'
import FormInput from '../auth/FormInput.vue'
import AddressSelector from './AddressSelector.vue'

const { openAuthModal } = useAuth()

const props = defineProps({
  addresses: { type: Array, default: () => [] },
  isLoggedIn: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const selectedAddrId = ref('')
const useNewAddr = ref(!props.isLoggedIn || !props.addresses.length)
const wantsAccount = ref(false)

const form = ref({
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  email: '',
  phone: '',
  password: '',
})

const formError = ref('')

// When user logs in mid-flow, switch to saved addresses
watch(() => props.isLoggedIn, (val) => {
  if (val && props.addresses.length) {
    useNewAddr.value = false
    wantsAccount.value = false
    const def = props.addresses.find(a => a.isDefault) || props.addresses[0]
    if (def) selectedAddrId.value = def.id
  }
})

function handleSelectAddress(id) {
  selectedAddrId.value = id
  useNewAddr.value = false
}

function handleUseNew() {
  selectedAddrId.value = ''
  useNewAddr.value = true
}

function handleSubmit() {
  if (!useNewAddr.value && selectedAddrId.value) {
    const addr = props.addresses.find(a => a.id === selectedAddrId.value)
    emit('submit', { address: addr, contact: null, accountFields: null })
    return
  }

  if (!form.value.fullName || !form.value.line1 || !form.value.city || !form.value.state || !form.value.zip) {
    formError.value = 'Please fill in all required fields'
    return
  }

  if (!props.isLoggedIn && !form.value.email && !form.value.phone) {
    formError.value = 'Please provide an email or phone number'
    return
  }

  if (wantsAccount.value && !form.value.password) {
    formError.value = 'Please set a password to create your account'
    return
  }
  if (wantsAccount.value && form.value.password.length < 6) {
    formError.value = 'Password must be at least 6 characters'
    return
  }

  formError.value = ''
  const address = {
    fullName: form.value.fullName,
    line1: form.value.line1,
    line2: form.value.line2,
    city: form.value.city,
    state: form.value.state,
    zip: form.value.zip,
    country: form.value.country,
  }
  const contact = !props.isLoggedIn
    ? { email: form.value.email, phone: form.value.phone }
    : null
  const emailOrPhone = form.value.email || form.value.phone
  const accountFields = wantsAccount.value
    ? { emailOrPhone, password: form.value.password, name: form.value.fullName }
    : null

  emit('submit', { address, contact, accountFields })
}
</script>

<template>
  <div class="css">
    <h2 class="css-title">Shipping Address</h2>

    <!-- Login banner for guests -->
    <div v-if="!isLoggedIn" class="css-login-banner" @click="openAuthModal('login')">
      <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
      <span>Have an account? <strong>Log in</strong> to auto-fill your address</span>
    </div>

    <!-- Saved address selector -->
    <AddressSelector
      v-if="isLoggedIn && addresses.length && !useNewAddr"
      :addresses="addresses"
      :modelValue="selectedAddrId"
      @update:modelValue="handleSelectAddress"
      @useNew="handleUseNew"
    />

    <!-- New address form -->
    <div v-if="useNewAddr" class="css-form">
      <button v-if="isLoggedIn && addresses.length" class="css-back" @click="useNewAddr = false">
        &larr; Back to saved addresses
      </button>
      <FormInput v-model="form.fullName" label="Full name" />
      <FormInput v-model="form.line1" label="Address line 1" />
      <FormInput v-model="form.line2" label="Address line 2 (optional)" />
      <div class="css-row">
        <FormInput v-model="form.city" label="City" />
        <FormInput v-model="form.state" label="State" />
      </div>
      <div class="css-row">
        <FormInput v-model="form.zip" label="ZIP code" />
        <FormInput v-model="form.country" label="Country" />
      </div>
    </div>

    <!-- Contact information (guests only) -->
    <div v-if="!isLoggedIn" class="css-contact">
      <h3 class="css-subtitle">Contact Information</h3>
      <p class="css-contact-hint">For order confirmation and delivery updates</p>
      <FormInput v-model="form.email" label="Email" type="email" placeholder="jane@example.com" />
      <FormInput v-model="form.phone" label="Phone (optional)" type="tel" placeholder="+1234567890" />
    </div>

    <!-- Account creation toggle (guests only) -->
    <div v-if="!isLoggedIn" class="css-account">
      <label class="css-account-toggle">
        <input type="checkbox" v-model="wantsAccount" />
        <span>Create an account with this order</span>
      </label>
      <div v-if="wantsAccount" class="css-account-fields">
        <div class="css-account-note">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span>Your account will be created with the contact info above — just set a password</span>
        </div>
        <FormInput v-model="form.password" label="Password" type="password" placeholder="At least 6 characters" />
      </div>
    </div>

    <div v-if="formError" class="css-error">{{ formError }}</div>

    <button class="css-btn" @click="handleSubmit">Continue to review</button>
  </div>
</template>

<style scoped>
.css-title {
  font-family: var(--serif); font-size: 1.5rem; font-weight: 400;
  margin-bottom: 1.5rem;
}
.css-login-banner {
  display: flex; gap: .6rem; align-items: center;
  padding: .8rem 1rem;
  background: rgba(27,133,74,.05);
  border: 1px solid rgba(27,133,74,.15);
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: .84rem; color: var(--mid);
  cursor: pointer;
  transition: all .2s;
}
.css-login-banner:hover {
  border-color: var(--forest);
  background: rgba(27,133,74,.08);
}
.css-login-banner svg {
  width: 18px; height: 18px; flex-shrink: 0;
  fill: none; stroke: var(--forest);
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
}
.css-login-banner strong { color: var(--forest); }
.css-form { margin-top: .5rem; }
.css-back {
  background: none; border: none; font-family: var(--sans);
  font-size: .8rem; color: var(--forest); cursor: pointer;
  margin-bottom: 1rem; display: block;
}
.css-back:hover { color: var(--dark); }
.css-row { display: flex; gap: 1rem; }
.css-row > * { flex: 1; }
.css-contact {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,.06);
}
.css-subtitle {
  font-family: var(--serif); font-size: 1.1rem; font-weight: 400;
  margin-bottom: .3rem;
}
.css-contact-hint {
  font-size: .8rem; color: var(--mid);
  margin-bottom: 1rem;
}
.css-account {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,.06);
}
.css-account-toggle {
  display: flex; gap: .5rem; align-items: center;
  font-size: .85rem; color: var(--dark);
  cursor: pointer; user-select: none;
}
.css-account-toggle input[type="checkbox"] {
  width: 16px; height: 16px;
  accent-color: var(--forest);
  cursor: pointer;
}
.css-account-fields {
  margin-top: 1rem;
}
.css-account-note {
  display: flex; gap: .6rem; align-items: flex-start;
  padding: .8rem 1rem;
  background: rgba(27,133,74,.05);
  border-radius: 10px;
  margin-bottom: 1.2rem;
  font-size: .82rem; color: var(--mid);
}
.css-account-note svg {
  width: 18px; height: 18px; flex-shrink: 0;
  fill: none; stroke: var(--forest);
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
  margin-top: 1px;
}
.css-error {
  font-size: .8rem; color: #c44; text-align: center;
  margin-bottom: .8rem; padding: .5rem;
  background: rgba(204,68,68,.06); border-radius: 8px;
}
.css-btn {
  display: block; width: 100%;
  padding: .85rem; border: none; border-radius: 50px;
  background: var(--dark); color: var(--bg);
  font-family: var(--sans); font-size: .85rem; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  cursor: pointer; transition: all .3s;
  margin-top: .5rem;
}
.css-btn:hover { background: var(--forest); }

@media (max-width: 700px) {
  .css-row { flex-direction: column; gap: 0; }
}
</style>
