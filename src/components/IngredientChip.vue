<script setup>
const props = defineProps({
  ingredient: Object,
  selected: Boolean,
  isPremium: Boolean,
  toneRgb: String,
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="chip" :class="{ selected, premium: isPremium }" :style="{ '--tone-rgb': toneRgb }">
    <div class="chip-row" @click="emit('toggle')">
      <span
        class="chip-check"
        :style="selected ? `--check-rgb: ${isPremium ? '212, 83, 75' : toneRgb}` : ''"
        :class="{ checked: selected }"
      >
        <svg v-if="selected" viewBox="0 0 16 16" fill="none" class="chip-tick">
          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <div class="chip-info">
        <span class="chip-name">{{ ingredient.name }}<template v-if="ingredient.nickname"> — {{ ingredient.nickname }}</template></span>
        <span class="chip-effects">{{ ingredient.effects.join(' · ') }}</span>
      </div>
      <span class="chip-price" :class="{ 'chip-price-premium': isPremium }">{{ isPremium ? '+$2.00' : '+$1.00' }}</span>
    </div>

    <div class="chip-story">
      <p class="chip-text">{{ ingredient.story }}</p>
    </div>
  </div>
</template>

<style scoped>
.chip {
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
  align-items: center;
  gap: 0.7rem;
  padding: 0.72rem 0.8rem;
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

.chip-info {
  flex: 1;
  min-width: 0;
}

.chip-name {
  display: block;
  font-weight: 700;
  font-size: 0.94rem;
  color: var(--dark);
}

.chip-price {
  min-width: 68px;
  height: 34px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  color: var(--mid);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 0.7rem;
  font-family: var(--sans);
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.chip-price-premium {
  color: #c0443e;
  border-color: rgba(212, 83, 75, 0.25);
  background: rgba(212, 83, 75, 0.08);
}

.chip-effects {
  display: block;
  font-size: 0.84rem;
  color: rgba(73, 67, 58, 0.82);
  margin-top: 0.14rem;
  line-height: 1.3;
}

.chip-quote {
  font-family: var(--serif);
  font-style: italic;
  font-size: 0.84rem;
  color: rgba(43, 39, 33, 0.9);
  margin-top: 0.16rem;
  line-height: 1.28;
}

/* Story panel */
.chip-story {
  padding: 0 0.9rem 0.8rem;
}

.chip-text {
  font-size: 0.88rem;
  color: var(--mid);
  line-height: 1.6;
  margin: 0;
}
</style>
