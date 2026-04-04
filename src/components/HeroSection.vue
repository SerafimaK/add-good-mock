<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

defineEmits(['open-promo'])

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
          Your cream is already good. Add Good makes it work harder. 1–2 presses onto your palm, your moisturizer on top, blend with your fingertip, apply. Choose your booster by what your skin needs right now.
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
          <div class="color-fog" aria-hidden="true">
            <span class="fog fog-glow"></span>
            <span class="fog fog-plump"></span>
            <span class="fog fog-firm"></span>
          </div>

          <div class="ingredient-ghosts" aria-hidden="true">
            <img
              v-for="story in boosters"
              :key="story.id"
              :src="story.ingredient"
              alt=""
              loading="lazy"
              :class="['ingredient', 'ingredient-' + story.id, { 'is-active': focusStoryId === story.id }]"
            >
          </div>

          <div class="drop-cluster" aria-label="Booster drops">
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
              <span class="drop-chip">{{ story.name }}</span>
            </button>
          </div>

          <div class="cream-hero" aria-hidden="true">
            <img src="/cream.png" alt="" class="cream-image" loading="lazy">
          </div>

          <div class="story-row">
            <button
              v-for="story in boosters"
              :key="story.id"
              type="button"
              :class="['story-item', 'story-' + story.id, { 'is-active': focusStoryId === story.id }]"
              @mouseenter="onDropEnter(story.id)"
              @mouseleave="onDropLeave"
              @focus="onDropEnter(story.id)"
              @blur="onDropLeave"
              @click="scrollTo('pb-' + story.id)"
            >
              <span class="story-source">{{ story.source }}</span>
              <span class="story-name">{{ story.name }}</span>
              <span class="story-ingr">{{ story.ingr }}</span>
              <span class="story-mini">{{ story.mini }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button class="floating-cta" @click="$emit('open-promo')">
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
  padding: 6.5rem 2.8rem 3.9rem 1.4rem;
}

.atmo-stage {
  --mx: 0;
  --my: 0;
  width: min(670px, 100%);
  min-height: 600px;
  position: relative;
  isolation: isolate;
  padding: 0.4rem 0.8rem 5.4rem;
}

.atmo-stage::before {
  content: '';
  position: absolute;
  inset: 10% 4% 23%;
  border-radius: 46% 54% 49% 51% / 55% 40% 60% 45%;
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0) 52%),
    radial-gradient(circle at 22% 70%, rgba(208, 224, 202, 0.3), rgba(208, 224, 202, 0) 55%),
    radial-gradient(circle at 73% 64%, rgba(183, 212, 224, 0.3), rgba(183, 212, 224, 0) 56%);
  filter: blur(18px);
  transform: translate3d(calc(var(--mx) * 8px), calc(var(--my) * 8px), 0);
  transition: transform 0.3s ease;
  z-index: 0;
}

.atmo-stage::after {
  content: '';
  position: absolute;
  width: 74%;
  height: 54%;
  left: 11%;
  top: 18%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0));
  filter: blur(30px);
  transform: translate3d(calc(var(--mx) * -12px), calc(var(--my) * -10px), 0);
  transition: transform 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.color-fog {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.fog {
  position: absolute;
  border-radius: 50%;
  filter: blur(20px);
  transform: translate3d(calc(var(--mx) * var(--drift-x, 8px)), calc(var(--my) * var(--drift-y, 7px)), 0);
  transition: transform 0.35s ease, opacity 0.45s ease;
  animation: fogPulse var(--dur, 9s) ease-in-out infinite;
}

.fog-glow {
  width: 320px;
  height: 320px;
  top: 92px;
  left: 8%;
  --drift-x: -16px;
  --drift-y: -8px;
  --dur: 8.6s;
  background: radial-gradient(circle, rgba(222, 188, 126, 0.34), rgba(222, 188, 126, 0));
}

.fog-plump {
  width: 310px;
  height: 310px;
  top: 120px;
  right: 2%;
  --drift-x: 15px;
  --drift-y: -10px;
  --dur: 9.1s;
  background: radial-gradient(circle, rgba(153, 196, 145, 0.29), rgba(153, 196, 145, 0));
}

.fog-firm {
  width: 320px;
  height: 320px;
  bottom: 66px;
  left: 33%;
  --drift-x: 10px;
  --drift-y: 12px;
  --dur: 8.2s;
  background: radial-gradient(circle, rgba(132, 181, 207, 0.3), rgba(132, 181, 207, 0));
}

.focus-glow .fog-glow,
.focus-plump .fog-plump,
.focus-firm .fog-firm {
  opacity: 1;
  filter: blur(18px);
}

.focus-glow .fog:not(.fog-glow),
.focus-plump .fog:not(.fog-plump),
.focus-firm .fog:not(.fog-firm) {
  opacity: 0.76;
}

.ingredient-ghosts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.ingredient {
  --flip: 1;
  --scale: 0.92;
  position: absolute;
  opacity: 0;
  transform: translate3d(calc(var(--mx) * var(--px, 0px)), calc(var(--my) * var(--py, 0px)), 0) scaleX(var(--flip))
    scale(var(--scale));
  transition: opacity 0.45s ease, transform 0.45s ease;
  mix-blend-mode: soft-light;
  filter: saturate(0.86) blur(0.2px);
}

.ingredient-glow {
  --flip: -1;
  width: clamp(148px, 22vw, 220px);
  top: 90px;
  left: 0%;
  --px: -18px;
  --py: -18px;
}

.ingredient-plump {
  width: clamp(136px, 20vw, 194px);
  top: 74px;
  right: 2%;
  --px: 16px;
  --py: -13px;
}

.ingredient-firm {
  width: clamp(136px, 20vw, 206px);
  right: 8%;
  bottom: 104px;
  --px: 18px;
  --py: 14px;
}

.ingredient.is-active {
  --scale: 1;
  opacity: 0.4;
}

.ingredient-plump.is-active {
  opacity: 0.52;
  filter: saturate(1.03) blur(0);
}

.drop-cluster {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translate3d(calc(-50% + var(--mx) * 10px), calc(var(--my) * -6px), 0);
  display: flex;
  align-items: flex-end;
  gap: 5rem;
  z-index: 6;
  transition: transform 0.3s ease;
}

.drop-orb {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: transform 0.32s ease, filter 0.32s ease;
  transform-origin: center bottom;
}

.drop-orb::before {
  content: '';
  position: absolute;
  inset: 17% 22% 22%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0));
  opacity: 0.7;
  pointer-events: none;
}

