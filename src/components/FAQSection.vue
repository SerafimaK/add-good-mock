<template>
  <section class="faq" id="faq">
    <div class="s-hdr rv">
      <span class="s-lab">FAQ</span>
      <h2 class="s-ttl">Questions &amp; <i>answers</i></h2>
    </div>

    <div class="faq-list">
      <details v-for="(group, gi) in groups" :key="gi" class="faq-group rv">
        <summary class="faq-cat">{{ group.category }}</summary>
        <details v-for="(item, i) in group.items" :key="i" class="faq-item">
          <summary class="faq-q">{{ item.q }}</summary>
          <div class="faq-a" v-html="item.a"></div>
        </details>
      </details>
    </div>
  </section>
</template>

<script setup>
const groups = [
  {
    category: 'The Product',
    items: [
      {
        q: 'What is Add Good?',
        a: 'Add Good makes customizable skincare boosters — concentrated drops you mix into your own moisturizer. Each booster features a hero ingredient from nature, paired with a clinically proven active. You choose the booster, pick your bonus ingredients, and build a formula that fits your skin.'
      },
      {
        q: 'What boosters do you have?',
        a: `<strong>GLOW</strong> — Rice Ferment Filtrate + Niacinamide 5%. For radiance, even tone, and brightening.<br>
<strong>PLUMP</strong> — Snow Mushroom + Multi-molecular Hyaluronic Acid. For deep hydration, plumping, and softness.<br>
<strong>FIRM</strong> — Sea Kelp Bioferment + Peptide Complex. For firmness, lifting, and skin tone.`
      },
      {
        q: 'What are bonus ingredients?',
        a: 'Each booster comes with a selection of compatible bonus ingredients you can add to customize your formula. Options include Centella Asiatica (soothes and repairs), Bakuchiol (plant-based retinol alternative), Licorice Root (brightening), and Squalane (moisture lock). Every combination within a booster is safe and effective — you can add one, two, three, or none.'
      },
      {
        q: 'What is Red Gold?',
        a: 'Red Gold is our optional astaxanthin add-on — a carotenoid from Haematococcus pluvialis microalgae. It\'s one of the most powerful natural antioxidants on Earth. It tints your booster a warm coral color but leaves no visible color on your skin. Available for all three boosters.'
      },
      {
        q: 'Will the Red Gold color stain my skin?',
        a: 'No. The concentration of astaxanthin is sufficient for antioxidant benefit but too low to leave visible pigment on the skin. The coral tint is only visible in the product itself.'
      }
    ]
  },
  {
    category: 'How to Use',
    items: [
      {
        q: 'How do I use the boosters?',
        a: 'Three steps, three seconds: 1) Take your regular moisturizer. 2) Add 2–3 drops of your booster. 3) Mix and apply as usual. No extra steps, no new routine — just an upgrade to what you already do.'
      },
      {
        q: 'Can I use a booster without my own cream?',
        a: 'The boosters are designed to be mixed into a moisturizer. They\'re concentrated formulas, not standalone products. If you don\'t have a cream you like, we\'re working on a minimalist base cream (coming soon).'
      },
      {
        q: 'Can I mix two different boosters together?',
        a: 'We recommend using one booster at a time per application. But you can absolutely use different boosters at different times — for example, GLOW in the morning and PLUMP at night.'
      },
      {
        q: 'How long does one sachet last?',
        a: 'Each sachet contains 15 ml. At 2–3 drops per day, one sachet lasts approximately 60–90 days (about 2–3 months).'
      }
    ]
  },
  {
    category: 'Ingredients & Safety',
    items: [
      {
        q: 'Are your products vegan?',
        a: 'Yes. Everything is 100% plant and fungi based. No animal-derived ingredients — ever. Our squalane comes from olives, not sharks. Our astaxanthin comes from microalgae, not fish.'
      },
      {
        q: 'Are your products cruelty-free?',
        a: 'Yes. We do not test on animals at any stage of development or production.'
      },
      {
        q: 'Are the ingredients backed by science?',
        a: 'Every active ingredient in our formulas is supported by published research. We share the evidence on each ingredient page.'
      },
      {
        q: 'Can I use the boosters if I have sensitive skin?',
        a: 'Our ingredients are chosen for their gentleness. Centella Asiatica is available as a bonus ingredient for all three boosters and is known for soothing and barrier repair. Bakuchiol offers anti-aging benefits without the irritation of retinol. That said, if you have specific allergies or medical skin conditions, we recommend checking the full ingredient list and consulting your dermatologist.'
      },
      {
        q: 'What does "fermented" mean in your ingredients?',
        a: 'Fermentation is a process where microorganisms break down raw ingredients into smaller, more bioavailable compounds. In the case of our Rice Ferment (GLOW) and Sea Kelp Bioferment (FIRM), fermentation unlocks amino acids, peptides, and organic acids that weren\'t present in the raw material — making them easier for the skin to absorb.'
      }
    ]
  },
  {
    category: 'Ordering & Shipping',
    items: [
      {
        q: 'How much does a booster cost?',
        a: 'A single booster is $11.90. The Trio (all three boosters) is $29.90 — a 16% saving. Red Gold is an optional add-on for +$1.00 per booster.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'We currently ship within the United States. International shipping is on our roadmap — sign up for our newsletter to be the first to know when it\'s available.'
      },
      {
        q: 'How much is shipping?',
        a: 'Shipping is calculated at checkout based on your order. Our sachets are lightweight, so costs are kept low.'
      },
      {
        q: 'What\'s in the package?',
        a: 'Each order arrives in a branded envelope containing your sachet(s), a wooden mixing stick, and a scented instruction card. We designed the unboxing to be a small sensory experience, not just a delivery.'
      }
    ]
  },
  {
    category: 'About the Brand',
    items: [
      {
        q: 'Why sachets instead of bottles?',
        a: 'Sachets are how we start — they keep our costs low and our prices accessible. They\'re also practical: lightweight, travel-friendly, and you use every drop. As we grow, the format may evolve, but the philosophy stays the same — great ingredients at a fair price.'
      },
      {
        q: 'What does "add good to your routine" mean?',
        a: 'It\'s literal. You already have a routine. We\'re not asking you to replace anything — just add something good to it. A few drops that bring plant and fungi science into whatever cream you already trust.'
      },
      {
        q: 'Where are your products made?',
        a: 'Our products are formulated and produced in the United States.'
      },
      {
        q: 'How can I contact you?',
        a: 'Reach us at hello@addgood.com or through the contact form on our website. We read and respond to every message.'
      }
    ]
  }
]
</script>

