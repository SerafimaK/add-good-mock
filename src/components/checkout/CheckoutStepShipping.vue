<script setup>
import { ref, computed } from 'vue'
import FormInput from '../auth/FormInput.vue'
import AddressSelector from './AddressSelector.vue'

const props = defineProps({
  addresses: { type: Array, default: () => [] },
  showAccountFields: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const selectedAddrId = ref('')
const useNewAddr = ref(!props.isLoggedIn || !props.addresses.length)

const form = ref({
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  // Account creation fields
  emailOrPhone: '',
  password: '',
})

const formError = ref('')

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
    emit('submit', { address: addr, accountFields: null })
    return
  }

  if (!form.value.fullName || !form.value.line1 || !form.value.city || !form.value.state || !form.value.zip) {
    formError.value = 'Please fill in all required fields'
    return
  }

  if (props.showAccountFields && (!form.value.emailOrPhone || !form.value.password)) {
    formError.value = 'Please fill in email/phone and password to create your account'
    return
  }
  if (props.showAccountFields && form.value.password.length < 6) {
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
  const accountFields = props.showAccountFields
    ? { emailOrPhone: form.value.emailOrPhone, password: form.value.password, name: form.value.fullName }
    : null

  emit('submit', { address, accountFields })
}
</script>

<template>
  <div class="css">
    <h2 class="css-title">Shipping Address</h2>

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

    <!-- Account creation fields -->
    <div v-if="showAccountFields" class="css-account">
      <div class="css-account-note">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span>Enter your email/phone and a password to create your account along with the order</span>
      </div>
      <FormInput v-model="form.emailOrPhone" label="Email or phone" placeholder="jane@example.com or +1234567890" />
      <FormInput v-model="form.password" label="Password" type="password" placeholder="At least 6 characters" />
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
.css-form { margin-top: .5rem; }
.css-back {
  background: none; border: none; font-family: var(--sans);
  font-size: .8rem; color: var(--forest); cursor: pointer;
  margin-bottom: 1rem; display: block;
}
.css-back:hover { color: var(--dark); }
.css-row { display: flex; gap: 1rem; }
.css-row > * { flex: 1; }
.css-account {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,.06);
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