.drop-image {
  width: clamp(72px, 6.8vw, 94px);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 16px 22px rgba(108, 95, 79, 0.2));
  animation: floatDrop 6.2s ease-in-out infinite;
}

.drop-glow .drop-image {
  animation-delay: 0.1s;
}

.drop-plump .drop-image {
  animation-delay: 0.7s;
}

.drop-firm .drop-image {
  animation-delay: 1.3s;
}

.drop-chip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -14px;
  font-size: 0.56rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(55, 54, 50, 0.72);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  padding: 0.2rem 0.48rem;
  backdrop-filter: blur(5px);
}

.drop-orb:hover,
.drop-orb.is-active,
.drop-orb:focus-visible {
  transform: translateY(32px) scale(1.06) rotate(calc(var(--mx) * 4deg));
}

.drop-glow:hover,
.drop-glow.is-active,
.focus-glow .drop-glow {
  filter: drop-shadow(0 0 12px rgba(227, 186, 109, 0.44));
}

.drop-plump:hover,
.drop-plump.is-active,
.focus-plump .drop-plump {
  filter: drop-shadow(0 0 12px rgba(142, 191, 134, 0.45));
}

.drop-firm:hover,
.drop-firm.is-active,
.focus-firm .drop-firm {
  filter: drop-shadow(0 0 12px rgba(114, 174, 205, 0.48));
}

.cream-hero {
  position: absolute;
  left: 51%;
  bottom: 164px;
  width: min(510px, 96%);
  transform: translate3d(calc(-50% + var(--mx) * -14px), calc(var(--my) * -10px), 0);
  z-index: 5;
  transition: transform 0.32s ease;
}

.cream-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 27px 34px rgba(108, 95, 78, 0.25));
  animation: breathe 7s ease-in-out infinite;
}

.tone-glow {
  border-color: rgba(220, 184, 121, 0.55);
  background: linear-gradient(145deg, rgba(255, 246, 230, 0.52), rgba(255, 255, 255, 0.18));
}

.tone-plump {
  border-color: rgba(149, 193, 143, 0.52);
  background: linear-gradient(145deg, rgba(239, 251, 237, 0.46), rgba(255, 255, 255, 0.17));
}

.tone-firm {
  border-color: rgba(126, 178, 204, 0.56);
  background: linear-gradient(145deg, rgba(235, 245, 251, 0.49), rgba(255, 255, 255, 0.18));
}

.callout-eyebrow {
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(78, 75, 70, 0.74);
  margin-bottom: 0.28rem;
}

.callout-text {
  font-family: var(--serif);
  font-size: 1rem;
  color: rgba(42, 41, 37, 0.9);
  line-height: 1.22;
  margin-bottom: 0;
}

.story-row {
  position: absolute;
  left: 1%;
  right: 1%;
  bottom: 16px;
  display: flex;
  align-items: flex-end;
  gap: 0.55rem;
  z-index: 8;
}

.story-item {
  flex: 1 1 0;
  border: 0;
  cursor: pointer;
  text-align: left;
  padding: 0.68rem 0.68rem 0.7rem;
  border-radius: 0.88rem;
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.16));
  border: 1px solid rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  gap: 0.14rem;
  transition: transform 0.26s ease, border-color 0.26s ease, background 0.26s ease;
}

