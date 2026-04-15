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
const expandedIngredientId = ref(null)
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

function toggleStory(id) {
  expandedIngredientId.value = expandedIngredientId.value === id ? null : id
}

function addToCart() {
  add(props.booster.id, [...selectedBonuses])
}

function addAsIs() {
  add(props.booster.id)
}

function reset() {
  clearHoverTimers()
  selectedBonuses.clear()
  expandedIngredientId.value = null
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
    :class="['card', 'tone-' + booster.id, { expanded: isExpanded }]"
    :style="{
      '--tone-rgb': booster.toneRgb,
      '--tone-ink': booster.toneInk,
      '--btn-text': booster.btnText,
    }"
  >
    <Transition name="swap" mode="out-in">
      <!-- COLLAPSED STATE -->
      <div v-if="!isExpanded" key="collapsed" class="card-collapsed">
        <div class="card-top" @click="emit('expand')">
          <div class="card-meta">
            <span class="card-num">{{ booster.num }}</span>
            <span class="card-element">{{ booster.element }}</span>
          </div>

          <div class="card-icon-wrap">
            <img :src="booster.icon" :alt="booster.name" class="card-icon">
          </div>

          <h3 class="card-name">{{ booster.name }}</h3>
          <p class="card-benefit">{{ booster.benefit }}</p>

          <p class="card-tagline">{{ booster.tagline }}</p>
        </div>

        <div class="card-actions">
          <span class="card-price">from ${{ BASE_PRICE.toFixed(2) }}</span>
          <div class="card-btns">
            <button class="btn-customize" @click="emit('expand')">Customize</button>
            <button class="btn-asis" @click.stop="addAsIs">Add as-is</button>
          </div>
        </div>
      </div>

      <!-- EXPANDED LAB STATE -->
      <div v-else key="expanded" class="card-lab">
        <!-- Flask floats to the right as a background-like element -->
        <div class="lab-flask-bg">
          <FlaskComposition
            :booster-id="booster.id"
            :booster-color="booster.toneRgb"
            :hero-image="booster.heroImage"
            :selected-bonuses="[...selectedBonuses]"
            :hovered-bonus="hoveredBonusId"
            :red-gold-active="false"
          />
        </div>

        <div class="lab-content">
          <button class="lab-back" @click="handleCollapse">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to boosters
          </button>

          <div class="lab-intro">
            <div class="card-meta">
              <span class="card-num">{{ booster.num }}</span>
              <span class="card-element">{{ booster.element }}</span>
            </div>
            <h3 class="card-name">{{ booster.name }}</h3>
            <p class="card-benefit">{{ booster.benefit }}</p>
            <div class="lab-tagline-row">
              <p class="card-tagline">{{ booster.tagline }}</p>
              <button class="btn-the-story" :class="{ open: storyOpen }" @click="storyOpen = !storyOpen">
                <span class="btn-the-story-label">{{ storyOpen ? 'Hide' : 'The story' }}</span>
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <Transition name="story-slide">
              <div v-if="storyOpen" class="lab-story">
                <p>{{ booster.story }}</p>
              </div>
            </Transition>
          </div>

          <div class="lab-section">
            <span class="lab-label">Enhance your formula</span>
            <div class="lab-chips">
              <IngredientChip
                v-for="bonusId in booster.compatibleBonuses"
                :key="bonusId"
                :ingredient="BONUSES[bonusId]"
                :selected="selectedBonuses.has(bonusId)"
                :story-open="expandedIngredientId === bonusId"
                :tone-rgb="booster.toneRgb"
                @toggle="toggleBonus(bonusId)"
                @toggle-story="toggleStory(bonusId)"
                @mouseenter="onBonusHover(bonusId)"
                @mouseleave="onBonusLeave"
              />
            </div>
          </div>

          <div class="lab-summary">
            <span class="lab-summary-label">Your formula</span>
            <p class="lab-formula">{{ formulaString }}</p>
          </div>

          <div class="lab-action">
            <span class="lab-price">${{ price.toFixed(2) }}</span>
            <button class="btn-add" @click="addToCart">Add to bag</button>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<style scoped>
