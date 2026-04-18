<script setup>
import { reactive, ref, computed, onBeforeUnmount } from 'vue'
import { useCart, BASE_PRICE, BONUS_PRICE } from '../stores/cart.js'
import { BONUSES } from '../data/boosterData.js'
import FlaskComposition from './FlaskComposition.vue'
import IngredientChip from './IngredientChip.vue'

const props = defineProps({
  booster: Object,
  isExpanded: Boolean,
})

const emit = defineEmits(['expand', 'collapse'])

const { add } = useCart()

const selectedBonuses = reactive(new Set())
const storyOpen = ref(false)
const hoveredBonusId = ref(null)
let hoverEnterTimer = null
let hoverLeaveTimer = null

function clearHoverTimers() {
  clearTimeout(hoverEnterTimer)
  clearTimeout(hoverLeaveTimer)
}

function onBonusHover(id) {
  clearHoverTimers()
  hoverEnterTimer = setTimeout(() => {
    hoveredBonusId.value = id
  }, 50)
}

function onBonusLeave() {
  clearHoverTimers()
  hoverLeaveTimer = setTimeout(() => {
    hoveredBonusId.value = null
  }, 80)
}

const price = computed(() => BASE_PRICE + (selectedBonuses.size * BONUS_PRICE))

const formulaString = computed(() => {
  const parts = [props.booster.heroIngredient, props.booster.activeIngredient]
  for (const id of selectedBonuses) {
    parts.push(BONUSES[id].name)
  }
  return parts.join(' + ')
})

function toggleBonus(id) {
  if (selectedBonuses.has(id)) selectedBonuses.delete(id)
  else selectedBonuses.add(id)
}

function addToCart() {
  add(props.booster.id, [...selectedBonuses])
}

function reset() {
  clearHoverTimers()
  selectedBonuses.clear()
  storyOpen.value = false
  hoveredBonusId.value = null
}

function handleCollapse() {
  reset()
  emit('collapse')
}

onBeforeUnmount(() => {
  clearHoverTimers()
})
</script>

