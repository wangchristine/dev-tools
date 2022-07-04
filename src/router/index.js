import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import JsonView from "../views/JsonView.vue";
import EncodeDecodeView from "../views/EncodeDecodeView.vue";
import ErrorView from "../views/ErrorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/json-parser",
      name: "json",
      component: JsonView,
    },
    {
      path: "/encode-decode",
      name: "encode-decode",
      component: EncodeDecodeView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error",
      component: ErrorView,
    },
  ],
});

export default router;
