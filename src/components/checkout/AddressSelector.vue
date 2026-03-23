<script setup>
const props = defineProps({
  addresses: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'useNew'])
</script>

<template>
  <div class="as">
    <h3 class="as-title">Choose a saved address</h3>
    <div
      v-for="addr in addresses" :key="addr.id"
      class="as-card" :class="{ active: modelValue === addr.id }"
      @click="emit('update:modelValue', addr.id)"
    >
      <div class="as-radio"><div class="as-dot"></div></div>
      <div class="as-info">
        <div class="as-label">{{ addr.label || 'Address' }} <span v-if="addr.isDefault" class="as-default">Default</span></div>
        <div class="as-body">{{ addr.fullName }} — {{ addr.line1 }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip }}</div>
      </div>
    </div>
    <button class="as-new" @click="emit('useNew')">Use a different address</button>
  </div>
</template>

<style scoped>
.as-title {
  font-family: var(--serif); font-size: 1.1rem; font-weight: 400;
  margin-bottom: 1rem;
}
.as-card {
  display: flex; gap: .8rem; align-items: flex-start;
  padding: 1rem 1.2rem;
  border: 1.5px solid var(--sand);
  border-radius: 12px;
  margin-bottom: .6rem;
  cursor: pointer;
  transition: all .2s;
}
.as-card:hover { border-color: var(--mid); }
.as-card.active { border-color: var(--forest); background: rgba(27,133,74,.03); }
.as-radio {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--sand); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  margin-top: 2px; transition: border-color .2s;
}
.as-card.active .as-radio { border-color: var(--forest); }
.as-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: transparent; transition: background .2s;
}
.as-card.active .as-dot { background: var(--forest); }
.as-info { flex: 1; }
.as-label { font-weight: 700; font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .2rem; }
.as-default {
  font-size: .6rem; color: var(--forest); border: 1px solid var(--forest);
  padding: .1rem .4rem; border-radius: 50px; margin-left: .3rem;
  vertical-align: middle;
}
.as-body { font-size: .82rem; color: var(--mid); }
.as-new {
  background: none; border: none; font-family: var(--sans);
  font-size: .8rem; color: var(--forest); cursor: pointer;
  text-decoration: underline; text-underline-offset: 2px;
  margin-top: .4rem;
}
.as-new:hover { color: var(--dark); }
</style>
