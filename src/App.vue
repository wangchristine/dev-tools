<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
const isDark = ref(true);
const isSidebarOpen = ref(false);

const menuItems = [
  { name: "home", label: "Home", icon: "house" },
  { name: "json", label: "JSON Parser", icon: "code" },
  { name: "encode-decode", label: "Encode / Decode", icon: "shield-halved" },
  { name: "image-editor", label: "Image Editor", icon: "image" },
];

const currentLabel = computed(() => {
  const item = menuItems.find((item) => item.name === route.name);
  return item ? item.label : route.name;
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  const root = document.documentElement;
  if (isDark.value) {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false;
  },
);

onMounted(() => {
  const theme = localStorage.getItem("theme");
  isDark.value = theme !== "light";
  updateTheme();
});
</script>

<template>
  <div class="app-layout">
    <Transition name="fade">
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
    </Transition>

    <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="brand-wrapper">
          <div class="brand-logo">
            <font-awesome-icon icon="fa-solid fa-terminal" />
          </div>
          <span class="brand-name">Dev Tools</span>
        </div>
        <button class="mobile-close" @click="isSidebarOpen = false">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>

      <nav class="nav-list">
        <RouterLink v-for="item in menuItems" :key="item.name" :to="{ name: item.name }" class="nav-link">
          <div class="icon-box">
            <font-awesome-icon :icon="['fas', item.icon]" />
          </div>
          <span class="label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button @click="toggleTheme" class="theme-switch">
          <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" class="theme-icon" />
          <span>{{ isDark ? "Light Mode" : "Dark Mode" }}</span>
        </button>
      </div>
    </aside>

    <main class="main-container">
      <header class="content-header">
        <div class="header-left">
          <button class="burger-menu" @click="isSidebarOpen = true">
            <font-awesome-icon icon="fa-solid fa-bars" />
          </button>
          <div class="breadcrumb">
            <font-awesome-icon icon="fa-solid fa-chevron-right" class="divider-icon" />
            <span>{{ currentLabel }}</span>
          </div>
        </div>

        <div class="header-right">
          <a href="https://github.com/wangchristine/dev-tools" target="_blank" class="github-link">
            <img v-if="isDark" src="@/assets/github-mark-white.png" alt="github" />
            <img v-else src="@/assets/github.png" alt="github" />
          </a>
        </div>
      </header>

      <div class="content-body">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--surface-2);
}

/* 側邊欄 */
.sidebar {
  width: 260px;
  background-color: var(--surface-1);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  padding: 32px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 32px;
  height: 32px;
  background: var(--brand-color);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.brand-name {
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.nav-list {
  flex: 1;
  padding: 0 16px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.icon-box {
  width: 20px;
  display: flex;
  justify-content: center;
  font-size: 1.1rem;
}

.nav-link:hover,
.router-link-active {
  background-color: var(--brand-color-soft);
  color: var(--brand-color);
}

.sidebar-footer {
  padding: 24px 16px;
}

.theme-switch {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.theme-icon {
  color: #ffc225;
}

/* 主內容區 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-header {
  height: 72px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--surface-1);
  border-bottom: 1px solid var(--border-subtle);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.burger-menu {
  display: none;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: var(--text-primary);
  cursor: pointer;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: capitalize;
}

.divider-icon {
  font-size: 0.7rem;
  opacity: 0.5;
}

.github-link img {
  width: 28px;
  height: 28px;
}

.mobile-close {
  display: none;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* 動畫 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 手機版 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 999;
  }

  .burger-menu {
    display: block;
  }

  .mobile-close {
    display: block;
    background: none;
    border: none;
    font-size: 1.2rem;
    color: var(--text-secondary);
  }

  .content-header {
    padding: 0 20px;
  }
}
</style>
