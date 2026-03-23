<script setup>
import { useAuth } from '../../stores/auth.js'

const { openAuthModal } = useAuth()
const emit = defineEmits(['choose'])
</script>

<template>
  <div class="csa">
    <h2 class="csa-title">How would you like to proceed?</h2>
    <div class="csa-options">
      <div class="csa-card" @click="emit('choose', 'guest')">
        <div class="csa-icon">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        </div>
        <h3>Continue as guest</h3>
        <p>Checkout without creating an account</p>
      </div>
      <div class="csa-card" @click="openAuthModal('login')">
        <div class="csa-icon">
          <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        </div>
        <h3>Log in</h3>
        <p>Use your existing account</p>
      </div>
      <div class="csa-card" @click="emit('choose', 'create')">
        <div class="csa-icon">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h3>Quick sign-up</h3>
        <p>Create an account from your order details</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.csa-title {
  font-family: var(--serif); font-size: 1.5rem; font-weight: 400;
  text-align: center; margin-bottom: 2rem;
}
.csa-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.csa-card {
  text-align: center;
  padding: 1.8rem 1.2rem;
  border: 1.5px solid var(--sand);
  border-radius: 16px;
  cursor: pointer;
  transition: all .25s;
}
.csa-card:hover {
  border-color: var(--forest);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}
.csa-icon {
  width: 48px; height: 48px;
  margin: 0 auto 1rem;
  background: rgba(27,133,74,.08);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.csa-icon svg {
  width: 24px; height: 24px;
  fill: none; stroke: var(--forest);
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
}
.csa-card h3 {
  font-family: var(--sans); font-size: .9rem; font-weight: 700;
  margin-bottom: .3rem; color: var(--dark);
}
.csa-card p {
  font-size: .78rem; color: var(--mid); line-height: 1.4;
}

@media (max-width: 700px) {
  .csa-options { grid-template-columns: 1fr; }
  .csa-card { padding: 1.2rem; }
}
</style>