.card {
  --tone-rgb: 180, 180, 180;
  --tone-ink: #555;
  --btn-text: #444;
  border-radius: 2rem;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.56);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.36));
  box-shadow:
    0 14px 38px rgba(123, 109, 90, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
  transition:
    transform 0.42s var(--ease-out),
    box-shadow 0.42s var(--ease-out),
    border-color 0.35s ease;
}

.card.expanded {
  overflow: visible;
}

.card:not(.expanded):hover {
  transform: translateY(-6px);
  box-shadow:
    0 24px 52px rgba(112, 98, 82, 0.2),
    0 0 0 1px rgba(var(--tone-rgb), 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  border-color: rgba(var(--tone-rgb), 0.34);
}

/* COLLAPSED STATE */
.card-collapsed {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-top {
  flex: 1;
  cursor: pointer;
  padding: 0.4rem 0.4rem 0;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
}

.card-num {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(73, 67, 58, 0.5);
}

.card-element {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(73, 67, 58, 0.5);
}

.card-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--tone-rgb), 0.2), rgba(var(--tone-rgb), 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.7rem;
}

.card-icon {
  width: 34px;
  height: 34px;
  opacity: 0.7;
  mix-blend-mode: multiply;
}

.card-name {
  font-family: var(--serif);
  font-size: clamp(1.7rem, 2.3vw, 2.1rem);
  line-height: 0.98;
  font-weight: 400;
  margin-bottom: 0.35rem;
}

.card-benefit {
  font-family: var(--sans);
  font-size: 0.84rem;
  color: rgba(73, 67, 58, 0.82);
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.card-actives {
  font-size: 0.86rem;
  color: rgba(70, 65, 58, 0.86);
  line-height: 1.52;
  margin-bottom: 0.5rem;
}

.card-actives span {
  display: block;
  margin-bottom: 0.12rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.68rem;
  font-weight: 700;
  color: rgba(73, 67, 58, 0.5);
}

.card-tagline {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.12rem;
  color: var(--tone-ink);
  line-height: 1.35;
  margin-bottom: 0.6rem;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.6rem 0.4rem 0.3rem;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.card-price {
  font-family: var(--serif);
  font-size: 1.33rem;
  font-style: italic;
}

.card-btns {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.btn-customize {
  border: 1px solid rgba(var(--tone-rgb), 0.4);
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  font-family: var(--sans);
  font-size: 0.73rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--btn-text);
  background: linear-gradient(150deg, rgba(var(--tone-rgb), 0.15), rgba(255, 255, 255, 0.6));
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-customize:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--tone-rgb), 0.64);
  background: linear-gradient(150deg, rgba(var(--tone-rgb), 0.28), rgba(255, 255, 255, 0.76));
  box-shadow: 0 8px 20px rgba(var(--tone-rgb), 0.28);
}

.btn-asis {
  border: none;
  background: none;
  font-family: var(--sans);
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  color: var(--lt);
  cursor: pointer;
  padding: 0.15rem 0;
  transition: color 0.2s;
}

.btn-asis:hover {
  color: var(--mid);
}

/* EXPANDED LAB STATE */
.card-lab {
  position: relative;
  padding: 0.3rem 0.3rem 0;
  min-height: 620px;
}

.lab-flask-bg {
  position: absolute;
  top: 4%;
  right: -25%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.98;
}

.lab-content {
  position: relative;
  z-index: 1;
  max-width: 64%;
}

@media (max-width: 980px) {
  .lab-flask-bg {
    right: -32%;
    top: 7%;
    transform: scale(0.9);
    transform-origin: top right;
  }

  .lab-content {
    max-width: 70%;
  }
}

.lab-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: none;
  font-family: var(--sans);
  font-size: 0.84rem;
  color: var(--mid);
  cursor: pointer;
  padding: 0.4rem 0;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.lab-back:hover {
  color: var(--dark);
}

