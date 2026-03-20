<script setup>
import { ref, computed } from 'vue'
import data from '../data/scienceEvidence.json'

const expanded = ref(false)
const searchQuery = ref('')
const openStudies = ref({})

const allIngredients = Object.entries(data.ingredients).map(([key, val]) => ({ key, ...val }))

const ingredients = computed(() => {
  if (!searchQuery.value) return allIngredients
  const q = searchQuery.value.toLowerCase()
  return allIngredients.filter(i =>
    i.display_name.toLowerCase().includes(q) ||
    (i.nickname && i.nickname.toLowerCase().includes(q))
  )
})

function toggleStudies(key) {
  openStudies.value[key] = !openStudies.value[key]
}
</script>

<template>
  <section class="sci" id="science">
    <div class="s-hdr rv">
      <span class="s-lab">The Science</span>
      <h2 class="s-ttl">Science <i>behind</i></h2>
    </div>

    <div class="sci-expand-wrap rv">
      <button class="sci-expand-btn" @click="expanded = !expanded">
        <span>{{ expanded ? 'Hide ingredients' : 'Explore our ingredients' }}</span>
        <svg :class="{ open: expanded }" width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <Transition name="sci-body">
      <div v-if="expanded" class="sci-body">
        <div class="sci-search-wrap">
          <svg class="sci-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M10.5 10.5L15 15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="sci-search"
            placeholder="Search ingredient…"
          >
        </div>

        <TransitionGroup tag="div" name="sci-card" class="sci-grid">
          <article
            v-for="ing in ingredients"
            :key="ing.key"
            class="sci-card"
          >
            <div class="sci-card-row">
              <div class="sci-card-main">
                <div class="sci-card-top">
                  <h3 class="sci-name">{{ ing.display_name }}</h3>
                  <span v-if="ing.nickname" class="sci-nick">{{ ing.nickname }}</span>
                </div>

                <p class="sci-summary">{{ ing.summary }}</p>

                <button class="sci-toggle" @click="toggleStudies(ing.key)">
                  <span>{{ ing.studies.length }} peer-reviewed {{ ing.studies.length === 1 ? 'study' : 'studies' }}</span>
                  <svg :class="{ open: openStudies[ing.key] }" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>

              <div class="sci-claims">
                <span v-for="(c, ci) in ing.key_claims" :key="ci" class="sci-claim">{{ c }}</span>
              </div>
            </div>

            <Transition name="studies">
              <div v-if="openStudies[ing.key]" class="sci-studies">
                <div v-for="(s, si) in ing.studies" :key="si" class="sci-study">
                  <p class="sci-study-title">{{ s.title }}</p>
                  <p class="sci-study-meta">{{ s.journal }} &middot; {{ s.year }} &middot; {{ s.type }}<template v-if="s.participants"> &middot; {{ s.participants }} participants</template></p>
                  <p class="sci-study-finding">{{ s.finding }}</p>
                  <a :href="s.url" target="_blank" rel="noopener" class="sci-study-link">View study &rarr;</a>
                </div>
              </div>
            </Transition>
          </article>
        </TransitionGroup>

        <p v-if="searchQuery && !ingredients.length" class="sci-empty">No ingredients found for &ldquo;{{ searchQuery }}&rdquo;</p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.sci {
  padding: 5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* Expand button */
.sci-expand-wrap {
  text-align: center;
  margin-bottom: 1rem;
}

.sci-expand-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-family: var(--sans);
  font-size: .88rem;
  font-weight: 600;
  color: var(--dark);
  background: linear-gradient(150deg, rgba(255,255,255,0.66), rgba(255,255,255,0.36));
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255,255,255,0.56);
  border-radius: 50px;
  padding: .7rem 1.8rem;
  cursor: pointer;
  transition: all .3s var(--ease-out);
}

.sci-expand-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.sci-expand-btn svg {
  transition: transform .3s var(--ease-out);
}

.sci-expand-btn svg.open {
  transform: rotate(180deg);
}

/* Body transition */
.sci-body-enter-active {
  transition: max-height .6s var(--ease-out), opacity .4s ease .1s;
  overflow: hidden;
}

.sci-body-leave-active {
  transition: max-height .5s ease, opacity .25s ease;
  overflow: hidden;
}

.sci-body-enter-from,
.sci-body-leave-to {
  max-height: 0;
  opacity: 0;
}

.sci-body-enter-to,
.sci-body-leave-from {
  max-height: 8000px;
  opacity: 1;
}

/* Search */
.sci-search-wrap {
  position: relative;
  max-width: 380px;
  margin: 0 auto 2rem;
}

.sci-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--lt);
  pointer-events: none;
}

