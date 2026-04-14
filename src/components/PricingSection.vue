<script setup>
function scrollToProducts() {
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="pricing" id="pricing">
    <div class="routine rv">
      <span class="s-lab">The routine</span>
      <h2 class="routine-ttl">Same cream. <i>Different day.</i></h2>

      <p class="routine-lead">Your skin doesn't ask for the same thing every day.</p>

      <div class="routine-steps">
        <div class="routine-step">
          <svg class="routine-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="7" stroke="currentColor" stroke-width="1.5"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="16" y1="26" x2="16" y2="30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="2" y1="16" x2="6" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="26" y1="16" x2="30" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="6.1" y1="6.1" x2="8.9" y2="8.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="23.1" y1="23.1" x2="25.9" y2="25.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="6.1" y1="25.9" x2="8.9" y2="23.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="23.1" y1="8.9" x2="25.9" y2="6.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Radiance before work</span>
        </div>
        <div class="routine-step">
          <svg class="routine-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27 16A11 11 0 0 1 16 27 11 11 0 0 1 5 16 11 11 0 0 1 16 5c0 6.075 4.925 11 11 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          <span>Deep hydration overnight</span>
        </div>
        <div class="routine-step">
          <svg class="routine-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4v2M16 26v2M4 16h2M26 16h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M16 10l1.5 4H22l-3.5 2.5L20 21l-4-3-4 3 1.5-4.5L10 14h4.5L16 10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          <span>A firming boost when your skin feels tired</span>
        </div>
      </div>

      <p class="routine-outro">Same cream. Different booster. Your skin gets what it needs, when it needs it.</p>
    </div>

    <div class="prg">
      <div class="prc rv">
        <h3>Single Booster</h3>
        <div class="prp">from $11.90</div>
        <div class="prd">30 ml</div>
        <button class="prbt prbt-primary" @click="scrollToProducts">Customize</button>
      </div>
      <div class="prc ft rv">
        <div class="prbd">Free shipping</div>
        <h3>3 boosters</h3>
        <div class="prp">Best value</div>
        <div class="prd">Mix and match</div>
        <button class="prbt prbt-primary" @click="scrollToProducts">Build your set</button>
      </div>
    </div>

  </section>
</template>

<style scoped>
.pricing { padding: 4rem 2rem; background: var(--bg2); }

/* Routine */
.routine {
  max-width: 560px;
  margin: 0 auto 3rem;
  text-align: center;
}

.routine-ttl {
  font-family: var(--serif);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 400;
  color: var(--dark);
  margin: .3rem 0 1.5rem;
}

.routine-ttl i {
  color: var(--forest);
}

.routine-lead {
  font-size: 1rem;
  color: var(--dark);
  line-height: 1.6;
  margin-bottom: 1.6rem;
}

.routine-steps {
  display: flex;
  flex-direction: column;
  gap: .9rem;
  margin-bottom: 1.6rem;
}

.routine-step {
  display: flex;
  align-items: center;
  gap: .8rem;
  justify-content: center;
}

.routine-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--forest);
}

.routine-step span {
  font-size: .92rem;
  color: var(--mid);
  line-height: 1.4;
  font-style: italic;
}

.routine-outro {
  font-size: 1rem;
  color: var(--dark);
  line-height: 1.6;
  font-weight: 500;
}

/* Pricing grid */
.prg {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  max-width: 700px; margin: 0 auto;
}
.prc {
  padding: 2.2rem; border-radius: 22px; text-align: center;
  border: 1px solid rgba(0,0,0,.05); background: var(--bg);
  transition: all .4s; position: relative;
}
.prc.ft {
  border-color: var(--forest); background: var(--bg2);
  box-shadow: 0 16px 50px rgba(62,95,55,.06);
}
.prbd {
  position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
  background: var(--dark); color: var(--bg); font-size: .55rem; font-weight: 700;
  letter-spacing: .15em; text-transform: uppercase;
  padding: .25rem .9rem; border-radius: 50px;
}
.prc h3 { font-family: var(--serif); font-size: 1.15rem; font-weight: 400; margin-bottom: .2rem; }
.prp {
  font-family: var(--serif); font-size: 2.2rem; font-style: italic;
  margin: .6rem 0; color: var(--dark);
}
.prp small {
  font-family: var(--sans); font-size: .8rem; font-weight: 400;
  color: var(--lt); text-decoration: line-through; font-style: normal; margin-left: .3rem;
}
.prd {
  font-size: .84rem; color: var(--mid); margin-bottom: 1.3rem; line-height: 1.5; font-weight: 400;
}
.pr-btns { display: flex; gap: .5rem; justify-content: center; flex-wrap: wrap; }
.prbt {
  display: inline-block; padding: .65rem 1.4rem; border-radius: 50px;
  font-size: .78rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  text-decoration: none; transition: all .3s; cursor: pointer; font-family: var(--sans);
  border: none;
}
.prbt-sm {
  border: 1.5px solid var(--dark); color: var(--dark); background: transparent;
  padding: .5rem 1rem; font-size: .72rem;
}
.prbt-sm:hover { background: var(--dark); color: var(--bg); }
.prbt-primary { background: var(--dark); color: var(--bg); padding: .75rem 1.6rem; }
.prbt-primary:hover { background: var(--forest); }

@media (max-width: 700px) {
  .prg { grid-template-columns: 1fr; max-width: 360px; }
}
</style>