<style scoped>
.faq {
  padding: 4rem 2rem;
  background: var(--bg);
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
}

.faq-group {
  margin-bottom: .5rem;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.faq-cat {
  font-family: var(--serif);
  font-size: 1.1rem;
  font-weight: 400;
  font-style: italic;
  color: var(--dark);
  padding: .6rem .2rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.faq-cat::-webkit-details-marker { display: none; }

.faq-cat::after {
  content: '+';
  font-family: var(--sans);
  font-size: 1.2rem;
  font-weight: 300;
  color: var(--mid);
  flex-shrink: 0;
}

details.faq-group[open] > .faq-cat::after {
  content: '−';
}

.faq-item {
  border-bottom: 1px solid rgba(0, 0, 0, .07);
}

.faq-q {
  padding: .9rem .2rem;
  font-family: var(--sans);
  font-size: .88rem;
  font-weight: 600;
  color: var(--dark);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  user-select: none;
}

.faq-q::-webkit-details-marker { display: none; }

.faq-q::after {
  content: '+';
  font-family: var(--sans);
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--mid);
  flex-shrink: 0;
  transition: transform .3s;
}

details[open] > .faq-q::after {
  content: '−';
}

.faq-a {
  padding: 0 .2rem .9rem;
  font-size: .84rem;
  line-height: 1.65;
  color: var(--mid);
}

@media (max-width: 700px) {
  .faq { padding: 3rem 1.2rem; }
}
</style>
