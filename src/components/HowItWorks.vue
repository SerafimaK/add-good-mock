<script setup>
const steps = [
  { num: '1', title: 'Your cream', text: 'Any moisturizer you already use.', color: 'gold' },
  { num: '2', title: 'Add 2\u20133 drops', text: 'Pick your booster. Drop it in.', color: 'forest' },
  { num: '3', title: 'Blend & glow', text: 'Mix and apply. Leveled up.', color: 'ocean' },
]
</script>

<template>
  <section class="howto" id="howto">
    <div class="s-hdr rv">
      <span class="s-lab">How it works</span>
      <h2 class="s-ttl">Three seconds. <i>That's it.</i></h2>
    </div>
    <div class="ht rv">
      <div class="ht-line"></div>
      <div v-for="step in steps" :key="step.num" class="hts">
        <div :class="['htn', 'htn-' + step.color]">{{ step.num }}</div>
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.howto { padding: 4rem 2rem; background: var(--bg); }
.ht {
  display: flex; gap: 0; max-width: 860px; margin: 0 auto; position: relative;
}
.ht-line {
  position: absolute; top: 22px; left: 24px; right: 24px; height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--forest), var(--ocean));
  opacity: .12; border-radius: 1px;
}
.hts { flex: 1; text-align: center; padding: 0 1.5rem; position: relative; }
.htn {
  width: 44px; height: 44px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: 1.15rem; font-style: italic;
  margin-bottom: 1.3rem; position: relative; z-index: 1;
}
.htn-gold { background: rgba(194,155,60,.1); color: #8A6B10; }
.htn-forest { background: rgba(62,95,55,.08); color: var(--forest); }
.htn-ocean { background: rgba(48,92,112,.08); color: var(--ocean); }
.hts h3 { font-family: var(--serif); font-size: 1.08rem; font-weight: 400; margin-bottom: .4rem; }
.hts p { font-size: .88rem; color: var(--mid); line-height: 1.55; font-weight: 400; }

@media (max-width: 700px) {
  .ht { flex-direction: column; gap: 2rem; }
  .ht-line { display: none; }
}
</style>
