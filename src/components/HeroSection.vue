<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '../stores/auth.js'

defineEmits(['open-promo'])

const { isAuthenticated } = useAuth()

const boosters = [
  {
    id: 'glow',
    name: 'Glow',
    source: 'Field',
    ingr: 'Rice Ferment + Niacinamide',
    mini: 'Rice actives melt in first to wake up flat, tired tone.',
    drop: '/gold_droplet.png',
    ingredient: '/icon_rice.png',
  },
  {
    id: 'plump',
    name: 'Plump',
    source: 'Forest',
    ingr: 'Snow Mushroom + Hyaluronic Acid',
    mini: 'Mushroom hydration wraps skin in a soft water cushion.',
    drop: '/green_droplet.png',
    ingredient: '/icon_mushroom.png',
  },
  {
    id: 'firm',
    name: 'Firm',
    source: 'Ocean',
    ingr: 'Sea Kelp Bioferment + Peptides',
    mini: 'Marine peptides tighten the feel while cream stays weightless.',
    drop: '/blue_droplet.png',
    ingredient: '/icon_seaweed.png',
  },
]

const focusColors = {
  glow: [219, 185, 124],
  plump: [151, 192, 145],
  firm: [132, 182, 207],
}

const canvasRef = ref(null)
const activeStory = ref(boosters[0].id)
const hoveredStory = ref(null)
const stageHovered = ref(false)
const pointerX = ref(0)
const pointerY = ref(0)

let animId = null
let resizeHandler = null
let storyTicker = null

const focusStoryId = computed(() => hoveredStory.value || activeStory.value)
const activeStoryData = computed(
  () => boosters.find((item) => item.id === focusStoryId.value) ?? boosters[0],
)

const stageStyle = computed(() => ({
  '--mx': pointerX.value.toFixed(3),
  '--my': pointerY.value.toFixed(3),
}))

function resetPointer() {
  pointerX.value = 0
  pointerY.value = 0
}

function cycleStory() {
  if (stageHovered.value || hoveredStory.value) return
  const idx = boosters.findIndex((item) => item.id === activeStory.value)
  activeStory.value = boosters[(idx + 1) % boosters.length].id
}

function onStageMove(event) {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches) return
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  pointerX.value = Math.max(-1, Math.min(1, x))
  pointerY.value = Math.max(-1, Math.min(1, y))
}

function onStageEnter() {
  stageHovered.value = true
}

function onStageLeave() {
  stageHovered.value = false
  hoveredStory.value = null
  resetPointer()
}

function focusStory(id) {
  activeStory.value = id
}

function onDropEnter(id) {
  hoveredStory.value = id
  activeStory.value = id
}

function onDropLeave() {
  hoveredStory.value = null
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let w = 0
  let h = 0

  const resize = () => {
    w = canvas.width = canvas.offsetWidth
    h = canvas.height = canvas.offsetHeight
  }

  resize()
  resizeHandler = () => resize()
  window.addEventListener('resize', resizeHandler)

  storyTicker = window.setInterval(cycleStory, 4200)

  const colors = [
    [231, 205, 162],
    [186, 213, 182],
    [168, 205, 223],
    [238, 226, 199],
    [201, 221, 197],
    [190, 217, 227],
  ]

  const particles = Array.from({ length: 24 }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 56 + Math.random() * 146,
    c: colors[i % colors.length],
    a: 0.017 + Math.random() * 0.03,
    dx: (Math.random() - 0.5) * 0.15,
    dy: (Math.random() - 0.5) * 0.11,
    phase: Math.random() * Math.PI * 2,
    speed: 0.00065 + Math.random() * 0.0013,
  }))

  const draw = (time) => {
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'screen'

    particles.forEach((p) => {
      p.x += p.dx + Math.sin(time * p.speed + p.phase) * 0.08
      p.y += p.dy + Math.cos(time * p.speed * 1.1 + p.phase) * 0.06

      if (p.x < -p.r) p.x = w + p.r
      if (p.x > w + p.r) p.x = -p.r
      if (p.y < -p.r) p.y = h + p.r
      if (p.y > h + p.r) p.y = -p.r

      const radius = p.r + Math.sin(time * p.speed * 1.7) * p.r * 0.08
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
      gradient.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a * 1.18})`)
      gradient.addColorStop(0.58, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a * 0.56})`)
      gradient.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    const focus = focusColors[focusStoryId.value]
    const focusX = w * 0.62 + pointerX.value * 26
    const focusY = h * 0.53 + pointerY.value * 24
    const boost = stageHovered.value ? 0.16 : 0.11
    const pulse = 1 + Math.sin(time * 0.0012) * 0.06
    const bloom = ctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, Math.max(w, h) * 0.45 * pulse)
    bloom.addColorStop(0, `rgba(${focus[0]},${focus[1]},${focus[2]},${boost})`)
    bloom.addColorStop(0.52, `rgba(${focus[0]},${focus[1]},${focus[2]},${boost * 0.58})`)
    bloom.addColorStop(1, `rgba(${focus[0]},${focus[1]},${focus[2]},0)`)

    ctx.fillStyle = bloom
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'

    animId = requestAnimationFrame(draw)
  }

  animId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (storyTicker) clearInterval(storyTicker)
})
</script>