.sci-search {
  width: 100%;
  font-family: var(--sans);
  font-size: .88rem;
  padding: .7rem 1rem .7rem 2.8rem;
  border: 1.5px solid var(--sand);
  border-radius: 50px;
  background: rgba(255,255,255,0.5);
  color: var(--dark);
  outline: none;
  transition: border-color .25s ease, box-shadow .25s ease;
}

.sci-search::placeholder {
  color: var(--lt);
}

.sci-search:focus {
  border-color: var(--mid);
  box-shadow: 0 0 0 3px rgba(110,100,89,0.08);
}

/* Grid */
.sci-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 760px;
  margin: 0 auto;
}

/* Card */
.sci-card {
  background: linear-gradient(150deg, rgba(255,255,255,0.66), rgba(255,255,255,0.36));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.56);
  border-radius: 20px;
  padding: 1.8rem;
  transition: transform .35s var(--ease-out), box-shadow .35s var(--ease-out);
}

.sci-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.06);
}

/* Card row layout */
.sci-card-row {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.sci-card-main {
  flex: 1;
  min-width: 0;
}

.sci-card-top {
  display: flex;
  align-items: baseline;
  gap: .6rem;
  margin-bottom: .6rem;
  flex-wrap: wrap;
}

.sci-name {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--dark);
  line-height: 1.2;
}

.sci-nick {
  font-family: var(--sans);
  font-size: .82rem;
  font-style: italic;
  color: var(--lt);
}

/* Summary */
.sci-summary {
  font-family: var(--sans);
  font-size: .88rem;
  line-height: 1.55;
  color: var(--mid);
  margin-bottom: .9rem;
}

/* Claims — right side */
.sci-claims {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
  align-content: flex-start;
  flex-shrink: 0;
  width: 220px;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(0,0,0,0.05);
}

.sci-claim {
  font-family: var(--sans);
  font-size: .7rem;
  font-weight: 500;
  color: var(--mid);
  background: rgba(0,0,0,0.04);
  padding: .25rem .65rem;
  border-radius: 50px;
  line-height: 1.4;
}

/* Studies toggle */
.sci-toggle {
  display: flex;
  align-items: center;
  gap: .45rem;
  font-family: var(--sans);
  font-size: .78rem;
  font-weight: 600;
  color: var(--dark);
  background: none;
  border: none;
  cursor: pointer;
  padding: .3rem 0;
  transition: color .2s ease;
}

.sci-toggle:hover {
  color: var(--forest);
}

.sci-toggle svg {
  transition: transform .3s var(--ease-out);
}

.sci-toggle svg.open {
  transform: rotate(180deg);
}

/* Studies panel */
.sci-studies {
  margin-top: .8rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: .8rem;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.sci-study {
  padding-bottom: .8rem;
}

.sci-study + .sci-study {
  border-top: 1px solid rgba(0,0,0,0.04);
  padding-top: .8rem;
}

.sci-study-title {
  font-family: var(--sans);
  font-size: .82rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.4;
  margin-bottom: .25rem;
}

.sci-study-meta {
  font-family: var(--sans);
  font-size: .72rem;
  color: var(--lt);
  margin-bottom: .4rem;
}

.sci-study-finding {
  font-family: var(--sans);
  font-size: .8rem;
  line-height: 1.5;
  color: var(--mid);
  margin-bottom: .35rem;
}

.sci-study-link {
  font-family: var(--sans);
  font-size: .75rem;
  font-weight: 600;
  color: var(--forest);
  text-decoration: none;
  transition: opacity .2s ease;
}

.sci-study-link:hover {
  opacity: .7;
}

/* Empty state */
.sci-empty {
  text-align: center;
  font-family: var(--sans);
  font-size: .88rem;
  color: var(--lt);
  padding: 2rem 0;
}

/* Card transitions */
.sci-card-enter-active {
  transition: all .45s var(--ease-out);
}

.sci-card-leave-active {
  transition: all .3s ease;
  position: absolute;
}

.sci-card-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.sci-card-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.sci-card-move {
  transition: transform .4s var(--ease-out);
}

/* Studies transitions */
.studies-enter-active {
  transition: max-height .4s var(--ease-out), opacity .3s ease;
  overflow: hidden;
}

.studies-leave-active {
  transition: max-height .3s ease, opacity .2s ease;
  overflow: hidden;
}

.studies-enter-from,
.studies-leave-to {
  max-height: 0;
  opacity: 0;
}

.studies-enter-to,
.studies-leave-from {
  max-height: 2000px;
  opacity: 1;
}

/* Responsive */
@media (max-width: 700px) {
  .sci {
    padding: 3.5rem 1.2rem;
  }

  .sci-claims {
    display: none;
  }

  .sci-card-row {
    display: block;
  }

  .sci-name {
    font-size: 1.3rem;
  }

  .sci-card {
    padding: 1.4rem;
  }

  .sci-search-wrap {
    max-width: 100%;
  }
}
</style>