<template>
  <article
    :class="['bcard', 'tone-' + booster.id, { expanded: isExpanded }]"
    :style="{
      '--tone-rgb': booster.toneRgb,
      '--tone-ink': booster.toneInk,
      '--btn-text': booster.btnText,
    }"
  >
    <Transition name="swap" mode="out-in">
      <!-- COLLAPSED STATE — editorial / apothecary -->
      <div v-if="!isExpanded" key="collapsed" class="bcard-collapsed" @click="emit('expand')">
        <img class="bcard-watermark" :src="booster.heroImage" alt="" />

        <div class="bcard-meta">
          <span class="bcard-num"><span class="n-sym">№</span> {{ booster.num }}</span>
          <span class="bcard-element">{{ booster.element }}</span>
        </div>

        <h3 class="bcard-name">{{ booster.name }}</h3>
        <div class="bcard-benefit">{{ booster.benefit }}</div>

        <div class="bcard-formula">
          <div class="bcard-formula-label">
            <span>The formula</span>
            <span class="v">base · 2 actives</span>
          </div>
          <div class="bcard-active">
            <span class="idx">01</span>
            <span class="nm">{{ booster.heroIngredient }}</span>
          </div>
          <div class="bcard-active">
            <span class="idx">02</span>
            <span class="nm">{{ booster.activeIngredient }}</span>
          </div>
        </div>

        <p class="bcard-tagline">“{{ booster.tagline }}”</p>

        <div class="bcard-foot">
          <div class="bcard-price">
            <span class="pfx">from</span>
            <span class="val">${{ BASE_PRICE.toFixed(2) }}</span>
          </div>
          <div class="bcard-actions">
            <button class="bcard-customize" @click.stop="emit('expand')">Customize</button>
            <button class="bcard-add" @click.stop="addToCart">
              Add to bag <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- EXPANDED LAB STATE -->
      <div v-else key="expanded" class="lab">
        <div class="lab-topbar">
          <button class="lab-back" @click="handleCollapse">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to The Trio
          </button>
          <div class="lab-breadcrumb">
            <span>The Trio</span><span class="sl">/</span>
            <span><b>{{ booster.name }}</b> — {{ booster.element }}</span><span class="sl">/</span>
            <span>Customize</span>
          </div>
        </div>

        <div class="lab-grid">
          <div class="lab-left">
            <div class="lab-intro">
              <div class="lab-meta-row">
                <span><span class="n-sym">№</span> {{ booster.num }}</span><span>·</span>
                <span class="el">{{ booster.element }}</span>
              </div>
              <h3 class="lab-name">{{ booster.name }}</h3>
              <div class="lab-benefit">{{ booster.benefit }}</div>
              <p class="lab-tagline">“{{ booster.tagline }}”</p>
              <button
                class="lab-story-toggle"
                :class="{ open: storyOpen }"
                @click="storyOpen = !storyOpen"
              >
                {{ storyOpen ? 'Hide the story' : 'Read the story' }}
                <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
                  <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <Transition name="story-slide">
                <div v-if="storyOpen" class="lab-story">
                  <p>{{ booster.story }}</p>
                </div>
              </Transition>
            </div>

            <div>
              <div class="lab-step">
                <span class="lab-step-num">i.</span>
                <span class="lab-step-label">The Base — always included</span>
                <span class="lab-step-hint">immutable</span>
              </div>
              <div class="lab-base">
                <div class="lab-base-title">
                  <span>Core formula · <b>{{ booster.name }}</b></span>
                  <span class="tag">Included</span>
                </div>
                <div class="lab-base-list">
                  <div class="lab-base-row">
                    <span class="idx">01</span>
                    <span class="nm">{{ booster.heroIngredient }}</span>
                  </div>
                  <div class="lab-base-row">
                    <span class="idx">02</span>
                    <span class="nm">{{ booster.activeIngredient }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="lab-step">
                <span class="lab-step-num">ii.</span>
                <span class="lab-step-label">Enhance your formula</span>
                <span class="lab-step-hint">
                  {{ selectedBonuses.size }} of {{ booster.compatibleBonuses.length }} selected
                </span>
              </div>
              <div class="lab-bonuses">
                <IngredientChip
                  v-for="bonusId in booster.compatibleBonuses"
                  :key="bonusId"
                  :ingredient="BONUSES[bonusId]"
                  :selected="selectedBonuses.has(bonusId)"
                  :tone-rgb="booster.toneRgb"
                  @toggle="toggleBonus(bonusId)"
                  @mouseenter="onBonusHover(bonusId)"
                  @mouseleave="onBonusLeave"
                />
              </div>
            </div>
          </div>

          <div class="lab-right">
            <div class="lab-stage">
              <div class="flask-wrap">
                <FlaskComposition
                  :booster-id="booster.id"
                  :booster-color="booster.toneRgb"
                  :hero-image="booster.heroImage"
                  :selected-bonuses="[...selectedBonuses]"
                  :hovered-bonus="hoveredBonusId"
                  :red-gold-active="false"
                />
              </div>
            </div>

            <div class="lab-readout">
              <div class="readout-label">
                <span>Your formula</span>
                <span><b>{{ 2 + selectedBonuses.size }}</b> actives · batch {{ booster.num }}</span>
              </div>
              <div class="readout-formula">{{ formulaString }}</div>
              <div class="readout-foot">
                <div class="readout-price">
                  <span class="cur">${{ price.toFixed(2) }}</span>
                  <span v-if="selectedBonuses.size > 0" class="delta">
                    + {{ selectedBonuses.size }} upgrade{{ selectedBonuses.size > 1 ? 's' : '' }}
                  </span>
                </div>
                <button class="btn-add" @click="addToCart">
                  Add to bag <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<style scoped>
/* =======================================================
   SHARED CARD SHELL
   ======================================================= */
.bcard {
  --tone-rgb: 180, 180, 180;
  --tone-ink: #555;
  --btn-text: #444;
  --hair: rgba(21, 18, 16, 0.08);
  --hair-2: rgba(21, 18, 16, 0.04);

  position: relative;
  background: linear-gradient(165deg, rgba(255, 253, 248, 0.92), rgba(255, 253, 248, 0.64));
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow:
    0 20px 46px -18px rgba(80, 60, 30, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  transition: transform 0.45s var(--ease-out), box-shadow 0.45s var(--ease-out), border-color 0.3s ease;
}

.bcard.expanded {
  overflow: visible;
  border-radius: 2rem;
}

/* Watercolor wash (only visible in collapsed) */
.bcard::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -30%;
  width: 90%;
  height: 90%;
  background: radial-gradient(circle at center, rgba(var(--tone-rgb), 0.42), rgba(var(--tone-rgb), 0.14) 55%, transparent 72%);
  filter: blur(28px);
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.6s var(--ease-out);
  z-index: 0;
}
.bcard::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -28%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle at center, rgba(var(--tone-rgb), 0.28), transparent 68%);
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
}
.bcard.expanded::before,
.bcard.expanded::after { opacity: 0.55; }

