<script setup>
import { ref } from 'vue'
import { BOOSTERS, BOOSTER_ORDER } from '../data/boosterData.js'
import BoosterCard from './BoosterCard.vue'

const expandedId = ref(null)

const boosters = BOOSTER_ORDER.map(id => BOOSTERS[id])


</script>

<template>
  <section class="products" id="products">
    <div class="s-hdr rv">
      <span class="s-lab">The Trio</span>
      <h2 class="s-ttl">Three drops. <i>Your formula.</i></h2>
      <p class="s-sub">Each booster is great on its own — or customize it with extra actives.</p>
    </div>

    <div class="products-grid" :class="{ 'grid-expanded': expandedId }">
      <template v-for="b in boosters" :key="b.id">
        <BoosterCard
          v-if="!expandedId || expandedId === b.id"
          :booster="b"
          :is-expanded="expandedId === b.id"
          @expand="expandedId = b.id"
          @collapse="expandedId = null"
          class="card-reveal"
        />
      </template>
    </div>
  </section>
</template>

<style scoped>
.products {
  padding: 5.4rem 1.4rem 3.6rem;
  background:
    radial-gradient(circle at 10% 4%, rgba(238, 225, 200, 0.58), rgba(238, 225, 200, 0) 38%),
    radial-gradient(circle at 88% 26%, rgba(198, 218, 209, 0.34), rgba(198, 218, 209, 0) 45%),
    linear-gradient(180deg, #f6f1e9 0%, var(--bg) 45%, #f7f2ea 100%);
}

.s-sub {
  font-size: 0.92rem;
  color: var(--mid);
  margin-top: 0.6rem;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  line-height: 1.5;
}

.products-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.3rem;
  transition: all 0.5s var(--ease-out);
}

.products-grid.grid-expanded {
  grid-template-columns: 1fr;
  max-width: 800px;
}

@media (max-width: 1080px) {
  .products {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 700px;
  }

  .products-grid.grid-expanded {
    grid-template-columns: 1fr;
    max-width: 680px;
  }
}

.card-reveal {
  animation: cardIn 0.6s var(--ease-out) both;
}

.card-reveal:nth-child(2) { animation-delay: 0.1s; }
.card-reveal:nth-child(3) { animation-delay: 0.2s; }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 760px) {
  .products {
    padding-top: 4.3rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.1rem;
    max-width: 520px;
  }
}
</style>
