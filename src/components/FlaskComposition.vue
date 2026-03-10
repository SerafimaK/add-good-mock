<script setup>
import { computed } from 'vue'
import { BONUSES, BONUS_POSITIONS, RED_GOLD } from '../data/boosterData.js'

const props = defineProps({
  boosterId: String,
  boosterColor: String,
  heroImage: String,
  selectedBonuses: Array,
  hoveredBonus: String,
  redGoldActive: Boolean,
})

const spotStyle = computed(() => ({
  '--spot-rgb': props.boosterColor,
}))

// Show bonus if selected OR hovered
const visibleBonusIds = computed(() => {
  const ids = new Set(props.selectedBonuses)
  if (props.hoveredBonus && !ids.has(props.hoveredBonus)) {
    ids.add(props.hoveredBonus)
  }
  return [...ids]
})

const visibleBonuses = computed(() =>
  visibleBonusIds.value.map(id => ({
    ...BONUSES[id],
    pos: BONUS_POSITIONS[id] || {},
    isSelected: props.selectedBonuses.includes(id),
    isHovered: id === props.hoveredBonus && !props.selectedBonuses.includes(id),
  }))
)
</script>

<template>
  <div class="flask-wrap" :style="spotStyle">
    <!-- Layer 1: Watercolor color spots — bold, with bokeh and pulse -->
    <span class="flask-spot flask-spot-base" :class="{ dim: redGoldActive }"></span>
    <span class="flask-spot flask-spot-base spot-b" :class="{ dim: redGoldActive }"></span>
    <span class="flask-spot flask-spot-base spot-c" :class="{ dim: redGoldActive }"></span>
    <span class="flask-spot flask-spot-coral" :class="{ active: redGoldActive }"></span>
    <span class="flask-spot flask-spot-coral spot-b" :class="{ active: redGoldActive }"></span>
    <span class="flask-spot flask-spot-coral spot-c" :class="{ active: redGoldActive }"></span>
    <!-- Bokeh orbs -->
    <span class="flask-bokeh bokeh-1" :class="{ coral: redGoldActive }"></span>
    <span class="flask-bokeh bokeh-2" :class="{ coral: redGoldActive }"></span>
    <span class="flask-bokeh bokeh-3" :class="{ coral: redGoldActive }"></span>
    <span class="flask-bokeh bokeh-4" :class="{ coral: redGoldActive }"></span>

    <!-- Layer 2: Hero ingredient -->
    <img :src="heroImage" alt="" class="flask-hero" loading="lazy">

    <!-- Layer 3: Flask vessel -->
    <img src="/lines_no_background/empty-flask.png" alt="" class="flask-vessel" loading="lazy">

    <!-- Layer 4: Bonus ingredients — show on hover (ghost) or selected (opaque) -->
    <TransitionGroup name="ing-float">
      <img
        v-for="bonus in visibleBonuses"
        :key="bonus.id"
        :src="bonus.image"
        :alt="bonus.nickname"
        class="flask-bonus"
        :class="{ 'bonus-selected': bonus.isSelected, 'bonus-ghost': bonus.isHovered }"
        :style="bonus.pos"
        loading="lazy"
      >
    </TransitionGroup>

    <!-- Layer 5: Red Gold splash -->
    <Transition name="ing-float">
      <img
        v-if="redGoldActive"
        :src="RED_GOLD.image"
        alt="Red Gold"
        class="flask-redgold"
        loading="lazy"
      >
    </Transition>
  </div>
</template>

<style scoped>
.flask-wrap {
  position: relative;
  width: 430px;
  height: 480px;
  flex-shrink: 0;
}

/* Layer 1: Color spots — bold & spread */
.flask-spot {
  --spot-transform: translate3d(0, 0, 0);
  --pulse-scale: 1.12;
  position: absolute;
  border-radius: 50%;
  filter: blur(38px);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.8s ease;
  will-change: transform, opacity;
}

.flask-spot-base {
  --spot-transform: translateX(-50%);
  width: 320px;
  height: 320px;
  bottom: -18px;
  left: 50%;
  background:
    radial-gradient(circle at 36% 42%, rgba(var(--spot-rgb), 0.72), rgba(var(--spot-rgb), 0.2) 58%, transparent 80%),
    radial-gradient(circle at 66% 60%, rgba(var(--spot-rgb), 0.46), transparent 65%);
  opacity: 0.98;
  animation: spotPulse 6s ease-in-out infinite;
}

.flask-spot-base.spot-b {
  --spot-transform: translateX(-50%);
  width: 260px;
  height: 260px;
  bottom: auto;
  top: -5%;
  left: 72%;
  background: radial-gradient(circle at 50% 50%, rgba(var(--spot-rgb), 0.42), transparent 68%);
  animation: spotPulse 8s ease-in-out 2s infinite;
}

.flask-spot-base.spot-c {
  width: 240px;
  height: 240px;
  bottom: 18%;
  left: -10%;
  background: radial-gradient(circle at 50% 50%, rgba(var(--spot-rgb), 0.34), transparent 68%);
  animation: spotPulse 7.2s ease-in-out 1.2s infinite;
}

.flask-spot-base.dim {
  opacity: 0.2;
}

.flask-spot-coral {
  --spot-transform: translateX(-50%);
  width: 330px;
  height: 330px;
  bottom: -20px;
  left: 50%;
  background:
    radial-gradient(circle at 40% 45%, rgba(212, 83, 75, 0.62), rgba(212, 83, 75, 0.16) 58%, transparent 80%),
    radial-gradient(circle at 65% 56%, rgba(230, 130, 120, 0.4), transparent 62%);
  opacity: 0;
  animation: spotPulse 7s ease-in-out 1s infinite;
}

