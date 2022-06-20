<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

let themeIcon = ref("");
onMounted(() => {
  if (localStorage.getItem("theme") === "dark") {
    setTheme("dark");
  } else {
    setTheme("light");
  }
});

const switchTheme = () => {
  if (localStorage.getItem("theme") === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
};

const setTheme = (theme) => {
  if (theme == "dark") {
    document.documentElement.className = "dark";
    localStorage.setItem("theme", "dark");
    themeIcon.value = "🌙";
  } else {
    document.documentElement.className = "";
    localStorage.setItem("theme", "light");
    themeIcon.value = "🌞";
  }
};
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
      <RouterLink :to="{ name: 'encode-decode' }">Encode & Decode</RouterLink>
    </nav>
    <span class="header-right">
      <button name="theme" class="theme" @click="switchTheme">
        {{ themeIcon }}
      </button>
    </span>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
@import "@/assets/base.css";

header {
  line-height: 1.5;
  font-size: 16px;
  width: 100%;
  height: 60px;
  padding: 15px;
  /* max-height: 100vh; */
  background-color: var(--color-header-background);
  border-bottom: solid 1px var(--color-header-bottom);
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
  border-left: 1px solid var(--color-header-divider);
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

header .header-right {
  float: right;
}

.theme {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  padding: 0;
}

main {
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
