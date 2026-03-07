<script setup>
import { useCart } from '../stores/cart.js'

const { add } = useCart()

const products = [
  {
    id: 'glow',
    num: '01',
    name: 'Glow',
    source: 'Field',
    tone: 'glow',
    benefit: 'Radiance + tone clarity',
    ing: 'Rice Ferment Filtrate · Niacinamide 5%',
    desc: 'Warm rice actives melt into cream and wake up dull tone with a porcelain-soft glow.',
    quote: 'The centuries-old secret behind porcelain skin',
    bottle: '/rice_ferment.png',
    ingredient: '/icon_rice.png',
    drop: '/gold_droplet.png',
  },
  {
    id: 'plump',
    num: '02',
    name: 'Plump',
    source: 'Forest',
    tone: 'plump',
    benefit: 'Water cushion + bounce',
    ing: 'Snow Mushroom · Multi-Weight Hyaluronic Acid',
    desc: 'A botanical hydration veil that floods skin with moisture, then holds it in all day.',
    quote: 'The mushroom that out-hydrates hyaluronic acid',
    bottle: '/snow_mushroom.png',
    ingredient: '/icon_mushroom.png',
    drop: '/green_droplet.png',
  },
  {
    id: 'firm',
    num: '03',
    name: 'Firm',
    source: 'Ocean',
    tone: 'firm',
    benefit: 'Lifted feel + elastic skin',
    ing: 'Sea Kelp Bioferment · Peptide Complex',
    desc: 'Marine minerals and peptides leave skin tighter, smoother and softly sculpted.',
    quote: 'Where ocean minerals meet peptide precision',
    bottle: '/sea_kelp.png',
    ingredient: '/icon_seaweed.png',
    drop: '/blue_droplet.png',
  },
]
</script>

<template>
  <section class="products" id="products">
    <div class="s-hdr rv">
      <span class="s-lab">The Trio</span>
      <h2 class="s-ttl">Three drops. <i>Three stories.</i></h2>
    </div>

    <div class="products-grid">
      <article
        v-for="p in products"
        :key="p.id"
        :id="'pb-' + p.id"
        :class="['story-panel', 'tone-' + p.tone, 'rv']"
      >
        <div class="panel-atmo" aria-hidden="true">
          <span class="panel-cloud cloud-a"></span>
          <span class="panel-cloud cloud-b"></span>
          <span class="panel-shadow"></span>
          <img :src="p.ingredient" alt="" class="panel-ingredient" loading="lazy">
          <img :src="p.drop" alt="" class="panel-drop" loading="lazy">
          <img :src="p.bottle" :alt="p.name" class="panel-bottle" loading="lazy">
          <p class="panel-quote">"{{ p.quote }}"</p>
        </div>

        <div class="panel-copy">
          <div class="panel-meta">
            <span class="panel-num">{{ p.num }}</span>
            <span class="panel-source">{{ p.source }}</span>
          </div>
          <h3 class="panel-name">{{ p.name }}</h3>
          <p class="panel-benefit">{{ p.benefit }}</p>
          <p class="panel-actives"><span>Actives</span>{{ p.ing }}</p>
          <p class="panel-story">{{ p.desc }}</p>

          <div class="panel-action">
            <span class="panel-price">$11.90</span>
            <button class="panel-btn" @click="add(p.id)">Add to bag</button>
          </div>
        </div>
      </article>
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

.products-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.3rem;
}

.story-panel {
  --offset: 0px;
  --tone-rgb: 218, 185, 127;
  --tone-ink: #6c4f1f;
  --tone-halo: rgba(218, 185, 127, 0.36);
  --btn-text: #5d4420;
  grid-column: span 4;
  border-radius: 2rem;
  padding: 0.92rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.56);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.36));
  box-shadow:
    0 14px 38px rgba(123, 109, 90, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
  transform: translateY(var(--offset));
  transition:
    transform 0.42s var(--ease-out),
    box-shadow 0.42s var(--ease-out),
    border-color 0.35s ease;
}

.story-panel:nth-child(2) {
  --offset: 1.5rem;
}

.story-panel:nth-child(3) {
  --offset: -0.45rem;
}

.story-panel:hover {
  transform: translateY(calc(var(--offset) - 0.6rem));
  box-shadow:
    0 24px 52px rgba(112, 98, 82, 0.2),
    0 0 0 1px rgba(var(--tone-rgb), 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  border-color: rgba(var(--tone-rgb), 0.34);
}

.panel-atmo {
  position: relative;
  min-height: 248px;
  border-radius: 1.5rem;
  overflow: hidden;
  margin-bottom: 1.1rem;
  padding: 0.7rem 1rem;
  background:
    radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 52%),
    radial-gradient(circle at 74% 56%, rgba(var(--tone-rgb), 0.34), rgba(var(--tone-rgb), 0) 66%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.56), rgba(var(--tone-rgb), 0.22));
}

.panel-atmo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(22, 19, 16, 0.14), rgba(22, 19, 16, 0));
  pointer-events: none;
}

.panel-cloud {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--tone-rgb), 0.5), rgba(var(--tone-rgb), 0));
  filter: blur(8px);
  opacity: 0.75;
  transition: transform 0.5s var(--ease-out), opacity 0.5s var(--ease-out);
}

.cloud-a {
  width: 190px;
  height: 190px;
  left: -24px;
  top: -44px;
}