.story-item:hover,
.story-item:focus-visible,
.story-item.is-active {
  transform: translateY(-2px);
}

.story-item.is-active {
  transform: translateY(-6px) scale(1.07);
  box-shadow: 0 16px 30px rgba(110, 99, 84, 0.15);
}

.story-name {
  font-family: var(--serif);
  font-size: 1rem;
  line-height: 1.1;
  color: rgba(38, 38, 36, 0.92);
}

.story-source {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: rgba(88, 83, 74, 0.74);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: translateY(-4px);
  transition: opacity 0.24s ease, max-height 0.24s ease, transform 0.24s ease;
}

.story-item.is-active .story-source {
  opacity: 1;
  max-height: 1rem;
  transform: translateY(0);
}

.story-mini {
  position: relative;
  padding-top: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  font-size: 0.71rem;
  line-height: 1.34;
  color: rgba(79, 75, 69, 0.86);
  transform: translateY(-4px);
  transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}

.story-mini::before {
  content: '';
  display: block;
  width: 48%;
  height: 1px;
  margin-bottom: 0.24rem;
  background: rgba(92, 85, 75, 0.24);
  opacity: 0;
  transition: opacity 0.24s ease;
}

.story-item.is-active .story-mini {
  padding-top: 0.12rem;
  max-height: 3.5rem;
  opacity: 1;
  transform: translateY(0);
}

.story-item.is-active .story-mini::before {
  opacity: 1;
}

.story-ingr {
  font-size: 0.7rem;
  line-height: 1.28;
  color: rgba(86, 82, 75, 0.88);
}

.story-glow:hover,
.story-glow.is-active {
  border-color: rgba(208, 183, 139, 0.68);
  background: linear-gradient(170deg, rgba(255, 246, 230, 0.56), rgba(255, 255, 255, 0.18));
}

.story-plump:hover,
.story-plump.is-active {
  border-color: rgba(154, 185, 142, 0.68);
  background: linear-gradient(170deg, rgba(240, 250, 239, 0.54), rgba(255, 255, 255, 0.18));
}

.story-firm:hover,
.story-firm.is-active {
  border-color: rgba(132, 178, 197, 0.7);
  background: linear-gradient(170deg, rgba(235, 246, 252, 0.56), rgba(255, 255, 255, 0.18));
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

@keyframes floatDrop {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.024);
  }
}

@keyframes fogPulse {
  0%,
  100% {
    transform: translate3d(calc(var(--mx) * var(--drift-x, 8px)), calc(var(--my) * var(--drift-y, 7px)), 0) scale(1);
  }
  50% {
    transform: translate3d(calc(var(--mx) * var(--drift-x, 8px)), calc(var(--my) * var(--drift-y, 7px)), 0) scale(1.05);
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
    padding: 0 1.2rem 3.2rem;
  }

  .atmo-stage {
    min-height: 560px;
  }

}

@media (max-width: 760px) {
  .hero-text {
    padding: 6rem 1.35rem 1.8rem;
  }

  .atmo-stage {
    min-height: 510px;
    padding: 0.25rem 0.2rem 4.6rem;
  }

  .atmo-stage::before {
    inset: 14% 2% 22%;
    filter: blur(16px);
  }

  .atmo-stage::after {
    width: 88%;
    left: 6%;
    top: 22%;
  }

  .drop-cluster {
    top: 28px;
    gap: 5rem;
    transform: translateX(-50%);
  }

  .drop-orb:hover,
  .drop-orb.is-active,
  .drop-orb:focus-visible {
    transform: translateY(12px) scale(1.03);
  }

  .drop-image {
    width: 56px;
  }

  .drop-chip {
    font-size: 0.52rem;
    letter-spacing: 0.13em;
  }

  .cream-hero {
    bottom: 136px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  .ingredient {
    opacity: 0;
    --scale: 0.9;
    transform: scaleX(var(--flip)) scale(var(--scale));
  }

  .ingredient.is-active {
    --scale: 0.98;
    opacity: 0.2;
  }

  .story-row {
    display: grid;
    align-items: initial;
    grid-template-columns: 1fr;
    gap: 0.45rem;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .story-item {
    padding: 0.64rem;
  }

  .story-item.is-active {
    transform: translateY(-2px) scale(1.02);
  }

  .floating-cta {
    right: 0.9rem;
    bottom: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fog,
  .drop-orb,
  .cream-image,
  .pulse,
  .floating-cta {
    animation: none !important;
  }

  .atmo-stage,
  .drop-cluster,
  .cream-hero,
  .fog,
  .ingredient,
  .story-item,
  .drop-orb {
    transition: none !important;
  }
}
</style>