.lab-header {
  display: flex;
  gap: 1.8rem;
  align-items: flex-start;
  margin-bottom: 1.3rem;
}

.lab-intro {
  flex: 1;
  padding-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.lab-intro .card-name {
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
}

.lab-tagline-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0;
  margin-bottom: 0.2rem;
}

.card-collapsed .card-tagline {
  font-size: 0.94rem;
}

.lab-tagline-row .card-tagline {
  margin-bottom: 0;
}

.btn-the-story {
  min-width: 98px;
  height: 34px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  cursor: pointer;
  color: var(--mid);
  transition: transform 0.3s var(--ease-out), color 0.2s, border-color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.22rem;
  flex-shrink: 0;
  padding: 0 0.58rem;
}

.btn-the-story svg {
  width: 16px;
  height: 16px;
  transition: transform 0.28s var(--ease-out);
}

.btn-the-story-label {
  font-family: var(--sans);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  white-space: nowrap;
}

.btn-the-story.open svg {
  transform: rotate(180deg);
}

.btn-the-story:hover {
  color: var(--dark);
  border-color: rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.84);
}

.lab-story {
  margin-top: 0.5rem;
  margin-bottom: 0.6rem;
  padding: 0.7rem 0.6rem 0.7rem 1rem;
  background: linear-gradient(to right, rgba(var(--tone-rgb), 0.08), transparent 80%);
  border-radius: 0.5rem;
}

.lab-story p {
  font-family: var(--serif);
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--dark);
  margin: 0;
}

.story-slide-enter-active {
  transition: all 0.3s var(--ease-out);
}
.story-slide-leave-active {
  transition: all 0.2s ease;
}
.story-slide-enter-from,
.story-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding: 0 0.8rem;
}
.story-slide-enter-to,
.story-slide-leave-from {
  max-height: 200px;
}

.lab-section {
  margin-bottom: 1rem;
}

.lab-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(73, 67, 58, 0.5);
  margin-bottom: 0.6rem;
  padding-left: 0.1rem;
}

.lab-chips {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.lab-summary {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.8rem 0.1rem;
  margin-top: 0.3rem;
}

.lab-summary-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(73, 67, 58, 0.5);
  margin-bottom: 0.3rem;
}

.lab-formula {
  font-family: var(--serif);
  font-style: italic;
  font-size: 0.96rem;
  color: var(--dark);
  line-height: 1.45;
}

.lab-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.lab-price {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-style: italic;
}

.btn-add {
  border: 1px solid rgba(var(--tone-rgb), 0.36);
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  font-family: var(--sans);
  font-size: 0.76rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--btn-text);
  background: linear-gradient(150deg, rgba(var(--tone-rgb), 0.18), rgba(255, 255, 255, 0.6));
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--tone-rgb), 0.64);
  background: linear-gradient(150deg, rgba(var(--tone-rgb), 0.28), rgba(255, 255, 255, 0.76));
  box-shadow: 0 8px 20px rgba(var(--tone-rgb), 0.28);
}

/* Swap transition */
.swap-enter-active {
  transition: all 0.4s var(--ease-out);
  transition-delay: 0.05s;
}
.swap-leave-active {
  transition: all 0.25s ease;
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 760px) {
  .card.expanded {
    overflow: hidden;
  }

  .card-lab {
    min-height: 0;
  }

  .lab-flask-bg {
    position: relative;
    top: auto;
    right: auto;
    display: flex;
    justify-content: center;
    margin: -0.4rem 0 0.25rem;
    opacity: 0.88;
    transform: none;
  }

  .lab-content {
    max-width: none;
  }

  .lab-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.8rem;
  }

  .lab-intro .card-meta {
    justify-content: center;
  }

  .lab-back {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(246, 243, 237, 0.92);
    backdrop-filter: blur(8px);
    padding: 0.6rem 0.3rem;
    margin: -1rem -1rem 0.5rem;
    width: calc(100% + 2rem);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }
}
</style>
