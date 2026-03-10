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
    <span class="flask-spot flask-spot-coral" :class="{ active: redGoldActive }"></span>
    <span class="flask-spot flask-spot-coral spot-b" :class="{ active: redGoldActive }"></span>
    <!-- Bokeh orbs -->
    <span class="flask-bokeh bokeh-1" :class="{ coral: redGoldActive }"></span>
    <span class="flask-bokeh bokeh-2" :class="{ coral: redGoldActive }"></span>
    <span class="flask-bokeh bokeh-3" :class="{ coral: redGoldActive }"></span>

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
  width: 340px;
  height: 380px;
  flex-shrink: 0;
}

/* Layer 1: Color spots — bold & spread */
.flask-spot {
  position: absolute;
  border-radius: 50%;
  filter: blur(28px);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.8s ease;
}

.flask-spot-base {
  width: 220px;
  height: 220px;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background:
    radial-gradient(circle at 35% 40%, rgba(var(--spot-rgb), 0.6), rgba(var(--spot-rgb), 0.15) 55%, transparent 75%),
    radial-gradient(circle at 68% 60%, rgba(var(--spot-rgb), 0.4), transparent 60%);
  opacity: 0.9;
  animation: spotPulse 6s ease-in-out infinite;
}

.flask-spot-base.spot-b {
  width: 180px;
  height: 180px;
  bottom: auto;
  top: 10%;
  left: 60%;
  background: radial-gradient(circle at 50% 50%, rgba(var(--spot-rgb), 0.4), transparent 65%);
  animation: spotPulse 8s ease-in-out 2s infinite;
}

.flask-spot-base.dim {
  opacity: 0.2;
}

.flask-spot-coral {
  width: 230px;
  height: 230px;
  bottom: 5px;
  left: 48%;
  transform: translateX(-50%);
  background:
    radial-gradient(circle at 40% 45%, rgba(212, 83, 75, 0.55), rgba(212, 83, 75, 0.12) 55%, transparent 75%),
    radial-gradient(circle at 65% 55%, rgba(230, 130, 120, 0.35), transparent 60%);
  opacity: 0;
  animation: spotPulse 7s ease-in-out 1s infinite;
}

.flask-spot-coral.spot-b {
  width: 170px;
  height: 170px;
  bottom: auto;
  top: 8%;
  left: 55%;
  background: radial-gradient(circle at 50% 50%, rgba(230, 120, 110, 0.35), transparent 60%);
  animation: spotPulse 9s ease-in-out 3s infinite;
}

.flask-spot-coral.active {
  opacity: 1;
}

@keyframes spotPulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: var(--pulse-base, 0.9); }
  50% { transform: translateX(-50%) scale(1.08); opacity: var(--pulse-peak, 1); }
}

.flask-spot-base.spot-b,
.flask-spot-coral.spot-b {
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
}

.bokeh-1 {
  width: 24px;
  height: 24px;
  top: 22%;
  left: 12%;
  background: rgba(var(--spot-rgb), 0.25);
  filter: blur(6px);
  animation: bokehFloat 7s ease-in-out infinite;
}
.bokeh-1.coral { background: rgba(212, 83, 75, 0.2); }

.bokeh-2 {
  width: 16px;
  height: 16px;
  top: 55%;
  right: 8%;
  background: rgba(var(--spot-rgb), 0.3);
  filter: blur(4px);
  animation: bokehFloat 9s ease-in-out 2s infinite;
}
.bokeh-2.coral { background: rgba(230, 130, 120, 0.25); }

.bokeh-3 {
  width: 20px;
  height: 20px;
  bottom: 25%;
  left: 20%;
  background: rgba(var(--spot-rgb), 0.2);
  filter: blur(5px);
  animation: bokehFloat 8s ease-in-out 4s infinite;
}
.bokeh-3.coral { background: rgba(212, 83, 75, 0.18); }

@keyframes bokehFloat {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  33% { transform: translate(4px, -6px) scale(1.15); opacity: 0.9; }
  66% { transform: translate(-3px, 3px) scale(0.9); opacity: 0.5; }
}

/* Layer 2: Hero ingredient */
.flask-hero {
  position: absolute;
  width: 58%;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%);
  z-index: 2;
  opacity: 0.88;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Layer 3: Flask — 20% more transparent (was 0.8, now 0.6) */
.flask-vessel {
  position: absolute;
  width: 78%;
  left: 50%;
  bottom: 4%;
  transform: translateX(-50%);
  z-index: 3;
  opacity: 0.6;
  pointer-events: none;
}

/* Layer 4: Bonus ingredients */
.flask-bonus {
  position: absolute;
  mix-blend-mode: multiply;
  filter: saturate(0.7);
  z-index: 4;
  pointer-events: none;
  transition: opacity 0.6s var(--ease-out);
}

/* Ghost state: visible on hover, semi-transparent, fades in with delay */
.flask-bonus.bonus-ghost {
  opacity: 0.3;
  filter: saturate(0.4);
}

/* Selected state: fully opaque */
.flask-bonus.bonus-selected {
  opacity: 0.85;
  filter: saturate(0.8);
}

/* Layer 5: Red Gold splash */
.flask-redgold {
  position: absolute;
  width: 48%;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.38;
  mix-blend-mode: multiply;
  z-index: 5;
  pointer-events: none;
}

/* Ingredient float transition */
.ing-float-enter-active {
  transition: all 0.6s var(--ease-out);
}
.ing-float-leave-active {
  transition: all 0.5s ease-in;
}
.ing-float-enter-from {
  opacity: 0 !important;
  transform: translateY(14px) scale(0.85);
}
.ing-float-leave-to {
  opacity: 0 !important;
  transform: translateY(-8px) scale(0.9);
}

@media (max-width: 760px) {
  .flask-wrap {
    width: 260px;
    height: 300px;
  }
}
</style>
