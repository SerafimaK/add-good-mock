<script setup>
import { ref, computed } from 'vue'

const questions = [
  {
    q: "What's your skin asking for?",
    o: [
      { t: 'More radiance & even tone', g: ['glow'] },
      { t: 'Deep hydration & plumpness', g: ['plump'] },
      { t: 'Firmness & lift', g: ['firm'] },
      { t: 'All of the above', g: ['glow', 'plump', 'firm'] },
    ],
  },
  {
    q: 'Describe your skin right now.',
    o: [
      { t: 'Oily zones, dullness', g: ['glow'] },
      { t: 'Dry patches, tightness', g: ['plump'] },
      { t: 'Fine lines showing up', g: ['firm'] },
      { t: 'Sensitive & reactive', g: ['plump', 'glow'] },
    ],
  },
  {
    q: 'What would make you smile in the mirror?',
    o: [
      { t: 'Lit-from-within glow', g: ['glow'] },
      { t: 'Skin so hydrated it bounces', g: ['plump'] },
      { t: 'Visibly tighter, sculpted', g: ['firm'] },
      { t: 'Healthy & balanced', g: ['glow', 'plump', 'firm'] },
    ],
  },
]

const names = { glow: 'Glow', plump: 'Plump', firm: 'Firm' }
const icons = { glow: '\uD83C\uDF3E', plump: '\uD83C\uDF44', firm: '\uD83C\uDF0A' }

const step = ref(0)
const scores = ref({ glow: 0, plump: 0, firm: 0 })
const selectedIdx = ref(-1)

const isDone = computed(() => step.value >= questions.length)

const results = computed(() => {
  const sorted = Object.entries(scores.value).sort((a, b) => b[1] - a[1])
  const top = sorted[0][0]
  const second = sorted[1] && scores.value[sorted[1][0]] > 0 ? sorted[1][0] : null
  return { top, second }
})

function pick(option) {
  selectedIdx.value = questions[step.value].o.indexOf(option)
  option.g.forEach(t => { scores.value[t]++ })
  setTimeout(() => {
    step.value++
    selectedIdx.value = -1
  }, 250)
}

function retake() {
  step.value = 0
  scores.value = { glow: 0, plump: 0, firm: 0 }
  selectedIdx.value = -1
}
</script>

<template>
  <section class="quiz" id="quiz">
    <div class="quiz-glow"></div>
    <div class="s-hdr" style="position: relative; z-index: 1">
      <span class="s-lab rv" style="color: var(--gold)">Your ritual</span>
      <h2 class="s-ttl rv" style="color: var(--bg)">Which booster is <i style="color: var(--gold)">your good?</i></h2>
    </div>

    <div class="qw">
      <!-- Questions -->
      <template v-if="!isDone">
        <div class="qpg">
          <div
            v-for="(_, i) in questions"
            :key="i"
            :class="['qd', { on: i === step, dn: i < step }]"
          ></div>
        </div>
        <div class="qq">{{ questions[step].q }}</div>
        <div class="qos">
          <div
            v-for="(o, i) in questions[step].o"
            :key="i"
            :class="['qo', { sel: selectedIdx === i }]"
            @click="pick(o)"
          >{{ o.t }}</div>
        </div>
      </template>

      <!-- Results -->
      <template v-else>
        <div class="qr">
          <h3>Your Add Good Ritual</h3>
          <p>Here's what your skin needs:</p>
          <div class="rb">
            <div class="ri">
              <div class="rt">Morning</div>
              <div class="rc">{{ icons[results.top] }}</div>
              <div class="rn">{{ names[results.top] }}</div>
              <div class="rd">1\u20132 presses \u00B7 day cream</div>
            </div>
            <div v-if="results.second" class="ri">
              <div class="rt">Evening</div>
              <div class="rc">{{ icons[results.second] }}</div>
              <div class="rn">{{ names[results.second] }}</div>
              <div class="rd">1\u20132 presses \u00B7 night cream</div>
            </div>
          </div>
          <div style="margin-top: 1.5rem">
            <a href="#pricing" class="shop-btn">Shop your ritual</a>
          </div>
          <button class="qre" @click="retake">Retake quiz</button>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.quiz {
  padding: 4rem 2rem; background: var(--dark); color: var(--bg);
  position: relative; overflow: hidden;
}
.quiz-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 40%, rgba(62,95,55,.1), transparent 55%),
    radial-gradient(ellipse at 80% 70%, rgba(48,92,112,.08), transparent 50%);
}
.qw {
  max-width: 580px; margin: 0 auto; text-align: center;
  position: relative; z-index: 1;
}
.qpg { display: flex; gap: .4rem; justify-content: center; margin-bottom: 2rem; }
.qd {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(248,245,240,.12); transition: all .4s;
}
.qd.on { background: var(--gold); width: 26px; border-radius: 4px; }
.qd.dn { background: var(--forest); }
.qq {
  font-family: var(--serif); font-size: 1.3rem; font-weight: 400;
  margin-bottom: 1.5rem; line-height: 1.4;
}
.qos { display: flex; flex-direction: column; gap: .6rem; max-width: 440px; margin: 0 auto; }
.qo {
  padding: .85rem 1.3rem; border: 1px solid rgba(248,245,240,.08);
  border-radius: 12px; cursor: pointer; transition: all .25s;
  font-size: .9rem; font-weight: 400; color: rgba(248,245,240,.6); text-align: left;
}
.qo:hover {
  border-color: rgba(194,155,60,.4); color: var(--bg);
  background: rgba(248,245,240,.03);
}
.qo.sel { border-color: var(--gold); background: rgba(194,155,60,.1); color: var(--bg); }

.qr { text-align: center; padding: 1rem 0; }
.qr h3 { font-family: var(--serif); font-size: 1.6rem; font-weight: 400; margin-bottom: .7rem; }
.qr > p { color: rgba(248,245,240,.5); margin-bottom: 1.5rem; font-weight: 300; line-height: 1.7; }
.rb {
  display: inline-flex; gap: 2rem; padding: 1.5rem 2.5rem;
  background: rgba(248,245,240,.04); border: 1px solid rgba(248,245,240,.08);
  border-radius: 18px;
}
.ri { text-align: center; }
.rt {
  font-size: .55rem; letter-spacing: .18em; text-transform: uppercase;
  color: var(--gold); margin-bottom: .3rem;
}
.rc { font-size: 1.4rem; margin-bottom: .2rem; }
.rn { font-family: var(--serif); font-size: 1rem; font-style: italic; }
.rd { font-size: .65rem; color: rgba(248,245,240,.3); margin-top: .2rem; }

.shop-btn {
  display: inline-block; background: var(--bg); color: var(--dark);
  padding: .8rem 2rem; border-radius: 50px; font-size: .85rem;
  font-weight: 600; text-decoration: none; transition: all .3s;
  text-transform: uppercase; letter-spacing: .04em;
}
.shop-btn:hover { background: var(--gold); color: #fff; transform: translateY(-2px); }

.qre {
  margin-top: 1.2rem; display: inline-block; background: none; border: none;
  font-family: var(--sans); font-size: .72rem; letter-spacing: .1em;
  text-transform: uppercase; color: rgba(248,245,240,.3); cursor: pointer;
  border-bottom: 1px solid rgba(248,245,240,.1); padding-bottom: 2px; transition: all .3s;
}
.qre:hover { color: var(--bg); border-color: var(--bg); }

@media (max-width: 700px) {
  .rb { flex-direction: column; gap: 1rem; }
}
</style>
