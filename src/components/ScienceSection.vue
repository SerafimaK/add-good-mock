<script setup>
import { ref, computed, watch } from 'vue'
import data from '../data/scienceEvidence.json'

const searchQuery = ref('')
const openStudies = ref({})
const currentPage = ref(1)
const showAll = ref(false)
const PAGE_SIZE = 3

const allIngredients = Object.entries(data.ingredients).map(([key, val]) => ({ key, ...val }))

const filteredIngredients = computed(() => {
  if (!searchQuery.value) return allIngredients
  const q = searchQuery.value.toLowerCase()
  return allIngredients.filter(i =>
    i.display_name.toLowerCase().includes(q) ||
    (i.nickname && i.nickname.toLowerCase().includes(q)) ||
    i.key_claims.some(c => c.toLowerCase().includes(q))
  )
})

const suggestions = computed(() => {
  if (selectedIngredient.value) return []
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  const q = searchQuery.value.toLowerCase()
  return allIngredients
    .filter(i =>
      i.display_name.toLowerCase().includes(q) ||
      (i.nickname && i.nickname.toLowerCase().includes(q))
    )
    .slice(0, 5)
})

const selectedIngredient = ref(null)
const searchFocused = ref(false)

const showSuggestions = computed(() =>
  searchFocused.value && suggestions.value.length > 0 && !selectedIngredient.value
)

const totalPages = computed(() => Math.ceil(filteredIngredients.value.length / PAGE_SIZE))

const pagedIngredients = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredIngredients.value.slice(start, start + PAGE_SIZE)
})

watch(searchQuery, (val, oldVal) => {
  // If value changed to a selected ingredient name, don't reset
  if (selectedIngredient.value && val === selectedIngredient.value.display_name) return
  currentPage.value = 1
  selectedIngredient.value = null
})

function selectSuggestion(ing) {
  selectedIngredient.value = ing
  searchQuery.value = ing.display_name
  showAll.value = false
}

function showAllIngredients() {
  searchQuery.value = ''
  selectedIngredient.value = null
  showAll.value = true
  currentPage.value = 1
}

function clearSearch() {
  searchQuery.value = ''
  selectedIngredient.value = null
  if (!showAll.value) showAll.value = false
}

function hideAll() {
  showAll.value = false
  selectedIngredient.value = null
  searchQuery.value = ''
}

function goToPage(n) {
  currentPage.value = n
  document.getElementById('science')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleStudies(key) {
  openStudies.value[key] = !openStudies.value[key]
}

function onSearchFocus() {
  searchFocused.value = true
}

function onSearchBlur() {
  setTimeout(() => { searchFocused.value = false }, 200)
}

const displayIngredients = computed(() => {
  if (selectedIngredient.value) return [selectedIngredient.value]
  if (showAll.value) return pagedIngredients.value
  return []
})

const showCards = computed(() => selectedIngredient.value || showAll.value)
</script>

<template>
  <section class="sci" id="science">
    <div class="sci-inner">
      <div class="s-hdr rv">
        <span class="s-lab sci-lab">The Science</span>
        <h2 class="s-ttl sci-ttl">Science <i>behind</i></h2>
      </div>

      <div class="sci-search-area rv">
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
            @focus="onSearchFocus"
            @blur="onSearchBlur"
          >
          <button v-if="searchQuery" class="sci-clear" @click="clearSearch">&times;</button>

          <Transition name="suggest">
            <div v-if="showSuggestions" class="sci-suggestions">
              <button
                v-for="s in suggestions"
                :key="s.key"
                class="sci-suggest-item"
                @mousedown.prevent="selectSuggestion(s)"
              >
                <span class="sci-suggest-name">{{ s.display_name }}</span>
                <span v-if="s.nickname" class="sci-suggest-nick">{{ s.nickname }}</span>
              </button>
            </div>
          </Transition>
        </div>

        <div class="sci-btn-row">
          <button v-if="showCards" class="sci-show-all sci-hide" @click="hideAll">Hide</button>
          <button v-else class="sci-show-all" @click="showAllIngredients">Explore all ingredients</button>
        </div>
      </div>

      <Transition name="sci-body">
        <div v-if="showCards" class="sci-body">
          <TransitionGroup tag="div" name="sci-card" class="sci-grid">
            <article
              v-for="ing in displayIngredients"
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

          <p v-if="searchQuery && !filteredIngredients.length" class="sci-empty">No ingredients found for &ldquo;{{ searchQuery }}&rdquo;</p>

          <div v-if="showAll && !selectedIngredient && totalPages > 1" class="sci-pagination">
            <button
              v-for="n in totalPages"
              :key="n"
              :class="['sci-page-btn', { active: n === currentPage }]"
              @click="goToPage(n)"
            >{{ n }}</button>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.sci {
  background: var(--dark, #2b2721);
  padding: 5rem 2rem;
}

.sci-inner {
  max-width: 1100px;
  margin: 0 auto;
}

/* Override section header colors for dark bg */
.sci-lab {
  color: var(--gold) !important;
}

.sci-ttl {
  color: var(--bg) !important;
}

.sci-ttl i {
  color: var(--gold);
}

/* Search area */
.sci-search-area {
  text-align: center;
  margin-bottom: 1.5rem;
}

.sci-search-wrap {
  position: relative;
  max-width: 420px;
  margin: 0 auto 1rem;
}

.sci-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.35);
  pointer-events: none;
}