<template>
  <section class="hero">
    <div class="hero-bg">
      <canvas ref="canvasRef"></canvas>
    </div>

    <div class="hero-content">
      <div class="hero-text">
        <div class="h-tag"><span class="pulse"></span> Skincare boosters</div>
        <h1>Don't replace<br>your cream.<br><i>Add good</i> to it.</h1>
        <p class="h-sub">
          Your cream is already good. Add Good makes it work harder. Choose your booster by what your skin needs right now.
        </p>
        <div class="h-btns">
          <a href="#pricing" class="bp">Shop now</a>
          <a href="#science" class="bg-l">Explore ingredients</a>
        </div>
      </div>

      <div class="hero-visual">
        <div
          class="atmo-stage"
          :class="['focus-' + focusStoryId, { 'has-focus': hoveredStory }]"
          :style="stageStyle"
          @mousemove="onStageMove"
          @mouseenter="onStageEnter"
          @mouseleave="onStageLeave"
        >
          <!-- Watercolor pulsating spots -->
          <div class="watercolor-spots" aria-hidden="true">
            <span class="wc-spot wc-spot-1"></span>
            <span class="wc-spot wc-spot-2"></span>
            <span class="wc-spot wc-spot-3"></span>
            <span class="wc-spot wc-spot-4"></span>
          </div>

          <!-- Three drops arranged diagonally -->
          <div class="drop-diagonal" aria-label="Booster drops">
            <button
              v-for="story in boosters"
              :key="story.id"
              type="button"
              :class="['drop-orb', 'drop-' + story.id, { 'is-active': focusStoryId === story.id }]"
              :aria-pressed="focusStoryId === story.id"
              @mouseenter="onDropEnter(story.id)"
              @mouseleave="onDropLeave"
              @focus="onDropEnter(story.id)"
              @blur="onDropLeave"
              @click="focusStory(story.id)"
            >
              <img :src="story.drop" alt="" class="drop-image" loading="lazy">
            </button>
          </div>

          <!-- Bottle on the right, top layer -->
          <div class="bottle-hero" aria-hidden="true">
            <img src="/bottle.png" alt="" class="bottle-image" loading="lazy">
          </div>

          <!-- Cream smear at the bottom -->
          <div class="cream-hero" aria-hidden="true">
            <img src="/cream.png" alt="" class="cream-image" loading="lazy">
          </div>
        </div>
      </div>
    </div>

    <button v-if="!isAuthenticated" class="floating-cta" @click="$emit('open-promo')">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 5.5L15 6L11.5 9.5L12.5 14.5L8 12L3.5 14.5L4.5 9.5L1 6L6 5.5L8 1Z" fill="currentColor"/></svg>
      <span>Get 15% off</span>
      <strong>your first order</strong>
    </button>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 10%, rgba(246, 232, 210, 0.62), transparent 42%),
    radial-gradient(circle at 85% 18%, rgba(201, 222, 214, 0.34), transparent 44%),
    linear-gradient(140deg, #f8f3ea 0%, #f4efe5 42%, #f2eee8 100%);
}

