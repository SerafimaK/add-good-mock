<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useRouter } from 'vue-router'
import { PRODUCTS } from '../stores/cart.js'
import FormInput from '../components/auth/FormInput.vue'

const router = useRouter()
const {
  state, logout, updateProfile, addAddress, updateAddress, deleteAddress,
} = useAuth()

const activeTab = ref('profile')
const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'orders', label: 'Orders' },
]

// Profile editing
const editing = ref(false)
const editName = ref('')
const editEmail = ref('')
const editPhone = ref('')

function startEdit() {
  editName.value = state.user?.name || ''
  editEmail.value = state.user?.email || ''
  editPhone.value = state.user?.phone || ''
  editing.value = true
}

function saveProfile() {
  updateProfile({ name: editName.value, email: editEmail.value, phone: editPhone.value })
  editing.value = false
}

function handleLogout() {
  logout()
  router.push('/')
}

// Address editing
const showAddrForm = ref(false)
const editingAddrId = ref(null)
const addrForm = ref({ label: '', fullName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'US', isDefault: false })

function openNewAddress() {
  editingAddrId.value = null
  addrForm.value = { label: '', fullName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'US', isDefault: false }
  showAddrForm.value = true
}

function openEditAddress(addr) {
  editingAddrId.value = addr.id
  addrForm.value = { ...addr }
  showAddrForm.value = true
}

function saveAddress() {
  if (editingAddrId.value) {
    updateAddress(editingAddrId.value, { ...addrForm.value })
  } else {
    addAddress({ ...addrForm.value })
  }
  showAddrForm.value = false
}

function removeAddress(id) {
  deleteAddress(id)
}