.sci-search {
  width: 100%;
  font-family: var(--sans);
  font-size: .88rem;
  padding: .8rem 2.6rem .8rem 2.8rem;
  border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: 50px;
  background: rgba(255,255,255,0.07);
  color: var(--bg);
  outline: none;
  transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
}

.sci-search::placeholder {
  color: rgba(255,255,255,0.35);
}

.sci-search:focus {
  border-color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
}

.sci-clear {
  position: absolute;
  right: .8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  padding: .2rem;
  transition: color .2s;
}

.sci-clear:hover {
  color: rgba(255,255,255,0.7);
}

/* Suggestions dropdown */
.sci-suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  overflow: hidden;
  z-index: 10;
}

.sci-suggest-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  width: 100%;
  padding: .7rem 1.2rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  transition: background .15s;
}

.sci-suggest-item:hover {
  background: rgba(0,0,0,0.04);
}

.sci-suggest-name {
  font-size: .88rem;
  font-weight: 600;
  color: var(--dark);
}

.sci-suggest-nick {
  font-size: .78rem;
  font-style: italic;
  color: var(--lt);
}

.suggest-enter-active { transition: opacity .2s ease, transform .2s ease; }
.suggest-leave-active { transition: opacity .15s ease, transform .15s ease; }
.suggest-enter-from { opacity: 0; transform: translateY(-6px); }
.suggest-leave-to { opacity: 0; transform: translateY(-6px); }

/* Show all button */
.sci-show-all {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-family: var(--sans);
  font-size: .82rem;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  background: none;
  border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: 50px;
  padding: .55rem 1.4rem;
  cursor: pointer;
  transition: all .3s var(--ease-out);
  letter-spacing: .03em;
}

.sci-show-all:hover {
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.25);
  transform: translateY(-2px);
}

.sci-btn-row {
  display: flex;
  gap: .6rem;
  justify-content: center;
  flex-wrap: wrap;
}

.sci-hide {
  color: rgba(255,255,255,0.35);
  border-color: rgba(255,255,255,0.08);
}

/* Body transition */
.sci-body {
  margin-top: 1.5rem;
}

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

/* Grid */
.sci-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 760px;
  margin: 0 auto;
}

/* Card — light cards on dark bg */
.sci-card {
  background: linear-gradient(150deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.56);
  border-radius: 20px;
  padding: 1.8rem;
  transition: transform .35s var(--ease-out), box-shadow .35s var(--ease-out);
}

.sci-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
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
  color: rgba(255,255,255,0.4);
  padding: 2rem 0;
}

/* Pagination */
.sci-pagination {
  display: flex;
  justify-content: center;
  gap: .5rem;
  margin-top: 2rem;
}

.sci-page-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: none;
  color: rgba(255,255,255,0.5);
  font-family: var(--sans);
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sci-page-btn:hover {
  border-color: rgba(255,255,255,0.35);
  color: rgba(255,255,255,0.8);
}

.sci-page-btn.active {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.35);
  color: var(--bg);
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
