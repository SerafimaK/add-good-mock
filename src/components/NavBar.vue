<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCart } from '../stores/cart.js'
import { useAuth } from '../stores/auth.js'
import CartDrawer from './CartDrawer.vue'

const { state: cartState, count, toggle } = useCart()
const { state: authState, isAuthenticated, openAuthModal, logout } = useAuth()

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const userInitial = computed(() => {
  if (authState.user?.name) return authState.user.name.charAt(0).toUpperCase()
  return '?'
})
</script>

<template>
  <nav :class="{ s: scrolled }">
    <router-link to="/" class="logo">Add <b>Good</b></router-link>
    <ul class="nav-links">
      <li><router-link :to="{ path: '/', hash: '#products' }" class="lk">Boosters</router-link></li>
      <li><router-link :to="{ path: '/', hash: '#howto' }" class="lk">How It Works</router-link></li>
      <li><router-link :to="{ path: '/', hash: '#quiz' }" class="lk">Find Yours</router-link></li>
      <li><router-link :to="{ path: '/', hash: '#reviews' }" class="lk">Reviews</router-link></li>
    </ul>
    <div class="nav-r">
      <!-- User icon -->
      <router-link v-if="isAuthenticated" to="/account" class="user-btn" aria-label="Account">
        <span class="user-initial">{{ userInitial }}</span>
      </router-link>
      <button v-else class="user-btn user-btn--guest" aria-label="Log in" @click="openAuthModal('login')">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </button>

      <button class="cart-btn" @click="toggle" aria-label="Cart">
        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <div class="cart-count" :class="{ show: count > 0 }">{{ count }}</div>
      </button>
      <router-link :to="{ path: '/', hash: '#pricing' }" class="ncta">Shop</router-link>
    </div>
  </nav>
  <CartDrawer />
</template>

<style scoped>
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  padding: .9rem 2.5rem; display: flex; justify-content: space-between;
  align-items: center; transition: all .4s;
  background: rgba(246,243,237,0); backdrop-filter: blur(0);
}
nav.s {
  background: rgba(246,243,237,.93); backdrop-filter: blur(18px);
  box-shadow: 0 1px 0 rgba(0,0,0,.04);
}
.logo {
  font-family: var(--serif); font-size: 1.5rem; color: var(--dark); text-decoration: none;
}
.logo b { font-weight: 400; font-style: italic; color: var(--forest); }
.nav-links { list-style: none; display: flex; gap: 2rem; }
.lk {
  text-decoration: none; color: var(--mid); font-size: .8rem; font-weight: 600;
  letter-spacing: .07em; text-transform: uppercase; transition: color .2s;
}
.lk:hover { color: var(--dark); }
.nav-r { display: flex; align-items: center; gap: 1rem; }
.user-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  text-decoration: none; transition: all .2s;
}
.user-btn--guest {
  background: none; border: none; cursor: pointer; padding: 0;
}
.user-btn--guest svg {
  width: 22px; height: 22px; fill: none; stroke: var(--dark);
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
}
.user-btn--guest:hover svg { stroke: var(--forest); }
.user-initial {
  background: var(--forest); color: #fff;
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--sans); font-size: .75rem; font-weight: 700;
  transition: transform .2s;
}
.user-initial:hover { transform: scale(1.08); }
.cart-btn {
  position: relative; background: none; border: none; cursor: pointer; padding: .4rem;
}
.cart-btn svg {
  width: 22px; height: 22px; fill: none; stroke: var(--dark);
  stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
}
.cart-count {
  position: absolute; top: -2px; right: -6px; background: var(--forest); color: #fff;
  font-size: .55rem; font-weight: 700; width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: scale(0); transition: all .3s;
}
.cart-count.show { opacity: 1; transform: scale(1); }
.ncta {
  background: var(--dark); color: var(--bg); padding: .55rem 1.4rem; border-radius: 50px;
  font-size: .78rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  text-decoration: none; transition: all .3s;
}
.ncta:hover { background: var(--forest); }

@media (max-width: 700px) {
  .nav-links { display: none; }
  nav { padding: .9rem 1.2rem; }
}
</style>
