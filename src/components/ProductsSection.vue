<script setup>
import { onMounted } from 'vue'
import { useCart } from '../stores/cart.js'

const { add } = useCart()

const products = [
  {
    id: 'glow', num: '01', name: 'Glow', cls: 'g',
    ing: 'Rice Ferment Filtrate · Niacinamide 5%',
    desc: 'Japanese rice ferment meets modern niacinamide. Brightens, evens tone, fades dark spots.',
    quote: 'The centuries-old secret behind porcelain skin',
    img: '/rice_ferment.png',
  },
  {
    id: 'plump', num: '02', name: 'Plump', cls: 'p',
    ing: 'Snow Mushroom · Multi-Weight Hyaluronic Acid',
    desc: 'Tremella fuciformis \u2014 a translucent white fungus whose polysaccharides hold moisture even better than HA. Deep hydration, visible plumping.',
    quote: 'The mushroom that out-hydrates hyaluronic acid',
    img: '/snow_mushroom.png',
  },
  {
    id: 'firm', num: '03', name: 'Firm', cls: 'f',
    ing: 'Sea Kelp Bioferment · Peptide Complex',
    desc: 'Fermented deep-sea kelp releases bioavailable minerals. Peptides tell your skin to build collagen. Firmness. Lift. Bounce.',
    quote: 'Where ocean minerals meet peptide precision',
    img: '/sea_kelp.png',
  },
]

onMounted(() => {
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
  }, { threshold: .05 })
  document.querySelectorAll('.rv').forEach(el => ob.observe(el))
})
</script>

<template>
  <section class="products" id="products">
    <div class="s-hdr rv">
      <span class="s-lab">The Trio</span>
      <h2 class="s-ttl">Three drops. <i>Three stories.</i></h2>
    </div>

    <div class="products-grid">
      <div
        v-for="p in products"
        :key="p.id"
        :id="'pb-' + p.id"
        :class="['product-card', 'pc-' + p.cls, 'rv']"
      >
        <div class="pc-visual">
          <img :src="p.img" class="pc-photo" :alt="p.name" loading="lazy">
          <div class="pc-badge">{{ p.num }}</div>
          <div class="pc-quote-overlay">"{{ p.quote }}"</div>
        </div>

        <div class="pc-body">
          <div :class="['pc-tag']">{{ p.num }}</div>
          <h3 class="pc-name">{{ p.name }}</h3>
          <div class="pc-ing">{{ p.ing }}</div>
          <p class="pc-desc">{{ p.desc }}</p>
          <div class="pc-bottom">
            <span class="pc-price">$11.90</span>
            <button class="pc-btn" @click="add(p.id)">Add to bag</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.products { padding: 5rem 0 3rem; background: var(--bg); }

.products-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; max-width: 1200px; margin: 0 auto;
}

.product-card {
  display: flex; flex-direction: column;
  border: 1px solid rgba(0,0,0,.04);
  transition: transform .4s var(--ease-out), box-shadow .4s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,.08);
  z-index: 2;
}

/* ── Visual area ── */
.pc-visual {
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem; height: 220px;
}
.pc-g .pc-visual { background: linear-gradient(135deg, #F5E2A0, #D4930F); }
.pc-p .pc-visual { background: linear-gradient(135deg, #7DDBA0, #1B854A); }
.pc-f .pc-visual { background: linear-gradient(135deg, #72C2E0, #1A78A5); }

/* Image — vivid, no transparency */
.pc-photo {
  max-height: 75%; max-width: 70%; object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,.15));
  transition: all .5s var(--ease-out);
}
.product-card:hover .pc-photo { transform: scale(1.06); }

.pc-badge {
  position: absolute; top: .8rem; right: .8rem;
  font-family: var(--serif); font-size: .75rem; font-style: italic;
  color: rgba(255,255,255,.7); background: rgba(255,255,255,.18);
  backdrop-filter: blur(6px);
  padding: .2rem .6rem; border-radius: 50px;
}

/* Quote overlay at bottom of visual */
.pc-quote-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: .7rem 1rem;
  background: linear-gradient(to top, rgba(0,0,0,.4), transparent);
  font-family: var(--serif); font-size: .8rem; font-style: italic;
  color: rgba(255,255,255,.9); line-height: 1.35;
  transform: translateY(4px);
  opacity: 0;
  transition: all .4s var(--ease-out);
}
.product-card:hover .pc-quote-overlay {
  opacity: 1; transform: translateY(0);
}

/* ── Body ── */
.pc-body {
  padding: 1.8rem 1.5rem; background: var(--bg2); flex: 1;
  display: flex; flex-direction: column;
}

.pc-tag {
  font-size: .6rem; font-weight: 700; letter-spacing: .2em;
  text-transform: uppercase; margin-bottom: .4rem;
}
.pc-g .pc-tag { color: var(--gold); }
.pc-p .pc-tag { color: var(--forest); }
.pc-f .pc-tag { color: var(--ocean); }

.pc-name {
  font-family: var(--serif); font-size: 1.8rem;
  font-weight: 400; margin-bottom: .2rem; line-height: 1.05;
}
.pc-ing {
  font-size: .78rem; font-weight: 500; color: var(--mid); margin-bottom: .8rem;
}
.pc-desc {
  font-size: .85rem; color: var(--mid); line-height: 1.6;
  font-weight: 400; margin-bottom: .8rem; flex: 1;
}

.pc-bottom {
  display: flex; align-items: center; gap: 1rem;
}
.pc-price {
  font-family: var(--serif); font-size: 1.3rem; font-style: italic;
}
.pc-btn {
  display: inline-block; padding: .6rem 1.3rem; border-radius: 50px;
  font-size: .75rem; font-weight: 600; letter-spacing: .04em;
  text-transform: uppercase; text-decoration: none;
  border: 1.5px solid var(--dark); color: var(--dark);
  transition: all .3s; background: transparent; cursor: pointer;
  font-family: var(--sans);
}
.pc-btn:hover { background: var(--dark); color: var(--bg); }

@media (max-width: 900px) {
  .products-grid { grid-template-columns: 1fr; max-width: 500px; }
  .pc-visual { height: 180px; }
}
</style>
