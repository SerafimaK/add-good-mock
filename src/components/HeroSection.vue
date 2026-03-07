<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCart } from '../stores/cart.js'

const { add } = useCart()
const activeCard = ref(null)

const cards = [
  { id: 'glow', name: 'Glow', ingr: 'Rice Ferment · Niacinamide', price: '$11.90', icon: '/icon_rice.png' },
  { id: 'plump', name: 'Plump', ingr: 'Snow Mushroom · Hyaluronic Acid', price: '$11.90', icon: '/icon_mushroom.png' },
  { id: 'firm', name: 'Firm', ingr: 'Sea Kelp · Peptides', price: '$11.90', icon: '/icon_seaweed.png' },
]

// Bokeh canvas
const canvasRef = ref(null)
let animId = null

onMounted(() => {
  const c = canvasRef.value
  if (!c) return
  const ctx = c.getContext('2d')
  let w, h
  function resize() { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight }
  resize()
  const onResize = () => resize()
  window.addEventListener('resize', onResize)

  const colors = [
    [212,147,15],[27,133,74],[26,120,165],
    [230,185,80],[70,175,110],[70,160,200],
    [245,220,130],[100,200,130],[100,185,215]
  ]
  const bubbles = Array.from({ length: 25 }, (_, i) => ({
    x: Math.random() * w, y: Math.random() * h,
    r: 30 + Math.random() * 120,
    c: colors[i % colors.length],
    a: .04 + Math.random() * .05,
    dx: (Math.random() - .5) * .3,
    dy: (Math.random() - .5) * .25,
    phase: Math.random() * Math.PI * 2,
    pSpeed: .001 + Math.random() * .002,
  }))

  function draw(t) {
    ctx.clearRect(0, 0, w, h)
    bubbles.forEach(b => {
      b.x += b.dx + Math.sin(t * b.pSpeed + b.phase) * .15
      b.y += b.dy + Math.cos(t * b.pSpeed * 1.2 + b.phase) * .1
      if (b.x < -b.r) b.x = w + b.r; if (b.x > w + b.r) b.x = -b.r
      if (b.y < -b.r) b.y = h + b.r; if (b.y > h + b.r) b.y = -b.r
      const sz = b.r + Math.sin(t * b.pSpeed * 2) * b.r * .15
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, sz)
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a * 1.2})`)
      g.addColorStop(.5, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a * .5})`)
      g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`)
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(b.x, b.y, sz, 0, Math.PI * 2); ctx.fill()
    })
    animId = requestAnimationFrame(draw)
  }
  animId = requestAnimationFrame(draw)
})

onUnmounted(() => { if (animId) cancelAnimationFrame(animId) })

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="hero">
    <div class="hero-bg"><canvas ref="canvasRef"></canvas></div>

    <div class="hero-content">
      <div class="hero-text">
        <div class="h-tag"><span class="pulse"></span> Skincare boosters</div>
        <h1>Don't replace<br>your cream.<br><i>Add good</i> to it.</h1>
        <p class="h-sub">Three concentrated drops from rice fields, ancient forests, and the deep ocean. Add them to any cream you already love.</p>
        <div class="h-btns">
          <a href="#pricing" class="bp">Shop now</a>
          <a href="#quiz" class="bg-l">Find your match</a>
        </div>
      </div>

      <div class="hero-cards" @mouseleave="activeCard = null">
        <div
          v-for="(card, idx) in cards"
          :key="card.id"
          :class="[
            'hc', 'hc-' + card.id,
            'hc-pos-' + idx,
            { active: activeCard === card.id, dim: activeCard !== null && activeCard !== card.id }
          ]"
          @mouseenter="activeCard = card.id"
          @click="scrollTo('pb-' + card.id)"
        >
          <!-- Large name label -->
          <div class="hc-label">{{ card.name }}</div>

          <!-- Image that rises on hover -->
          <img :src="card.icon" class="hc-img" :alt="card.name" loading="lazy">

          <!-- Info overlay at bottom -->
          <div class="hc-info">
            <div class="hc-ingr">{{ card.ingr }}</div>
            <div class="hc-actions">
              <span class="hc-price">{{ card.price }}</span>
              <button class="hc-add" @click.stop="add(card.id)">+ Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating CTA -->
    <a href="#pricing" class="floating-cta">
      <span>The Trio</span>
      <strong>$29.90</strong>
    </a>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh; position: relative; overflow: hidden;
}
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-bg canvas { width: 100%; height: 100%; }

.hero-content {
  position: relative; z-index: 2; width: 100%;
  display: grid; grid-template-columns: 1fr 1.15fr;
  min-height: 100vh;
}

/* ═══ LEFT: Text ═══ */
.hero-text {
  display: flex; flex-direction: column; justify-content: center;
  padding: 7rem 4rem 4rem;
}

.h-tag {
  font-size: .72rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
  color: var(--mid); margin-bottom: 1.8rem;
  opacity: 0; animation: up .7s .2s forwards;
}
.pulse {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  background: var(--forest); margin-right: .5rem; vertical-align: middle;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }

h1 {
  font-family: var(--serif); font-size: clamp(2.6rem, 5vw, 4.6rem);
  font-weight: 400; line-height: 1.05; margin-bottom: 1.5rem;
  opacity: 0; animation: up .7s .35s forwards;
}
h1 i { font-style: italic; color: var(--forest); }

.h-sub {
  font-size: 1.08rem; color: var(--mid); line-height: 1.75; font-weight: 400;
  max-width: 420px; margin-bottom: 2.2rem;
  opacity: 0; animation: up .7s .5s forwards;
}

.h-btns {
  display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;
  opacity: 0; animation: up .7s .65s forwards;
}
.bp {
  display: inline-block; background: var(--dark); color: var(--bg);
  padding: .85rem 2rem; border-radius: 50px; font-size: .88rem;
  font-weight: 600; text-decoration: none; transition: all .3s;
}
.bp:hover {
  background: var(--forest); transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(27,133,74,.25);
}
.bg-l {
  font-size: .88rem; color: var(--mid); text-decoration: none;
  border-bottom: 1.5px solid var(--sand); padding-bottom: 2px;
  transition: all .25s; font-weight: 500;
}
.bg-l:hover { color: var(--dark); border-color: var(--dark); }

@keyframes up {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ═══ RIGHT: Collage Cards ═══ */
.hero-cards {
  display: flex; min-height: 100vh; overflow: hidden;
}

.hc {
  flex: 1 1 33.33%;
  position: relative; overflow: hidden; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: flex .55s var(--ease-out);
}

/* Bold gradients */
.hc-glow  { background: linear-gradient(170deg, #F5E2A0 0%, #D4930F 100%); }
.hc-plump { background: linear-gradient(170deg, #7DDBA0 0%, #1B854A 100%); }
.hc-firm  { background: linear-gradient(170deg, #72C2E0 0%, #1A78A5 100%); }

/* ── Diagonal clip-paths for collage effect ── */
.hc-pos-0 {
  clip-path: polygon(0 0, 100% 0, calc(100% - 3.5vw) 100%, 0 100%);
  margin-right: -1.8vw;
  z-index: 1;
}
.hc-pos-1 {
  clip-path: polygon(3.5vw 0, 100% 0, calc(100% - 3.5vw) 100%, 0 100%);
  margin: 0 -1.8vw;
  z-index: 2;
}
.hc-pos-2 {
  clip-path: polygon(3.5vw 0, 100% 0, 100% 100%, 0 100%);
  margin-left: -1.8vw;
  z-index: 1;
}

/* ── Hover: expand / shrink ── */
.hc.active { flex: 2.8; }
.hc.dim { flex: 0.45; }

/* ── Label ── */
.hc-label {
  font-family: var(--serif);
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  font-weight: 400;
  color: rgba(255,255,255,.92);
  text-shadow: 0 2px 30px rgba(0,0,0,.1);
  position: relative; z-index: 3;
  transition: all .55s var(--ease-out);
  user-select: none;
  white-space: nowrap;
}

/* Active: label fades to background */
.hc.active .hc-label {
  opacity: .12;
  transform: scale(.55) translateY(-60%);
}

/* Dimmed: label rotates vertical */
.hc.dim .hc-label {
  transform: rotate(90deg);
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  opacity: .55;
}

/* ── Image ── */
.hc-img {
  position: absolute;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  height: 55%; width: auto; max-width: 80%;
  object-fit: contain; z-index: 2;
  transition: all .6s var(--ease-out);
  filter: drop-shadow(0 -8px 30px rgba(0,0,0,.25));
  opacity: 0;
}

/* Active: image rises, becomes visible */
.hc.active .hc-img {
  bottom: 12%;
  height: 60%;
  opacity: 1;
}

/* Default (no hover on container): show image subtly */
.hc:not(.active):not(.dim) .hc-img {
  opacity: 0;
  bottom: -20%;
}

/* ── Info overlay ── */
.hc-info {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 1.2rem 1.2rem; z-index: 4;
  background: linear-gradient(to top, rgba(0,0,0,.35), transparent);
  opacity: 0; transform: translateY(10px);
  transition: all .4s var(--ease-out);
}
.hc.active .hc-info {
  opacity: 1; transform: translateY(0);
}

.hc-ingr {
  font-size: .7rem; font-weight: 500; color: rgba(255,255,255,.75);
  letter-spacing: .02em; margin-bottom: .35rem;
}
.hc-actions {
  display: flex; justify-content: space-between; align-items: center;
}
.hc-price {
  font-family: var(--serif); font-size: .95rem; font-style: italic;
  color: rgba(255,255,255,.9);
}
.hc-add {
  background: rgba(255,255,255,.18); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,.3); color: #fff;
  padding: .35rem .9rem; border-radius: 50px; font-size: .65rem;
  font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
  cursor: pointer; transition: all .2s; font-family: var(--sans);
}
.hc-add:hover {
  background: rgba(255,255,255,.35); transform: scale(1.05);
}

/* ═══ Floating CTA ═══ */
.floating-cta {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 150;
  background: var(--dark); color: var(--bg); text-decoration: none;
  padding: .6rem 1.2rem; border-radius: 50px;
  display: flex; gap: .5rem; align-items: center;
  font-size: .75rem; font-weight: 600; letter-spacing: .04em;
  box-shadow: 0 8px 32px rgba(0,0,0,.2);
  transition: all .3s; text-transform: uppercase;
  animation: floatIn 1s 1.5s both;
}
.floating-cta strong {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: .95rem; text-transform: none;
}
.floating-cta:hover {
  background: var(--forest); transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(27,133,74,.3);
}
@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ═══ Responsive ═══ */
@media (max-width: 1000px) {
  .hero-content { grid-template-columns: 1fr; }
  .hero-text { padding: 7rem 2rem 2rem; text-align: center; }
  .h-sub { margin-left: auto; margin-right: auto; }
  .h-btns { justify-content: center; }
  .hero-cards { min-height: 50vh; }
  .hc-label { font-size: clamp(2rem, 5vw, 3.5rem); }
}

@media (max-width: 700px) {
  .hero-cards { min-height: auto; }
  .hc { min-height: 200px; }
  .hero-text { padding: 6rem 1.5rem 1.5rem; }
  /* Simplify clip-paths on mobile */
  .hc-pos-0 { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 2vh), 0 100%); margin: 0 0 -1vh 0; }
  .hc-pos-1 { clip-path: polygon(0 2vh, 100% 0, 100% calc(100% - 2vh), 0 100%); margin: -1vh 0; }
  .hc-pos-2 { clip-path: polygon(0 2vh, 100% 0, 100% 100%, 0 100%); margin: -1vh 0 0 0; }
  .hc.dim .hc-label { transform: none; font-size: 1.5rem; }
}
</style>