// Orders
const statusColors = {
  processing: 'st-processing',
  shipped: 'st-shipped',
  delivered: 'st-delivered',
  cancelled: 'st-cancelled',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function itemName(item) {
  return PRODUCTS[item.boosterId]?.name || item.boosterId
}
</script>

<template>
  <div class="acc">
    <div class="acc-inner">
      <h1 class="acc-title">My Account</h1>

      <!-- Tabs -->
      <div class="acc-tabs">
        <button
          v-for="t in tabs" :key="t.id"
          :class="{ active: activeTab === t.id }"
          @click="activeTab = t.id"
        >{{ t.label }}</button>
      </div>

      <!-- Profile -->
      <div v-if="activeTab === 'profile'" class="acc-section">
        <template v-if="!editing">
          <div class="prof-card">
            <div class="prof-avatar">{{ state.user?.name?.charAt(0)?.toUpperCase() || '?' }}</div>
            <div class="prof-info">
              <div class="prof-row"><span class="prof-label">Name</span><span>{{ state.user?.name || '—' }}</span></div>
              <div class="prof-row"><span class="prof-label">Email</span><span>{{ state.user?.email || '—' }}</span></div>
              <div class="prof-row"><span class="prof-label">Phone</span><span>{{ state.user?.phone || '—' }}</span></div>
            </div>
          </div>
          <div class="prof-actions">
            <button class="btn-secondary" @click="startEdit">Edit profile</button>
            <button class="btn-outline-danger" @click="handleLogout">Log out</button>
          </div>
        </template>
        <template v-else>
          <FormInput v-model="editName" label="Name" />
          <FormInput v-model="editEmail" label="Email" type="email" />
          <FormInput v-model="editPhone" label="Phone" type="tel" />
          <div class="prof-actions">
            <button class="btn-primary" @click="saveProfile">Save</button>
            <button class="btn-secondary" @click="editing = false">Cancel</button>
          </div>
        </template>
      </div>

      <!-- Addresses -->
      <div v-if="activeTab === 'addresses'" class="acc-section">
        <div v-if="!showAddrForm">
          <div v-if="!state.user?.addresses?.length" class="acc-empty">No saved addresses yet</div>
          <div v-for="addr in state.user?.addresses" :key="addr.id" class="addr-card">
            <div class="addr-top">
              <span class="addr-label">{{ addr.label || 'Address' }}</span>
              <span v-if="addr.isDefault" class="addr-default">Default</span>
            </div>
            <div class="addr-body">
              <div>{{ addr.fullName }}</div>
              <div>{{ addr.line1 }}</div>
              <div v-if="addr.line2">{{ addr.line2 }}</div>
              <div>{{ addr.city }}, {{ addr.state }} {{ addr.zip }}</div>
              <div>{{ addr.country }}</div>
            </div>
            <div class="addr-actions">
              <button class="btn-sm" @click="openEditAddress(addr)">Edit</button>
              <button class="btn-sm btn-sm--danger" @click="removeAddress(addr.id)">Delete</button>
            </div>
          </div>
          <button class="btn-secondary" @click="openNewAddress" style="margin-top: 1rem;">+ Add address</button>
        </div>

        <div v-else class="addr-form">
          <h3 class="addr-form-title">{{ editingAddrId ? 'Edit address' : 'New address' }}</h3>
          <FormInput v-model="addrForm.label" label="Label (e.g. Home, Office)" />
          <FormInput v-model="addrForm.fullName" label="Full name" />
          <FormInput v-model="addrForm.line1" label="Address line 1" />
          <FormInput v-model="addrForm.line2" label="Address line 2 (optional)" />
          <div class="addr-row">
            <FormInput v-model="addrForm.city" label="City" />
            <FormInput v-model="addrForm.state" label="State" />
          </div>
          <div class="addr-row">
            <FormInput v-model="addrForm.zip" label="ZIP code" />
            <FormInput v-model="addrForm.country" label="Country" />
          </div>
          <label class="addr-check">
            <input type="checkbox" v-model="addrForm.isDefault" />
            <span>Set as default address</span>
          </label>
          <div class="prof-actions">
            <button class="btn-primary" @click="saveAddress">Save address</button>
            <button class="btn-secondary" @click="showAddrForm = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div v-if="activeTab === 'orders'" class="acc-section">
        <div v-if="!state.user?.orders?.length" class="acc-empty">No orders yet</div>
        <div v-for="order in state.user?.orders" :key="order.id" class="order-card">
          <div class="order-top">
            <div>
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.date) }}</span>
            </div>
            <span class="order-status" :class="statusColors[order.status]">{{ order.status }}</span>
          </div>
          <div class="order-items">
            <div v-for="(item, i) in order.items" :key="i" class="order-item">
              <span class="order-item-name">{{ itemName(item) }}</span>
              <span class="order-item-price">${{ item.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-total">
            <span>Total</span>
            <span>${{ order.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acc {
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  background: var(--bg);
}
.acc-inner {
  max-width: 700px;
  margin: 0 auto;
}
.acc-title {
  font-family: var(--serif);
  font-size: 2.2rem;
  font-weight: 400;
  color: var(--dark);
  margin-bottom: 2rem;
}
.acc-tabs {
  display: flex;
  gap: 0;
  border: 1.5px solid var(--sand);
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 2rem;
}
.acc-tabs button {
  flex: 1;
  padding: .65rem 1rem;
  border: none;
  background: transparent;
  font-family: var(--sans);
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--mid);
  cursor: pointer;
  transition: all .2s;
}
.acc-tabs button.active {
  background: var(--dark);
  color: var(--bg);
}
.acc-section { min-height: 200px; }
.acc-empty {
  text-align: center;
  padding: 3rem;
  color: var(--lt);
  font-size: .95rem;
}

/* Profile */
.prof-card {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1.5rem;
  background: var(--bg2);
  border: 1px solid rgba(0,0,0,.05);
  border-radius: 16px;
  margin-bottom: 1.5rem;
}
.prof-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--forest); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--sans); font-size: 1.3rem; font-weight: 700;
  flex-shrink: 0;
}
.prof-info { flex: 1; }
.prof-row {
  display: flex; justify-content: space-between;
  padding: .45rem 0;
  border-bottom: 1px solid rgba(0,0,0,.04);
  font-size: .9rem;
}
.prof-row:last-child { border: none; }
.prof-label { color: var(--lt); font-weight: 600; font-size: .78rem; text-transform: uppercase; letter-spacing: .05em; }
.prof-actions { display: flex; gap: .8rem; margin-top: 1rem; }

