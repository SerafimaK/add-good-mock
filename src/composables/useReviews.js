import { ref, onMounted } from 'vue'
import { reviewsData } from '../data/reviewsData.js'

async function fetchReviews() {
  return reviewsData
  // FUTURE: uncomment when backend is ready
  // const res = await fetch('/api/reviews')
  // if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`)
  // return res.json()
}

export function useReviews() {
  const reviews = ref([])
  const aggregate = ref(null)
  const loading = ref(true)
  const error = ref(null)

  onMounted(async () => {
    try {
      const data = await fetchReviews()
      aggregate.value = data.aggregate
      reviews.value = data.reviews
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return { reviews, aggregate, loading, error }
}
