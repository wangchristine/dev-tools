<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <RouterLink class="brand-title" :to="{ name: 'home' }"
      >Dev Tools</RouterLink
    >
    <!-- <span class="brand-title">Dev Tools</span> -->
    <nav class="tool-link">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'json' }">Json Parser</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
@import "@/assets/base.css";
body {
  background-color: #f7f7f7;
}

header {
  line-height: 1.5;
  font-size: 16px;
  width: 100%;
  height: 60px;
  padding: 15px;
  /* max-height: 100vh; */
  background-color: #ffffff;
  box-shadow: 0px 2px 10px 2px rgb(0 0 0 / 30%);
}

.brand-title {
  margin: 0 20px;
  color: #60b699;
  font-weight: bold;
  font-size: 18px;
  text-decoration: none;
}

nav.tool-link {
  display: inline-block;
  /* text-align: center; */
  /* margin-top: 2rem; */
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

nav a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  nav a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

main {
  display: flex;
  justify-content: space-around;
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
  font-size: 16px;
  height: calc(100vh - 60px);
}

@media (min-width: 1024px) {
  /*  nav {*/
  /*    text-align: left;*/
  /*    margin-left: -1rem;*/
  /*    font-size: 1rem;*/
  /*    padding: 1rem 0;*/
  /*    margin-top: 1rem;*/
  /*  }*/
}
</style>
