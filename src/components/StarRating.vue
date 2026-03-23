<script setup>
const props = defineProps({
  rating: { type: Number, required: true },
  size: { type: String, default: '1rem' },
})
</script>

<template>
  <span class="stars" :style="{ '--star-size': size }">
    <span v-for="i in 5" :key="i" class="star-wrap">
      <!-- Empty star (background) -->
      <svg :width="size" :height="size" viewBox="0 0 20 20" class="star-empty">
        <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8z"
              fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
      </svg>
      <!-- Filled star (clipped for partial) -->
      <span class="star-fill" :style="{ width: Math.min(1, Math.max(0, rating - i + 1)) * 100 + '%' }">
        <svg :width="size" :height="size" viewBox="0 0 20 20">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8z"
                fill="currentColor"/>
        </svg>
      </span>
    </span>
  </span>
</template>

<style scoped>
.stars {
  display: inline-flex;
  gap: 0.1em;
}
.star-wrap {
  position: relative;
  display: inline-block;
  width: var(--star-size);
  height: var(--star-size);
}
.star-empty {
  color: var(--sand);
}
.star-fill {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: var(--gold);
}
</style>