/* =======================================================
   COLLAPSED — editorial apothecary
   ======================================================= */
.bcard-collapsed {
  position: relative;
  padding: 1.5rem 1.4rem 1.3rem;
  display: flex;
  flex-direction: column;
  min-height: 520px;
  cursor: pointer;
  z-index: 1;
}

.bcard:not(.expanded):hover {
  transform: translateY(-6px);
  border-color: rgba(var(--tone-rgb), 0.38);
  box-shadow:
    0 32px 64px -24px rgba(80, 60, 30, 0.28),
    0 0 0 1px rgba(var(--tone-rgb), 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.bcard:not(.expanded):hover .bcard-watermark {
  transform: translate(2%, -2%) rotate(-1.5deg) scale(1.04);
  opacity: 0.3;
}

.bcard-watermark {
  position: absolute;
  bottom: -8%;
  right: -12%;
  width: 62%;
  opacity: 0.22;
  pointer-events: none;
  mix-blend-mode: multiply;
  transition: transform 0.8s var(--ease-out), opacity 0.4s ease;
  z-index: 1;
}

.bcard-meta {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--sans);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lt);
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}
.bcard-meta-sep {
  color: var(--lt);
  font-weight: 400;
  letter-spacing: 0;
}

.bcard-num {
  font-family: var(--sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lt);
  line-height: 1;
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
}
.bcard-num .n-sym {
  font-family: var(--serif);
  font-style: italic;
  font-size: 0.95rem;
  letter-spacing: 0;
  color: var(--tone-ink);
  text-transform: none;
  font-weight: 400;
  line-height: 1;
}

.bcard-element {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  font-weight: 700;
  color: var(--tone-ink);
}

.bcard-name {
  font-family: var(--serif);
  font-size: clamp(2.1rem, 3vw, 2.8rem);
  line-height: 0.94;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin-bottom: 0.3rem;
  position: relative;
  z-index: 2;
}

.bcard-benefit {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.04rem;
  color: var(--tone-ink);
  line-height: 1.3;
  margin-bottom: 1.2rem;
  position: relative;
  z-index: 2;
}

.bcard-formula {
  position: relative;
  z-index: 2;
  margin-bottom: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--hair);
}

.bcard-formula-label {
  font-family: var(--sans);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lt);
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bcard-formula-label .v { color: rgba(21, 18, 16, 0.32); }

.bcard-active {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.3rem 0;
  font-size: 0.9rem;
}

.bcard-active .idx {
  font-family: var(--sans);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--lt);
  width: 14px;
  flex-shrink: 0;
}

.bcard-active .nm {
  color: var(--dark);
  font-weight: 500;
}

.bcard-tagline {
  font-family: var(--serif);
  font-style: italic;
  font-size: 0.98rem;
  color: var(--mid);
  line-height: 1.4;
  position: relative;
  z-index: 2;
  padding-left: 0.8rem;
  border-left: 2px solid rgba(var(--tone-rgb), 0.6);
  margin-bottom: 1.2rem;
}

.bcard-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--hair);
  position: relative;
  z-index: 2;
}

