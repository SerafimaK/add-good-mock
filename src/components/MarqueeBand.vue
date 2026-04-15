<script setup>
const items = [
  { text: 'Rice Ferment', dot: 'gold' },
  { text: 'Snow Mushroom', dot: 'forest' },
  { text: 'Sea Kelp Bioferment', dot: 'ocean' },
  { text: 'Add good to your routine', dot: 'gold' },
  { text: '100% vegan', dot: 'forest' },
  { text: 'Made to mix', dot: 'ocean' },
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
  position: relative;
  overflow: hidden;
  padding: 0.82rem 0;
  background: linear-gradient(96deg, #2a2521 0%, #342e29 40%, #312b26 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 8px 22px rgba(255, 255, 255, 0.02),
    inset 0 -8px 20px rgba(0, 0, 0, 0.15);
}

.marquee::before,
.marquee::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.marquee::before {
  background: linear-gradient(90deg, rgba(248, 241, 230, 0.08), rgba(248, 241, 230, 0));
}

.marquee::after {
  background:
    radial-gradient(circle at 10% 50%, rgba(222, 188, 126, 0.14), rgba(222, 188, 126, 0) 30%),
    radial-gradient(circle at 85% 50%, rgba(132, 182, 207, 0.12), rgba(132, 182, 207, 0) 28%);
}
.mq-track {
  display: flex;
  animation: mscr 34s linear infinite;
  width: max-content;
}
.mq-item {
  font-family: var(--serif);
  font-size: 0.88rem;
  font-style: italic;
  letter-spacing: 0.01em;
  color: rgba(249, 242, 232, 0.76);
  white-space: nowrap;
  padding: 0 1.8rem;
  opacity: 0.72;
}
.dt {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin: 0 0.32rem;
  align-self: center;
  opacity: 0.48;
  flex-shrink: 0;
  box-shadow: 0 0 9px currentColor;
}
@keyframes mscr { from { transform: translateX(0); } to { transform: translateX(-50%); } }
</style>
