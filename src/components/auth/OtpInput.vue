<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['complete'])

const digits = ref(['', '', '', '', '', ''])
const inputs = ref([])

function onInput(index, event) {
  const val = event.target.value.replace(/\D/g, '')
  digits.value[index] = val.slice(-1)
  if (val && index < 5) {
    inputs.value[index + 1]?.focus()
  }
  const code = digits.value.join('')
  if (code.length === 6) {
    emit('complete', code)
  }
}

function onKeydown(index, event) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

function onPaste(event) {
  const text = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (text.length === 6) {
    event.preventDefault()
    for (let i = 0; i < 6; i++) digits.value[i] = text[i]
    inputs.value[5]?.focus()
    emit('complete', text)
  }
}

watch(() => props.error, () => {
  if (props.error) {
    digits.value = ['', '', '', '', '', '']
    inputs.value[0]?.focus()
  }
})
</script>

<template>
  <div class="otp-wrap">
    <p class="otp-hint">Enter the 6-digit code. <span class="otp-mock">Use <b>123456</b></span></p>
    <div class="otp-row">
      <input
        v-for="(d, i) in digits"
        :key="i"
        :ref="el => inputs[i] = el"
        :value="digits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="otp-cell"
        :class="{ 'otp-cell--err': error }"
        :disabled="disabled"
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        @paste="onPaste"
      />
    </div>
    <div v-if="error" class="otp-error">{{ error }}</div>
  </div>
</template>

<style scoped>
.otp-wrap { margin-bottom: 1rem; }
.otp-hint {
  font-size: .8rem;
  color: var(--mid);
  margin-bottom: .7rem;
  text-align: center;
}
.otp-mock { color: var(--forest); }
.otp-row {
  display: flex;
  gap: .5rem;
  justify-content: center;
}
.otp-cell {
  width: 44px; height: 52px;
  border: 1.5px solid var(--sand);
  border-radius: 10px;
  background: rgba(255,255,255,.6);
  text-align: center;
  font-family: var(--sans);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--dark);
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.otp-cell:focus {
  border-color: var(--forest);
  box-shadow: 0 0 0 3px rgba(27,133,74,.1);
}
.otp-cell--err { border-color: #c44; }
.otp-error {
  font-size: .72rem;
  color: #c44;
  margin-top: .4rem;
  text-align: center;
}
.otp-cell:disabled { opacity: .5; cursor: not-allowed; }
</style>