.cloud-b {
  width: 210px;
  height: 210px;
  right: -34px;
  bottom: -88px;
  opacity: 0.58;
}

.panel-shadow {
  position: absolute;
  width: 56%;
  height: 18px;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(40, 34, 26, 0.28), rgba(40, 34, 26, 0));
  filter: blur(2px);
  z-index: 2;
}

.panel-ingredient {
  position: absolute;
  width: clamp(114px, 12vw, 160px);
  right: 4%;
  top: 8%;
  opacity: 0.32;
  mix-blend-mode: soft-light;
  filter: saturate(0.85);
  transform: translate3d(0, 4px, 0) scale(0.93);
  transition: opacity 0.45s ease, transform 0.45s ease;
  z-index: 1;
}

.panel-drop {
  position: absolute;
  width: clamp(54px, 6vw, 78px);
  left: 12%;
  bottom: 28px;
  opacity: 0.66;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.13));
  transform: translate3d(0, 0, 0);
  transition: transform 0.45s var(--ease-out), opacity 0.45s ease, filter 0.45s ease;
  z-index: 3;
}

.panel-bottle {
  position: absolute;
  width: min(280px, 80%);
  left: 50%;
  bottom: 18px;
  transform: translate3d(-50%, 0, 0) scale(1);
  filter: drop-shadow(0 18px 24px rgba(73, 63, 49, 0.2));
  transition: transform 0.48s var(--ease-out), filter 0.48s var(--ease-out);
  z-index: 4;
}

.panel-quote {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.95rem;
  z-index: 5;
  font-family: var(--serif);
  font-style: italic;
  font-size: 0.83rem;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 16px rgba(13, 11, 8, 0.24);
}

.story-panel:hover .panel-bottle {
  transform: translate3d(-50%, -7px, 0) scale(1.03);
  filter: drop-shadow(0 26px 30px rgba(73, 63, 49, 0.26));
}

.story-panel:hover .panel-drop {
  transform: translate3d(5px, -7px, 0);
  opacity: 0.86;
  filter: drop-shadow(0 0 16px var(--tone-halo));
}

.story-panel:hover .panel-ingredient {
  opacity: 0.5;
  transform: translate3d(0, 0, 0) scale(1);
}

.story-panel:hover .panel-cloud {
  opacity: 0.95;
  transform: scale(1.08);
}

.panel-copy {
  display: flex;
  flex-direction: column;
  gap: 0.52rem;
  padding: 0.44rem 0.42rem 0.3rem;
}

.panel-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.panel-num {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(73, 67, 58, 0.62);
}

.panel-source {
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tone-ink);
  opacity: 0.76;
}

.panel-name {
  font-family: var(--serif);
  font-size: clamp(1.7rem, 2.3vw, 2.1rem);
  line-height: 0.98;
  font-weight: 400;
}

.panel-benefit {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--tone-ink);
  line-height: 1.2;
}

.panel-actives {
  margin-top: 0.18rem;
  font-size: 0.76rem;
  color: rgba(70, 65, 58, 0.86);
  line-height: 1.52;
}

.panel-actives span {
  display: block;
  margin-bottom: 0.12rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(86, 79, 70, 0.6);
}

.panel-story {
  font-size: 0.88rem;
  color: var(--mid);
  line-height: 1.62;
  margin-bottom: 0.5rem;
}

.panel-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: auto;
}

.panel-price {
  font-family: var(--serif);
  font-size: 1.33rem;
  font-style: italic;
}

.panel-btn {
  border: 1px solid rgba(var(--tone-rgb), 0.36);
  border-radius: 999px;
  padding: 0.62rem 1.26rem;
  font-family: var(--sans);
  font-size: 0.73rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--btn-text);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0.5));
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.32s ease,
    background 0.32s ease,
    border-color 0.32s ease;
}

.panel-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--tone-rgb), 0.64);
  background: linear-gradient(150deg, rgba(var(--tone-rgb), 0.23), rgba(255, 255, 255, 0.76));
  box-shadow: 0 8px 20px rgba(var(--tone-rgb), 0.34);
}

.tone-glow {
  --tone-rgb: 221, 186, 124;
  --tone-ink: #6d4f1c;
  --tone-halo: rgba(221, 186, 124, 0.46);
  --btn-text: #614617;
}

.tone-plump {
  --tone-rgb: 149, 193, 143;
  --tone-ink: #245833;
  --tone-halo: rgba(149, 193, 143, 0.44);
  --btn-text: #1d5030;
}

.tone-firm {
  --tone-rgb: 132, 182, 207;
  --tone-ink: #225571;
  --tone-halo: rgba(132, 182, 207, 0.46);
  --btn-text: #1c4d67;
}

@media (max-width: 1080px) {
  .products {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .products-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    max-width: 860px;
  }

  .story-panel {
    grid-column: span 3;
    --offset: 0px;
  }

  .story-panel:nth-child(2) {
    --offset: 0.9rem;
  }

  .story-panel:nth-child(3) {
    grid-column: 2 / span 4;
    --offset: 0.2rem;
  }
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

  .story-panel {
    grid-column: span 1;
    --offset: 0px;
  }

  .story-panel:nth-child(2),
  .story-panel:nth-child(3) {
    grid-column: span 1;
    --offset: 0px;
  }

  .panel-atmo {
    min-height: 220px;
  }

  .panel-bottle {
    width: min(250px, 78%);
  }
}
</style>