.bcard-price {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}
.bcard-price .pfx {
  font-family: var(--sans);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lt);
}
.bcard-price .val {
  font-family: var(--serif);
  font-size: 1.7rem;
  font-style: italic;
  color: var(--dark);
  line-height: 1;
}

.bcard-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.bcard-customize {
  border: none;
  background: none;
  font-family: var(--sans);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mid);
  cursor: pointer;
  padding: 0.45rem 0.2rem;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: rgba(21, 18, 16, 0.18);
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}
.bcard-customize:hover {
  color: var(--dark);
  text-decoration-color: var(--dark);
}

.bcard-add {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.72rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--dark);
  background: var(--dark);
  color: var(--bg);
  font-family: var(--sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.bcard-add:hover {
  background: var(--tone-ink);
  border-color: var(--tone-ink);
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -8px rgba(var(--tone-rgb), 0.7);
}
.bcard-add .arrow {
  transition: transform 0.3s var(--ease-out);
  display: inline-block;
}
.bcard:not(.expanded):hover .bcard-add .arrow { transform: translateX(3px); }

/* =======================================================
   EXPANDED — Lab
   ======================================================= */
.lab {
  position: relative;
  display: block;
}

.lab-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.6rem;
  border-bottom: 1px solid var(--hair);
  position: relative;
  z-index: 5;
  gap: 1rem;
}

.lab-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-family: var(--sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mid);
  cursor: pointer;
  padding: 0;
}
.lab-back:hover { color: var(--dark); }

.lab-breadcrumb {
  font-family: var(--sans);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--lt);
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.lab-breadcrumb b { color: var(--tone-ink); font-weight: 600; }
.lab-breadcrumb .sl { color: var(--lt); }

.lab-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  min-height: 620px;
  position: relative;
}

.lab-left {
  padding: 1.8rem 1.8rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  position: relative;
  z-index: 2;
}

.lab-intro {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.lab-meta-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lt);
  margin-bottom: 0.4rem;
}
.lab-meta-row .el { color: var(--tone-ink); }
.lab-meta-row .n-sym {
  font-family: var(--serif);
  font-style: italic;
  font-size: 0.95rem;
  letter-spacing: 0;
  color: var(--tone-ink);
  text-transform: none;
  font-weight: 400;
  line-height: 1;
}

.lab-name {
  font-family: var(--serif);
  font-size: clamp(2.2rem, 3.4vw, 3rem);
  font-weight: 400;
  line-height: 0.94;
  letter-spacing: -0.015em;
}

.lab-benefit {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--tone-ink);
  margin-top: 0.2rem;
}

.lab-tagline {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--mid);
  line-height: 1.45;
  padding: 0.7rem 0 0.2rem;
  border-top: 1px solid var(--hair);
  margin-top: 0.5rem;
}

.lab-story-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  font-family: var(--sans);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mid);
  cursor: pointer;
  padding: 0.3rem 0;
  align-self: flex-start;
}
.lab-story-toggle:hover { color: var(--dark); }
.lab-story-toggle svg { transition: transform 0.3s var(--ease-out); }
.lab-story-toggle.open svg { transform: rotate(180deg); }

.lab-story {
  margin-top: 0.4rem;
  font-family: var(--serif);
  font-size: 1rem;
  line-height: 1.55;
  color: var(--mid);
  border-left: 2px solid rgba(var(--tone-rgb), 0.55);
  padding: 0.2rem 0 0.2rem 1rem;
}
.lab-story p { margin: 0; }

/* Step labels */
.lab-step {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}
.lab-step-num {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.3rem;
  color: var(--tone-ink);
  line-height: 1;
  min-width: 24px;
}
.lab-step-label {
  font-family: var(--sans);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mid);
}
.lab-step-hint {
  font-size: 0.72rem;
  color: var(--lt);
  margin-left: auto;
  font-family: var(--sans);
  letter-spacing: 0.04em;
}

/* Base formula box */
.lab-base {
  background: linear-gradient(165deg, rgba(var(--tone-rgb), 0.12), rgba(255, 253, 248, 0.5));
  border: 1px solid rgba(var(--tone-rgb), 0.3);
  border-radius: 1rem;
  padding: 0.95rem 1.05rem;
}

