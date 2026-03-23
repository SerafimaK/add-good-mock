<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useReviews } from '../composables/useReviews.js'
import StarRating from './StarRating.vue'

const { reviews, aggregate, loading, error } = useReviews()
const expanded = ref(new Set())
const sectionEl = ref(null)
const trackEl = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateArrows() {
  const el = trackEl.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
}

function scrollTrack(dir) {
  const el = trackEl.value
  if (!el) return
  const card = el.querySelector('.rev-card')
  const distance = card ? card.offsetWidth + 16 : 300
  el.scrollBy({ left: dir * distance, behavior: 'smooth' })
}

watch(loading, async (val) => {
  if (!val) {
    await nextTick()
    const ob = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
    }, { threshold: 0.05 })
    sectionEl.value?.querySelectorAll('.rv:not(.vis)').forEach(el => ob.observe(el))
    trackEl.value?.addEventListener('scroll', updateArrows, { passive: true })
    updateArrows()
  }
})

onUnmounted(() => {
  trackEl.value?.removeEventListener('scroll', updateArrows)
})

function toggleExpand(id) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
  } else {
    expanded.value.add(id)
  }
}

function isExpanded(id) {
  return expanded.value.has(id)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section ref="sectionEl" class="rev" id="reviews">
    <div class="s-hdr rv">
      <span class="s-lab">Reviews</span>
      <h2 class="s-ttl">What people <i>say</i></h2>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="rev-track">
      <div v-for="n in 4" :key="n" class="rev-skel"></div>
    </div>

    <!-- Error -->
    <p v-else-if="error" class="rev-error rv">Reviews couldn't be loaded right now.</p>

    <!-- Content -->
    <template v-else-if="aggregate">
      <!-- Aggregate -->
      <div class="rev-agg rv">
        <div class="rev-score">
          <span class="rev-num">{{ aggregate.averageRating }}</span>
          <StarRating :rating="aggregate.averageRating" size="1.2rem" />
          <span class="rev-count">Based on {{ aggregate.totalReviews }} reviews</span>
        </div>
        <div class="rev-badges">
          <a :href="aggregate.platforms.trustpilot.url" target="_blank" rel="noopener" class="rev-badge">
            <!-- Trustpilot star icon -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="#00B67A"/>
            </svg>
            <span class="rev-badge-name">Trustpilot</span>
            <span class="rev-badge-score">{{ aggregate.platforms.trustpilot.rating }}</span>
          </a>
          <a :href="aggregate.platforms.google.url" target="_blank" rel="noopener" class="rev-badge">
            <!-- Google G icon -->
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span class="rev-badge-name">Google</span>
            <span class="rev-badge-score">{{ aggregate.platforms.google.rating }}</span>
          </a>
        </div>
      </div>

      <!-- Scrollable review track -->
      <div class="rev-track-wrap rv">
        <button
          v-show="canScrollLeft"
          class="rev-arrow rev-arrow--left"
          aria-label="Scroll left"
          @click="scrollTrack(-1)"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div ref="trackEl" class="rev-track">
        <article
          v-for="review in reviews"
          :key="review.id"
          class="rev-card"
        >
          <div class="rev-card-top">
            <StarRating :rating="review.rating" size="0.85rem" />
            <span class="rev-src" :class="review.source">
              <!-- Trustpilot mini icon -->
              <svg v-if="review.source === 'trustpilot'" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="#00B67A"/>
              </svg>
              <!-- Google mini icon -->
              <svg v-else width="12" height="12" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
          </div>

          <p class="rev-text" :class="{ clamped: !isExpanded(review.id) }">{{ review.text }}</p>

          <button
            v-if="review.text.length > 120"
            class="rev-more"
            @click="toggleExpand(review.id)"
          >{{ isExpanded(review.id) ? 'Show less' : 'Read more' }}</button>

          <div class="rev-meta">
            <span class="rev-author">{{ review.author }}</span>
            <span class="rev-date">{{ formatDate(review.date) }}</span>
            <span v-if="review.verified" class="rev-verified">Verified</span>
          </div>
        </article>
      </div>

        <button
          v-show="canScrollRight"
          class="rev-arrow rev-arrow--right"
          aria-label="Scroll right"
          @click="scrollTrack(1)"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

    </template>
  </section>
</template>

<style scoped>
.rev {
  padding: 5rem 0 5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* Aggregate */
.rev-agg {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 2rem;
  padding-right: 2rem;
}

.rev-score {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.rev-num {
  font-family: var(--serif);
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 1;
  color: var(--dark);
}

.rev-count {
  font-size: 0.82rem;
  color: var(--lt);
}

.rev-badges {
  display: flex;
  gap: 0.6rem;
}

.rev-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border: 1.5px solid var(--sand);
  border-radius: 50px;
  text-decoration: none;
  color: var(--dark);
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.3s var(--ease-out);
}

.rev-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.rev-badge-name {
  font-weight: 600;
}

.rev-badge-score {
  color: var(--mid);
}

/* Track wrapper with arrows */
.rev-track-wrap {
  position: relative;
}

/* Arrows */
.rev-arrow {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--sand);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  color: var(--dark);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ease-out);
}

.rev-arrow:hover {
  background: var(--dark);
  color: var(--bg);
  border-color: var(--dark);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.rev-arrow--left {
  left: -8px;
}

.rev-arrow--right {
  right: 8px;
}

@media (min-width: 601px) {
  .rev-arrow {
    display: flex;
  }
}

/* Scrollable track */
.rev-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
  padding: 0.5rem 0 1.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.rev-track::-webkit-scrollbar {
  display: none;
}

/* Cards */
.rev-card {
  flex: 0 0 30%;
  min-width: 260px;
  scroll-snap-align: start;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.36));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: 20px;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition: transform 0.35s var(--ease-out), box-shadow 0.35s var(--ease-out);
}

.rev-card:last-child {
  margin-right: 2rem;
}

.rev-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
}

.rev-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rev-src {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

/* Review text with clamp */
.rev-text {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--mid);
  margin: 0;
}

.rev-text.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rev-more {
  background: none;
  border: none;
  padding: 0;
  font-family: var(--sans);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--dark);
  cursor: pointer;
  opacity: 0.65;
  transition: opacity 0.2s ease;
  align-self: flex-start;
}

.rev-more:hover {
  opacity: 1;
}

/* Meta */
.rev-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  font-size: 0.78rem;
}

.rev-author {
  font-weight: 600;
  color: var(--dark);
}

.rev-date {
  color: var(--lt);
}

.rev-verified {
  background: rgba(27, 133, 74, 0.1);
  color: var(--forest);
  padding: 0.15rem 0.5rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Skeleton loading */
.rev-skel {
  flex: 0 0 30%;
  min-width: 260px;
  height: 200px;
  background: var(--sand);
  border-radius: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Error */
.rev-error {
  text-align: center;
  color: var(--lt);
  font-size: 0.88rem;
  padding-right: 2rem;
}

/* Responsive */
@media (max-width: 1080px) {
  .rev-card {
    flex: 0 0 45%;
  }
  .rev-skel {
    flex: 0 0 45%;
  }
}

@media (max-width: 600px) {
  .rev {
    padding-left: 1.2rem;
  }
  .rev-card {
    flex: 0 0 85vw;
    min-width: 0;
  }
  .rev-skel {
    flex: 0 0 85vw;
    min-width: 0;
  }
  .rev-agg {
    flex-direction: column;
    align-items: flex-start;
    padding-right: 1.2rem;
  }
  .rev-card:last-child {
    margin-right: 1.2rem;
  }
}
</style>