.flask-spot-coral.spot-b {
  --spot-transform: translateX(-50%);
  width: 240px;
  height: 240px;
  bottom: auto;
  top: -8%;
  left: 66%;
  background: radial-gradient(circle at 50% 50%, rgba(230, 120, 110, 0.42), transparent 64%);
  animation: spotPulse 9s ease-in-out 3s infinite;
}

.flask-spot-coral.spot-c {
  width: 220px;
  height: 220px;
  bottom: 20%;
  right: -6%;
  left: auto;
  background: radial-gradient(circle at 50% 50%, rgba(212, 83, 75, 0.32), transparent 66%);
  animation: spotPulse 8.4s ease-in-out 2.2s infinite;
}

.flask-spot-coral.active {
  opacity: 1;
}

@keyframes spotPulse {
  0%, 100% {
    transform: var(--spot-transform) scale(1);
    opacity: var(--pulse-base, 0.9);
  }
  50% {
    transform: var(--spot-transform) scale(var(--pulse-scale, 1.08));
    opacity: var(--pulse-peak, 1);
  }
}

.flask-spot-base.spot-b,
.flask-spot-coral.spot-b,
.flask-spot-base.spot-c,
.flask-spot-coral.spot-c {
  --pulse-base: 0.7;
  --pulse-peak: 0.9;
}

/* Bokeh orbs */
.flask-bokeh {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  transition: background 0.8s ease;
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

.bokeh-1 {
  width: 52px;
  height: 52px;
  top: 17%;
  left: 2%;
  background: rgba(var(--spot-rgb), 0.26);
  filter: blur(11px);
  animation: bokehFloat 7s ease-in-out infinite, bokehPulse 4.2s ease-in-out infinite;
}
.bokeh-1.coral { background: rgba(212, 83, 75, 0.24); }

.bokeh-2 {
  width: 34px;
  height: 34px;
  top: 54%;
  right: 2%;
  background: rgba(var(--spot-rgb), 0.31);
  filter: blur(8px);
  animation: bokehFloat 9s ease-in-out 2s infinite, bokehPulse 5.4s ease-in-out 0.8s infinite;
}
.bokeh-2.coral { background: rgba(230, 130, 120, 0.28); }

.bokeh-3 {
  width: 44px;
  height: 44px;
  bottom: 18%;
  left: 17%;
  background: rgba(var(--spot-rgb), 0.22);
  filter: blur(10px);
  animation: bokehFloat 8s ease-in-out 4s infinite, bokehPulse 6s ease-in-out 2s infinite;
}
.bokeh-3.coral { background: rgba(212, 83, 75, 0.2); }

.bokeh-4 {
  width: 26px;
  height: 26px;
  top: 6%;
  right: 23%;
  background: rgba(var(--spot-rgb), 0.2);
  filter: blur(6px);
  animation: bokehFloat 6.8s ease-in-out 1.5s infinite, bokehPulse 4.7s ease-in-out 1.3s infinite;
}
.bokeh-4.coral { background: rgba(230, 130, 120, 0.23); }

@keyframes bokehFloat {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.58; }
  33% { transform: translate(7px, -8px) scale(1.16); opacity: 0.9; }
  66% { transform: translate(-6px, 4px) scale(0.92); opacity: 0.52; }
}

@keyframes bokehPulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.82; }
}

/* Layer 2: Hero ingredient */
.flask-hero {
  position: absolute;
  width: 62%;
  left: 52%;
  bottom: 11%;
  transform: translateX(-50%);
  z-index: 2;
  opacity: 0.86;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Layer 3: Flask vessel */
.flask-vessel {
  position: absolute;
  width: 84%;
  left: 52%;
  bottom: 2%;
  transform: translateX(-50%);
  z-index: 3;
  opacity: 0.64;
  pointer-events: none;
}

/* Layer 4: Bonus ingredients */
.flask-bonus {
  position: absolute;
  mix-blend-mode: multiply;
  filter: saturate(0.7);
  z-index: 4;
  pointer-events: none;
  transition:
    opacity 0.52s var(--ease-out),
    filter 0.52s ease,
    transform 0.52s var(--ease-out);
}

/* Ghost state: visible on hover, semi-transparent, fades in with delay */
.flask-bonus.bonus-ghost {
  opacity: 0.34;
  filter: saturate(0.45);
}

/* Selected state: fully opaque */
.flask-bonus.bonus-selected {
  opacity: 1;
  filter: saturate(1) contrast(1.04);
}

/* Layer 5: Red Gold splash */
.flask-redgold {
  position: absolute;
  width: 48%;
  top: 9%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.44;
  mix-blend-mode: multiply;
  z-index: 5;
  pointer-events: none;
}

/* Ingredient float transition */
.ing-float-enter-active {
  transition:
    opacity 0.56s var(--ease-out) 0.12s,
    transform 0.6s var(--ease-out) 0.12s,
    filter 0.56s ease 0.12s;
}
.ing-float-leave-active {
  transition:
    opacity 0.52s ease-in 0.18s,
    transform 0.52s ease-in 0.18s,
    filter 0.4s ease-in 0.18s;
}
.ing-float-enter-from {
  opacity: 0 !important;
  transform: translateY(16px) scale(0.84);
  filter: saturate(0.3);
}
.ing-float-leave-to {
  opacity: 0 !important;
  transform: translateY(-10px) scale(0.9);
  filter: saturate(0.25);
}

@media (max-width: 760px) {
  .flask-wrap {
    width: 300px;
    height: 340px;
  }
}
</style>
