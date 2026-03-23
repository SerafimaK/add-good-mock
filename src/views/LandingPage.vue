<script setup>
import { onMounted, nextTick } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import MarqueeBand from '../components/MarqueeBand.vue'
import ProductsSection from '../components/ProductsSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import ReviewsSection from '../components/ReviewsSection.vue'
import ScienceSection from '../components/ScienceSection.vue'
import QuizSection from '../components/QuizSection.vue'
import PricingSection from '../components/PricingSection.vue'
import FAQSection from '../components/FAQSection.vue'
import FooterSection from '../components/FooterSection.vue'

onMounted(async () => {
  await nextTick()
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
  }, { threshold: .05 })
  document.querySelectorAll('.rv').forEach(el => ob.observe(el))
})
</script>

<template>
  <HeroSection />
  <MarqueeBand />
  <ProductsSection />
  <HowItWorks />
  <ReviewsSection />
  <ScienceSection />
  <QuizSection />
  <PricingSection />
  <FAQSection />
  <FooterSection />
</template>
