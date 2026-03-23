<script setup>
import { computed } from 'vue'

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
</script>

<template>
  <div class="fi" :class="{ 'fi--err': error, 'fi--has': hasValue }">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder || label"
      :disabled="disabled"
      class="fi-input"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <label class="fi-label">{{ label }}</label>
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
</style>
