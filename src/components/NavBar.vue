<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCart } from '../stores/cart.js'
import CartDrawer from './CartDrawer.vue'

const { state, count, toggle } = useCart()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav :class="{ s: scrolled }">
    <a href="#" class="logo">Add <b>Good</b></a>
    <ul class="nav-links">
      <li><a href="#products" class="lk">Boosters</a></li>
      <li><a href="#howto" class="lk">How It Works</a></li>
      <li><a href="#quiz" class="lk">Find Yours</a></li>
      <li><a href="#reviews" class="lk">Reviews</a></li>
    </ul>
    <div class="nav-r">
      <button class="cart-btn" @click="toggle" aria-label="Cart">
        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <div class="cart-count" :class="{ show: count > 0 }">{{ count }}</div>
      </button>
      <a href="#pricing" class="ncta">Shop</a>
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