/* Buttons */
.btn-primary {
  padding: .7rem 1.6rem;
  border: none; border-radius: 50px;
  background: var(--dark); color: var(--bg);
  font-family: var(--sans); font-size: .8rem; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  cursor: pointer; transition: all .3s;
}
.btn-primary:hover { background: var(--forest); }
.btn-secondary {
  padding: .7rem 1.6rem;
  border: 1.5px solid var(--sand); border-radius: 50px;
  background: transparent; color: var(--dark);
  font-family: var(--sans); font-size: .8rem; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  cursor: pointer; transition: all .2s;
}
.btn-secondary:hover { border-color: var(--dark); }
.btn-outline-danger {
  padding: .7rem 1.6rem;
  border: 1.5px solid rgba(204,68,68,.3); border-radius: 50px;
  background: transparent; color: #c44;
  font-family: var(--sans); font-size: .8rem; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  cursor: pointer; transition: all .2s;
}
.btn-outline-danger:hover { border-color: #c44; background: rgba(204,68,68,.05); }

/* Addresses */
.addr-card {
  padding: 1.2rem 1.5rem;
  background: var(--bg2);
  border: 1px solid rgba(0,0,0,.05);
  border-radius: 14px;
  margin-bottom: .8rem;
}
.addr-top {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: .6rem;
}
.addr-label {
  font-weight: 700; font-size: .82rem; text-transform: uppercase;
  letter-spacing: .06em; color: var(--dark);
}
.addr-default {
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; color: var(--forest);
  padding: .2rem .6rem; border: 1px solid var(--forest);
  border-radius: 50px;
}
.addr-body { font-size: .88rem; color: var(--mid); line-height: 1.5; }
.addr-actions { display: flex; gap: .5rem; margin-top: .8rem; }
.btn-sm {
  padding: .35rem .9rem; border: 1px solid var(--sand); border-radius: 50px;
  background: transparent; font-family: var(--sans); font-size: .7rem;
  font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
  color: var(--mid); cursor: pointer; transition: all .2s;
}
.btn-sm:hover { border-color: var(--dark); color: var(--dark); }
.btn-sm--danger:hover { border-color: #c44; color: #c44; }
.addr-form-title {
  font-family: var(--serif); font-size: 1.3rem; font-weight: 400;
  margin-bottom: 1.2rem;
}
.addr-row { display: flex; gap: 1rem; }
.addr-row > * { flex: 1; }
.addr-check {
  display: flex; align-items: center; gap: .5rem;
  font-size: .85rem; color: var(--mid);
  margin-bottom: 1rem; cursor: pointer;
}
.addr-check input { accent-color: var(--forest); }

/* Orders */
.order-card {
  padding: 1.2rem 1.5rem;
  background: var(--bg2);
  border: 1px solid rgba(0,0,0,.05);
  border-radius: 14px;
  margin-bottom: .8rem;
}
.order-top {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: .8rem;
}
.order-id {
  font-weight: 700; font-size: .82rem; color: var(--dark);
  margin-right: .8rem;
}
.order-date { font-size: .8rem; color: var(--lt); }
.order-status {
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em;
  padding: .25rem .7rem; border-radius: 50px;
}
.st-processing { color: var(--gold); background: rgba(212,147,15,.1); }
.st-shipped { color: var(--ocean); background: rgba(26,120,165,.1); }
.st-delivered { color: var(--forest); background: rgba(27,133,74,.1); }
.st-cancelled { color: var(--lt); background: rgba(175,165,152,.1); }
.order-items { border-top: 1px solid rgba(0,0,0,.04); padding-top: .6rem; }
.order-item {
  display: flex; justify-content: space-between;
  padding: .3rem 0; font-size: .88rem;
}
.order-item-name { color: var(--dark); }
.order-item-price { font-family: var(--serif); font-style: italic; color: var(--mid); }
.order-total {
  display: flex; justify-content: space-between;
  padding-top: .6rem; margin-top: .4rem;
  border-top: 1px solid rgba(0,0,0,.06);
  font-weight: 700; font-size: .95rem;
}
.order-total span:last-child { font-family: var(--serif); font-style: italic; }

@media (max-width: 700px) {
  .acc { padding: 5rem 1rem 3rem; }
  .acc-title { font-size: 1.7rem; }
  .prof-card { flex-direction: column; align-items: center; text-align: center; }
  .addr-row { flex-direction: column; gap: 0; }
}
</style>
