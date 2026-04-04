# Add Good — Концепция v2
## Airless флакон 30 мл · Ценовая модель · Полный копирайт

---

## 1. Формат продукта

| Параметр | Значение |
|----------|----------|
| Формат | Airless pump флакон |
| Объём | 30 мл |
| Дозировка | 1–2 нажатия на применение |
| Хватает на | ~30 применений (~1 месяц) |
| Текстура | Гелевая |

---

## 2. Ценовая модель

| Позиция | Цена |
|---------|------|
| Базовый бустер (GLOW / PLUMP / FIRM) | **$11.90** |
| Кастом-ингредиент (Centella, Bakuchiol, Licorice, Squalane) | **+$1.00 каждый** |
| Red Gold (Astaxanthin) | **+$2.00** |
| Макс. кастомизация (3 бонуса + Red Gold) | **$16.90** |
| Доставка при заказе 3+ флаконов | **Бесплатная** |

Trio — не фиксированная цена, а просто «3 любых бустера = бесплатная доставка». Каждый из трёх кастомизируется отдельно.

---

## 3. Суть продукта — elevator pitch

> Add Good — plant & fungi boosters that upgrade any cream you already own.

---

## 4. Hero-текст

**Tag:** Skincare boosters

**H1:**
Don't replace your cream.
*Add good* to it.

**Subtitle:**
Your cream is already good. Add Good makes it work harder. 1–2 presses onto your palm, your moisturizer on top, blend with your fingertip, apply. Choose your booster by what your skin needs right now.

**Micro-note:** 1–2 presses. Your cream. A better formula.

---

## 5. How It Works

**Label:** How it works

**H2:** Three seconds. *That's it.*

| Шаг | Title | Text |
|-----|-------|------|
| 1 | **Pump** | 1–2 presses of your booster onto your palm. |
| 2 | **Add your cream** | Any moisturizer you already use — right on top. |
| 3 | **Mix & apply** | Blend with your fingertip. Done. |

---

## 6. Products Section — The Trio

**Label:** The Trio

**H2:** Three boosters. *Your formula.*

**Subtitle:** Each booster is a complete formula. Customize with extra actives to match exactly what your skin needs.

---

## 7. Trio Routine — три бустера, три задачи

### Логика для пользователя

Три бустера существуют потому, что кожа не просит одно и то же каждый день. Секция не продаёт количество — она объясняет, почему формулы разные и когда какая уместна. Пользователь сам решает, нужен ему один, два или три.

### Текст для секции

**Label:** The routine

**H2:** Same cream. *Different day.*

**Intro:** Your skin doesn't ask for the same thing every day. Radiance before work, deep hydration overnight, a firming boost when your skin feels tired — one moisturizer handles it all with the right booster.

| Бустер | Когда | Одна фраза |
|--------|-------|------------|
| **GLOW** | Morning | Rice ferment + niacinamide. Radiance before the day starts. |
| **PLUMP** | Evening | Snow mushroom + hyaluronic acid. Deep hydration while you sleep. |
| **FIRM** | When you need it | Sea kelp + peptides. Firmness and bounce on demand. |

**Bottom note:** Free shipping on orders of 3+ bottles.

---

## 8. Pricing Section

**Label:** Shop

**H2:** Build your formula.

### Single Booster

```
[GLOW / PLUMP / FIRM]
from $11.90
30 ml · ~30 uses
+ $1 per custom active · + $2 Red Gold
[Customize →]  [Add base →]
```

### Buy 3 — Free Shipping

```
Buy any 3 boosters
Free shipping
Mix and match · Customize each one
[Build your set →]
```

---

## 9. Booster Card — ценовая логика (expanded state)

При кастомизации пользователь видит, как меняется цена:

```
GLOW base                      $11.90
+ Centella Asiatica             +$1.00
+ Bakuchiol                     +$1.00
─────────────────────────────────────
Your formula                    $13.90
```

С Red Gold:

```
GLOW base                      $11.90
+ Centella Asiatica             +$1.00
+ Red Gold (Astaxanthin)        +$2.00
─────────────────────────────────────
Your formula                    $14.90
```

Максимум:

```
GLOW base                      $11.90
+ Centella                      +$1.00
+ Bakuchiol                     +$1.00
+ Licorice Root                 +$1.00
+ Red Gold (Astaxanthin)        +$2.00
─────────────────────────────────────
Your formula                    $16.90
```

---

## 10. Изменения в коде

### cart.js

```javascript
export const BASE_PRICE = 11.90
export const BONUS_PRICE = 1.00      // NEW
export const RED_GOLD_PRICE = 2.00   // CHANGED from 1.00
export const FREE_SHIPPING_QTY = 3   // NEW: 3+ bottles = free shipping
// REMOVED: TRIO_PRICE (no longer a fixed bundle price)
```

Расчёт цены каждого бустера:
```javascript
const price = BASE_PRICE
  + (bonuses.length * BONUS_PRICE)
  + (redGold ? RED_GOLD_PRICE : 0)
```

### HowItWorks.vue

```javascript
const steps = [
  { num: '1', title: 'Pump',          text: '1–2 presses of your booster onto your palm.',       color: 'gold' },
  { num: '2', title: 'Add your cream', text: 'Any moisturizer you already use — right on top.', color: 'forest' },
  { num: '3', title: 'Mix & apply',    text: 'Blend with your fingertip. Done.',                color: 'ocean' },
]
```

### HeroSection.vue — текстовые замены

```
OLD: "Three concentrated drops from rice fields, ancient forests, and the deep ocean. Add them to any cream you already love."
NEW: "Your cream is already good. Add Good makes it work harder. 1–2 presses onto your palm, your moisturizer on top, blend with your fingertip, apply. Choose your booster by what your skin needs right now."

OLD: "Add 2-3 drops to any moisturizer."
NEW: "1–2 presses. Your cream. A better formula."

OLD: The Trio · $29.90
NEW: 3 boosters = free shipping
```

### ProductsSection.vue

```
OLD: "Three drops. Your formula."
NEW: "Three boosters. Your formula."
```

### PricingSection.vue

```
OLD: Single Booster · $11.90 · 15 ml
NEW: Single Booster · from $11.90 · 30 ml · ~30 uses

OLD: The Trio · $29.90 · Save 16%
NEW: Buy 3 = Free Shipping · Mix and match · Customize each one
```

---

## 11. Что снято / решено

- [x] Формат: airless pump вместо саше
- [x] Объём: 30 мл
- [x] Ценовая модель: $11.90 + $1/custom + $2/Red Gold
- [x] Trio: не фиксированная цена, а «3 шт = бесплатная доставка»
- [x] «Drops» → «pumps» по всему сайту
- [x] Убрана метафора с гардеробом
- [x] Убрано «rough night»
- [x] «One pump» → «1–2 presses»
- [x] Подписка — не сейчас
- [x] Визуал флакона — отдельно позже