.hero::before,
.hero::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.hero::before {
  inset: 8% auto auto -8%;
  width: 36rem;
  height: 36rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(214, 188, 145, 0.18), rgba(214, 188, 145, 0));
  filter: blur(12px);
}

.hero::after {
  right: -7%;
  bottom: -15%;
  width: 26rem;
  height: 26rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(166, 198, 211, 0.24), rgba(166, 198, 211, 0));
  filter: blur(8px);
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg canvas {
  width: 100%;
  height: 100%;
  opacity: 0.72;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(340px, 1.08fr);
}

.hero-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 7rem 4rem 4rem;
}

.h-tag {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--mid);
  margin-bottom: 1.8rem;
  opacity: 0;
  animation: up 0.7s 0.2s forwards;
}

.pulse {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--forest);
  margin-right: 0.5rem;
  vertical-align: middle;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

h1 {
  font-family: var(--serif);
  font-size: clamp(2.6rem, 5vw, 4.6rem);
  font-weight: 400;
  line-height: 1.05;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: up 0.7s 0.35s forwards;
}

h1 i {
  font-style: italic;
  color: var(--forest);
}

.h-sub {
  font-size: 1.05rem;
  color: var(--mid);
  line-height: 1.72;
  font-weight: 400;
  max-width: 440px;
  margin-bottom: 0.7rem;
  opacity: 0;
  animation: up 0.7s 0.5s forwards;
}

.h-note {
  font-size: 0.88rem;
  color: rgba(74, 84, 77, 0.8);
  letter-spacing: 0.01em;
  max-width: 420px;
  margin-bottom: 2.1rem;
  opacity: 0;
  animation: up 0.7s 0.57s forwards;
}

.h-btns {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: up 0.7s 0.65s forwards;
}

.bp {
  display: inline-block;
  background: var(--dark);
  color: var(--bg);
  padding: 0.85rem 2rem;
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.bp:hover {
  background: var(--forest);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(27, 133, 74, 0.2);
}

.bg-l {
  font-size: 0.88rem;
  color: var(--mid);
  text-decoration: none;
  border-bottom: 1.5px solid var(--sand);
  padding-bottom: 2px;
  transition: all 0.25s;
  font-weight: 500;
}

.bg-l:hover {
  color: var(--dark);
  border-color: var(--dark);
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0 0 0;
  overflow: visible;
}

.atmo-stage {
  --mx: 0;
  --my: 0;
  width: 100%;
  min-height: 100vh;
  position: relative;
  isolation: isolate;
}

/* Watercolor pulsating spots */
.watercolor-spots {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.wc-spot {
  position: absolute;
  border-radius: 50%;
  filter: blur(32px);
}

.wc-spot-1 {
  width: 360px;
  height: 360px;
  top: 5%;
  right: 8%;
  --wc-dur: 7.5s;
  background: radial-gradient(circle, rgba(245, 170, 195, 0.45), rgba(245, 170, 195, 0));
}

.wc-spot-2 {
  width: 300px;
  height: 300px;
  top: 42%;
  left: 2%;
  --wc-dur: 9s;
  background: radial-gradient(circle, rgba(235, 160, 185, 0.38), rgba(235, 160, 185, 0));
}

.wc-spot-3 {
  width: 340px;
  height: 340px;
  bottom: 10%;
  right: 18%;
  --wc-dur: 8.2s;
  background: radial-gradient(circle, rgba(250, 185, 210, 0.42), rgba(250, 185, 210, 0));
}

.wc-spot-4 {
  width: 250px;
  height: 250px;
  top: 22%;
  left: 25%;
  --wc-dur: 10s;
  background: radial-gradient(circle, rgba(242, 190, 212, 0.35), rgba(242, 190, 212, 0));
}


/* Diagonal drop layout */
.drop-diagonal {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.drop-orb {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  position: absolute;
  pointer-events: auto;
  transition: transform 0.32s ease, filter 0.32s ease;
  transform-origin: center center;
}

.drop-image {
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 20px rgba(108, 95, 79, 0.22));
}

/* Drops on a perfect diagonal: equal vertical (8.4%) and horizontal (18%) spacing */

/* Green drop — bottom left */
.drop-plump {
  top: 320px;
  left: 4%;
}

.drop-plump .drop-image {
  width: 89px;
}

/* Blue drop — center */
.drop-firm {
  top: 245px;
  left: 22%;
}

.drop-firm .drop-image {
  width: 90px;
}

/* Gold drop — top right */
.drop-glow {
  top: 170px;
  left: 40%;
}

.drop-glow .drop-image {
  width: 99px;
}

.drop-orb {
  cursor: default;
}

/* Bottle — right side, overlapping cream */
.bottle-hero {
  position: absolute;
  right: 12%;
  top: 160px;
  width: 145px;
  z-index: 6;
}

.bottle-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(-12px 20px 40px rgba(80, 70, 55, 0.22));
}

/* Cream smear — behind drops and bottle, fixed relative to bottle */
.cream-hero {
  position: absolute;
  right: 12%;
  top: 400px;
  width: 390px;
  z-index: 3;
}

.cream-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(108, 95, 78, 0.18));
}

