import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { loadProducts } from './data/boosterData.js'
import { hydrateAuth } from './stores/auth.js'

// Kick off both in parallel — catalogue is public and can start loading while
// the auth call hits /user/me. Neither is fatal: products are cached in
// memory, auth falls back to the local session if the network is down.
await Promise.all([loadProducts(), hydrateAuth()])

createApp(App).use(router).mount('#app')