.lab-base-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--sans);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mid);
  margin-bottom: 0.6rem;
}
.lab-base-title b { color: var(--tone-ink); font-weight: 700; }
.lab-base-title .tag {
  background: rgba(var(--tone-rgb), 0.25);
  border: 1px solid rgba(var(--tone-rgb), 0.4);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  color: var(--tone-ink);
  font-size: 0.58rem;
  letter-spacing: 0.14em;
}

.lab-base-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.lab-base-row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 0.7rem;
  align-items: baseline;
  font-size: 0.92rem;
}
.lab-base-row .idx {
  font-family: var(--sans);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--lt);
}
.lab-base-row .nm { color: var(--dark); font-weight: 500; }

.lab-bonuses {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Right column */
.lab-right {
  position: relative;
  background:
    radial-gradient(circle at 50% 40%, rgba(var(--tone-rgb), 0.28), rgba(var(--tone-rgb), 0.05) 55%, transparent 78%),
    linear-gradient(160deg, rgba(255, 253, 248, 0.3), rgba(var(--tone-rgb), 0.08));
  border-left: 1px solid var(--hair);
  border-radius: 0 2rem 2rem 0;
  overflow: hidden;
  padding: 1.8rem 1.8rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 2;
}

.lab-stage {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
}
.flask-wrap {
  position: relative;
  width: 100%;
  max-width: 360px;
}

.lab-readout {
  padding: 1.1rem;
  background: rgba(255, 253, 248, 0.64);
  border: 1px solid var(--hair);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
}
.readout-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--sans);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lt);
  margin-bottom: 0.6rem;
}
.readout-label b { color: var(--tone-ink); font-weight: 700; }

.readout-formula {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.4;
  color: var(--dark);
}

.readout-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px dashed var(--hair);
}
.readout-price {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
}
.readout-price .cur {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.9rem;
  color: var(--dark);
  line-height: 1;
  letter-spacing: -0.01em;
}
.readout-price .delta {
  font-family: var(--sans);
  font-size: 0.68rem;
  color: var(--tone-ink);
  letter-spacing: 0.06em;
  font-weight: 600;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid var(--dark);
  background: var(--dark);
  color: var(--bg);
  border-radius: 999px;
  padding: 0.78rem 1.3rem;
  font-family: var(--sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.btn-add:hover {
  background: var(--tone-ink);
  border-color: var(--tone-ink);
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -8px rgba(var(--tone-rgb), 0.7);
}

/* story slide transition */
.story-slide-enter-active { transition: all 0.3s var(--ease-out); }
.story-slide-leave-active { transition: all 0.2s ease; }
.story-slide-enter-from,
.story-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.story-slide-enter-to,
.story-slide-leave-from { max-height: 260px; }

/* Swap transition */
.swap-enter-active {
  transition: all 0.4s var(--ease-out);
  transition-delay: 0.05s;
}
.swap-leave-active { transition: all 0.25s ease; }
.swap-enter-from { opacity: 0; transform: translateY(16px); }
.swap-leave-to { opacity: 0; transform: translateY(-10px); }

/* Responsive */
@media (max-width: 980px) {
  .lab-grid { grid-template-columns: 1fr; min-height: 0; }
  .lab-right {
    border-left: none;
    border-top: 1px solid var(--hair);
    border-radius: 0 0 2rem 2rem;
    min-height: 460px;
  }
  .lab-breadcrumb { display: none; }
}

@media (max-width: 760px) {
  .bcard-collapsed { min-height: 480px; padding: 1.3rem 1.2rem 1.1rem; }
  .lab-topbar { padding: 0.85rem 1.1rem; }
  .lab-left { padding: 1.4rem 1.2rem 1rem; gap: 1.1rem; }
  .lab-right { padding: 1.4rem 1.2rem 1.2rem; }
  .readout-foot { flex-direction: column; align-items: stretch; }
  .btn-add { justify-content: center; }
}
</style>
