<script setup>
const props = defineProps({
  ingredient: Object,
  selected: Boolean,
  storyOpen: Boolean,
  isPremium: Boolean,
  toneRgb: String,
})

const emit = defineEmits(['toggle', 'toggle-story'])
</script>

<template>
  <div class="chip" :class="{ selected, premium: isPremium }">
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
        <div class="chip-name-row">
          <span class="chip-name">{{ ingredient.nickname || ingredient.name }}</span>
          <span v-if="isPremium" class="chip-badge">+$1.00</span>
        </div>
        <p class="chip-quote">"{{ ingredient.tagline }}"</p>
        <span class="chip-effects">{{ ingredient.effects.join(' · ') }}</span>
      </div>
      <button
        class="chip-expand"
        :class="{ open: storyOpen }"
        @click.stop="emit('toggle-story')"
        :aria-label="storyOpen ? 'Collapse story' : 'Read story'"
      >
        <span class="chip-expand-label">{{ storyOpen ? 'Hide' : 'Read more' }}</span>
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <Transition name="story">
      <div v-if="storyOpen" class="chip-story">
        <p class="chip-text">{{ ingredient.story }}</p>
        <p v-if="ingredient.evidence" class="chip-evidence">
          <span>Evidence</span>{{ ingredient.evidence }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chip {
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(255, 255, 255, 0.5);
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
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

.chip-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chip-name {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--dark);
}

.chip-badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #c0443e;
  background: rgba(212, 83, 75, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 50px;
  white-space: nowrap;
}

.chip-effects {
  display: block;
  font-size: 0.76rem;
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

.chip-expand {
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

.chip-expand svg {
  width: 16px;
  height: 16px;
  transition: transform 0.28s var(--ease-out);
}

.chip-expand-label {
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  white-space: nowrap;
}

.chip-expand.open svg {
  transform: rotate(180deg);
}

.chip-expand:hover {
  color: var(--dark);
  border-color: rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.84);
}

/* Story panel */
.chip-story {
  padding: 0 0.9rem 0.8rem;
  overflow: hidden;
}

.chip-text {
  font-size: 0.82rem;
  color: var(--mid);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.chip-evidence {
  font-size: 0.72rem;
  color: var(--lt);
  line-height: 1.5;
}

.chip-evidence span {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(86, 79, 70, 0.5);
  margin-bottom: 0.15rem;
}

/* Story transition */
.story-enter-active {
  transition: max-height 0.4s var(--ease-out), opacity 0.3s ease;
  overflow: hidden;
}
.story-leave-active {
  transition: max-height 0.3s ease, opacity 0.2s ease;
  overflow: hidden;
}
.story-enter-from,
.story-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.story-enter-to,
.story-leave-from {
  max-height: 400px;
  opacity: 1;
}
</style>
