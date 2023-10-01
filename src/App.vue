<script setup>
import { ref, onMounted, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
let themeIcon = ref("");
onMounted(() => {
  if (localStorage.getItem("theme") === "light") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
});
watch(() => route.name, () => {
  toolLink.value.style.display = "";
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
    themeIcon.value = "🌞";
  } else {
    document.documentElement.className = "";
    localStorage.setItem("theme", "light");
    themeIcon.value = "🌙";
  }
};

const toolLink = ref(null);
const toggleBurger = () => {
  if (toolLink.value.style.display === "") {
    toolLink.value.style.display = "inline-block";
  } else {
    toolLink.value.style.display = "";
  }
};
</script>

<template>
  <header>
    <RouterLink class="brand-title" :to="{ name: 'home' }">Dev Tools</RouterLink>
    <nav class="tool-link" ref="toolLink">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'json' }">Json Parser</RouterLink>
      <RouterLink :to="{ name: 'encode-decode' }">Encode & Decode</RouterLink>
      <RouterLink :to="{ name: 'image-editor' }">Image Editor</RouterLink>
    </nav>
    <button class="burger" @click="toggleBurger">≡</button>
    <div class="header-right">
      <a href="https://github.com/wangchristine/dev-tools" target="_blank" class="github-text">Star me at GitHub!🎉</a>
      <a href="https://github.com/wangchristine/dev-tools" target="_blank" class="github-icon">
        <img src="@/assets/github.png" alt="github">
      </a>
      <button name="theme" class="theme" @click="switchTheme">
        {{ themeIcon }}
      </button>
    </div>
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

header .burger {
  display: none;
  font-weight: bold;
  font-size: 18px;
  border: 0;
  background-color: transparent;
  color: var(--color-block-text1);
  transform: scale(1.5, 1);
}

@media (hover: hover) {
  nav a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

header .header-right {
  float: right;
  display: flex;
}

.github-text {
  text-decoration: none;
  padding: 2px 0 2px 6px;
  margin-right: 20px;
  background-color: rgb(96, 182, 153);
  border-radius: 5px;
  color: rgb(239, 239, 239);
  display: inline;
}

.github-icon {
  display: none;
  margin-right: 16px;
}

.github-icon img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid;
  padding: 2px;
  background-color: #fff;
  color: var(--color-text);
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
  padding: 1rem;
  font-size: 16px;
  height: calc(100vh - 60px);
}

@media (max-width: 830px) {
  .github-text {
    display: none;
  }

  .github-icon {
    display: inline;
  }
}

@media (max-width: 768px) {
  nav.tool-link {
    display: none;
    position: absolute;
    top: 62px;
    left: 0;
    background-color: var(--color-header-background);
    width: 100%;
    padding: 20px;
    z-index: 999;
    box-shadow: 0px 2px 10px 2px rgb(0 0 0 / 30%);
  }

  header .burger {
    display: inline-block;
  }
}
</style>
