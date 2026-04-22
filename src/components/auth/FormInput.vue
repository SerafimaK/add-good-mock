<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const hasValue = computed(() => props.modelValue && props.modelValue.length > 0)
const isPassword = computed(() => props.type === 'password')
const revealed = ref(false)
const effectiveType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
</script>

<template>
  <div class="fi" :class="{ 'fi--err': error, 'fi--has': hasValue, 'fi--pw': isPassword }">
    <input
      :type="effectiveType"
      :value="modelValue"
      :placeholder="placeholder || label"
      :disabled="disabled"
      class="fi-input"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <label class="fi-label">{{ label }}</label>
    <button
      v-if="isPassword"
      type="button"
      class="fi-toggle"
      :aria-label="revealed ? 'Hide password' : 'Show password'"
      :aria-pressed="revealed"
      @click="revealed = !revealed"
    >
      <svg v-if="!revealed" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a18.4 18.4 0 0 1 4.22-5.22"/>
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a18.38 18.38 0 0 1-3.17 4.19"/>
        <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88"/>
        <path d="M1 1l22 22"/>
      </svg>
    </button>
    <div v-if="error" class="fi-error">{{ error }}</div>
  </div>
</template>

<style scoped>
.fi {
  position: relative;
  margin-bottom: 1rem;
}
.fi-input {
  width: 100%;
  padding: .85rem 1rem .55rem;
  border: 1.5px solid var(--sand);
  border-radius: 12px;
  background: rgba(255,255,255,.6);
  font-family: var(--sans);
  font-size: .9rem;
  color: var(--dark);
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  box-sizing: border-box;
}
.fi--pw .fi-input { padding-right: 2.8rem; }
.fi-input::placeholder { color: transparent; }
.fi-input:focus { border-color: var(--forest); box-shadow: 0 0 0 3px rgba(27,133,74,.1); }
.fi-input:focus::placeholder { color: var(--lt); }
.fi-label {
  position: absolute;
  left: 1rem; top: 50%;
  transform: translateY(-50%);
  font-size: .9rem;
  color: var(--lt);
  pointer-events: none;
  transition: all .2s;
  background: transparent;
}
.fi-input:focus ~ .fi-label,
.fi--has .fi-label {
  top: .35rem;
  transform: translateY(0);
  font-size: .65rem;
  color: var(--mid);
  letter-spacing: .04em;
  text-transform: uppercase;
  font-weight: 600;
}
.fi--err .fi-input { border-color: #c44; }
.fi-error {
  font-size: .72rem;
  color: #c44;
  margin-top: .3rem;
  padding-left: .2rem;
}
.fi-input:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.fi-toggle {
  position: absolute;
  right: .6rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: .4rem;
  cursor: pointer;
  color: var(--lt);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: color .2s, background .2s;
}
.fi-toggle:hover { color: var(--dark); background: rgba(0,0,0,.04); }
.fi-toggle:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 2px;
}
</style>
