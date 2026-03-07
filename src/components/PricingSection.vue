<script setup>
import { useCart } from '../stores/cart.js'

const { add } = useCart()
</script>

<template>
  <section class="pricing" id="pricing">
    <div class="s-hdr rv">
      <span class="s-lab">Shop</span>
      <h2 class="s-ttl">One drop or <i>the whole story</i></h2>
    </div>
    <div class="prg">
      <div class="prc rv">
        <h3>Single Booster</h3>
        <div class="prp">$11.90</div>
        <div class="prd">· 15 ml ·<br>Choose to add:<br></div>
        <div class="pr-btns">
          <button class="prbt prbt-sm" @click="add('glow')">Glow</button>
          <button class="prbt prbt-sm" @click="add('plump')">Plump</button>
          <button class="prbt prbt-sm" @click="add('firm')">Firm</button>
        </div>
      </div>
      <div class="prc ft rv">
        <div class="prbd">Best value</div>
        <h3>The Trio</h3>
        <div class="prp">$29.90 <small>$35.70</small></div>
        <div class="prd">All three · Save 16%</div>
        <button class="prbt prbt-primary" @click="add('trio')">Get the trio</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing { padding: 4rem 2rem; background: var(--bg2); }
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
