<script setup>
const items = [
  { text: 'Rice Ferment', dot: 'gold' },
  { text: 'Snow Mushroom', dot: 'forest' },
  { text: 'Sea Kelp Bioferment', dot: 'ocean' },
  { text: 'Niacinamide', dot: 'gold' },
  { text: 'Hyaluronic Acid', dot: 'forest' },
  { text: 'Peptides', dot: 'ocean' },
  { text: 'Add good to your routine', dot: 'gold' },
  { text: '$11.90 per drop', dot: 'forest' },
  { text: '2\u20133 drops is all you need', dot: 'ocean' },
]
</script>

<template>
  <div class="marquee">
    <div class="mq-track">
      <template v-for="(_, rep) in 2" :key="rep">
        <template v-for="item in items" :key="rep + '-' + item.text">
          <span class="mq-item">{{ item.text }}</span>
          <span class="dt" :style="{ background: `var(--${item.dot})` }"></span>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden; background: var(--dark); padding: .75rem 0;
}
.mq-track {
  display: flex; animation: mscr 30s linear infinite; width: max-content;
}
.mq-item {
  font-family: var(--serif); font-size: .9rem; font-style: italic;
  color: var(--bg); white-space: nowrap; padding: 0 1.8rem; opacity: .55;
}
.dt {
  display: inline-block; width: 4px; height: 4px; border-radius: 50%;
  margin: 0 .3rem; align-self: center; opacity: .35; flex-shrink: 0;
}
@keyframes mscr { from { transform: translateX(0); } to { transform: translateX(-50%); } }
</style>
