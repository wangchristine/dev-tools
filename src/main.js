/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import specific icons */
import { fas } from "@fortawesome/free-solid-svg-icons";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/base.css";

const app = createApp(App);

/* add icons to the library */
library.add(fas);

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.use(router);

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
