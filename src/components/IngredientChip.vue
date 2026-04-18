<script setup>
import { ref } from 'vue'

const props = defineProps({
  ingredient: Object,
  selected: Boolean,
  isPremium: Boolean,
  toneRgb: String,
})

const emit = defineEmits(['toggle'])

const aboutOpen = ref(false)
</script>

<template>
  <div class="chip" :class="{ selected, premium: isPremium }" :style="{ '--tone-rgb': toneRgb }">
    <div class="chip-row" @click="emit('toggle')">
      <div class="chip-head">
        <span
          class="chip-check"
          :style="selected ? `--check-rgb: ${isPremium ? '212, 83, 75' : toneRgb}` : ''"
          :class="{ checked: selected }"
        >
          <svg v-if="selected" viewBox="0 0 16 16" fill="none" class="chip-tick">
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <div class="chip-body">
          <span class="chip-name">{{ ingredient.name }}<template v-if="ingredient.nickname"> — {{ ingredient.nickname }}</template></span>
          <span class="chip-effects">{{ ingredient.effects.join(' · ') }}</span>
        </div>
        <div class="chip-aside">
          <span class="chip-price" :class="{ 'chip-price-premium': isPremium }">{{ isPremium ? '+$2.00' : '+$1.00' }}</span>
          <button
            type="button"
            class="chip-about-toggle"
            :class="{ open: aboutOpen }"
            @click.stop="aboutOpen = !aboutOpen"
          >
            <span>{{ aboutOpen ? 'Hide' : 'About' }}</span>
            <svg viewBox="0 0 16 16" width="9" height="9" fill="none">
              <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition name="about-slide">
      <div v-if="aboutOpen" class="chip-story">
        <p class="chip-text">{{ ingredient.story }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chip {
  position: relative;
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(255, 255, 255, 0.5);
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.chip:hover:not(.selected) {
  border-color: rgba(var(--tone-rgb, 180, 180, 180), 0.25);
  background: rgba(var(--tone-rgb, 180, 180, 180), 0.04);
}

.chip.selected {
  border-color: rgba(var(--check-rgb, 160, 160, 160), 0.35);
  background: rgba(var(--check-rgb, 160, 160, 160), 0.06);
  box-shadow: 0 2px 12px rgba(var(--check-rgb, 160, 160, 160), 0.1);
}

.chip.premium {
  --check-rgb: 212, 83, 75;
}

.chip-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.72rem 0.9rem;
  cursor: pointer;
  user-select: none;
}

.chip-check {
  --check-rgb: 180, 180, 180;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(var(--check-rgb), 0.4);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  background: transparent;
  margin-top: 2px;
}

.chip-check.checked {
  background: rgba(var(--check-rgb), 0.18);
  border-color: rgba(var(--check-rgb), 0.6);
}

.chip-tick {
  width: 13px;
  height: 13px;
  color: rgb(var(--check-rgb));
}

.chip-head {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
}

.chip-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.chip-name {
  font-weight: 700;
  font-size: 0.94rem;
  color: var(--dark);
  line-height: 1.3;
}

.chip-effects {
  font-size: 0.82rem;
  color: rgba(73, 67, 58, 0.8);
  line-height: 1.3;
}

.chip-aside {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.28rem;
  flex-shrink: 0;
}

.chip-price {
  height: 26px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  color: var(--mid);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.55rem;
  font-family: var(--sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.chip-price-premium {
  color: #c0443e;
  border-color: rgba(212, 83, 75, 0.25);
  background: rgba(212, 83, 75, 0.08);
}

/* About toggle — sits directly under the price pill */
.chip-about-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font-family: var(--sans);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--lt);
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
}
.chip-about-toggle:hover {
  color: var(--dark);
  background: rgba(0, 0, 0, 0.04);
}
.chip-about-toggle svg { transition: transform 0.3s ease; }
.chip-about-toggle.open svg { transform: rotate(180deg); }

/* Story panel (collapsible) */
.chip-story {
  padding: 0 0.9rem 0.8rem;
  overflow: hidden;
}

.chip-text {
  font-family: var(--serif);
  font-size: 0.94rem;
  color: var(--mid);
  line-height: 1.55;
  margin: 0;
  padding-top: 0.2rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
  padding-top: 0.55rem;
}

.about-slide-enter-active { transition: all 0.3s var(--ease-out); }
.about-slide-leave-active { transition: all 0.2s ease; }
.about-slide-enter-from,
.about-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.about-slide-enter-to,
.about-slide-leave-from { max-height: 260px; }

</style>
