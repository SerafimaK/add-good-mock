<script setup>
import { useCart } from './stores/cart.js'
import NavBar from './components/NavBar.vue'
import AuthModal from './components/auth/AuthModal.vue'

const { state } = useCart()
</script>

<template>
  <NavBar />
  <router-view />
  <AuthModal />

  <!-- Toast -->
  <div class="toast-msg" :class="{ show: state.toast.visible }">
    &#10003; {{ state.toast.message }}
  </div>
</template>
