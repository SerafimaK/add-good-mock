<template>
  <footer>
    <div class="fl">Add <b>Good</b></div>
    <div class="ftg">add good to your routine</div>
    <div class="flk">
      <a href="#products">Shop</a>
      <a href="#">Ingredients</a>
      <a href="#">FAQ</a>
      <a href="#">Contact</a>
    </div>
    <div class="fbd">
      <span class="fbg">Plant & Fungi Based</span>
      <span class="fbg">Vegan</span>
      <span class="fbg">Cruelty-Free</span>
    </div>
    <div class="fcp">&copy; 2026 Add Good</div>
  </footer>
</template>

<style scoped>
footer {
  padding: 3rem 2rem 1.5rem; background: var(--dark); text-align: center;
}
.fl {
  font-family: var(--serif); font-size: 1.3rem; color: var(--bg); margin-bottom: .2rem;
}
.fl b { font-style: italic; font-weight: 400; color: rgba(62,95,55,.55); }
.ftg {
  font-size: .78rem; font-style: italic; color: rgba(248,245,240,.2); margin-bottom: 1.5rem;
}
.flk {
  display: flex; gap: 1.5rem; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;
}
.flk a {
  color: rgba(248,245,240,.3); text-decoration: none; font-size: .7rem;
  letter-spacing: .07em; text-transform: uppercase; transition: color .3s;
}
.flk a:hover { color: var(--bg); }
.fbd {
  display: flex; gap: .6rem; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;
}
.fbg {
  font-size: .55rem; letter-spacing: .1em; text-transform: uppercase;
  color: rgba(248,245,240,.18); border: 1px solid rgba(248,245,240,.07);
  padding: .2rem .6rem; border-radius: 50px;
}
.fcp { font-size: .6rem; color: rgba(248,245,240,.1); }
</style>