.floating-cta {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 150;
  background: var(--dark);
  color: var(--bg);
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  text-transform: uppercase;
  animation: floatIn 1s 1.5s both;
  border: none;
  cursor: pointer;
  font-family: var(--sans);
}

.floating-cta strong {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: 0.95rem;
  text-transform: none;
}

.floating-cta:hover {
  background: var(--forest);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(27, 133, 74, 0.3);
}

@keyframes up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



@media (max-width: 1120px) {
  .hero-content {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .hero-text {
    text-align: center;
    padding: 7rem 2rem 2.4rem;
  }

  .h-sub,
  .h-note {
    margin-left: auto;
    margin-right: auto;
  }

  .h-btns {
    justify-content: center;
  }

  .hero-visual {
    padding: 0;
  }

  .atmo-stage {
    min-height: 360px;
  }

  .drop-plump {
    top: 200px;
    left: 6%;
  }
  .drop-plump .drop-image { width: 60px; }

  .drop-firm {
    top: 140px;
    left: 22%;
  }
  .drop-firm .drop-image { width: 62px; }

  .drop-glow {
    top: 80px;
    left: 38%;
  }
  .drop-glow .drop-image { width: 68px; }

  .bottle-hero {
    right: 14%;
    top: 80px;
    width: 100px;
  }

  .cream-hero {
    right: 14%;
    top: 260px;
    width: 260px;
  }

  .wc-spot-1 { width: 180px; height: 180px; }
  .wc-spot-2 { width: 150px; height: 150px; }
  .wc-spot-3 { width: 160px; height: 160px; }
  .wc-spot-4 { width: 130px; height: 130px; }
}

@media (max-width: 760px) {
  .hero-text {
    padding: 6rem 1.35rem 1.8rem;
  }

  .atmo-stage {
    min-height: 260px;
  }

  .drop-plump {
    top: 140px;
    left: 8%;
  }
  .drop-plump .drop-image { width: 44px; }

  .drop-firm {
    top: 95px;
    left: 26%;
  }
  .drop-firm .drop-image { width: 46px; }

  .drop-glow {
    top: 50px;
    left: 44%;
  }
  .drop-glow .drop-image { width: 50px; }

  .bottle-hero {
    right: 6%;
    top: 55px;
    width: 72px;
  }

  .cream-hero {
    right: 6%;
    top: 165px;
    width: 185px;
  }

  .wc-spot { filter: blur(20px); }
  .wc-spot-1 { width: 120px; height: 120px; }
  .wc-spot-2 { width: 100px; height: 100px; }
  .wc-spot-3 { width: 110px; height: 110px; }
  .wc-spot-4 { width: 90px; height: 90px; }

  .floating-cta {
    right: 0.9rem;
    bottom: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wc-spot,
  .drop-orb,
  .cream-image,
  .bottle-image,
  .pulse,
  .floating-cta {
    animation: none !important;
  }

  .atmo-stage,
  .cream-hero,
  .bottle-hero,
  .drop-orb {
    transition: none !important;
  }
}
</style>
