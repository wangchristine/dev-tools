import { createRouter, createWebHistory } from "vue-router";
import EncodeDecodeView from "../views/EncodeDecodeView.vue";
import ErrorView from "../views/ErrorView.vue";
import HomeView from "../views/HomeView.vue";
import ImageEditorView from "../views/ImageEditorView.vue";
import JsonView from "../views/JsonView.vue";

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
      path: "/image-editor",
      name: "image-editor",
      component: ImageEditorView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error",
      component: ErrorView,
    },
  ],
});

export default router;
