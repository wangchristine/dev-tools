import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import JsonView from "../views/JsonView.vue";
import EncodeDecodeView from "../views/EncodeDecodeView.vue";

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
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
