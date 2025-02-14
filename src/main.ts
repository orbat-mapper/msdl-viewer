import "./assets/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// import { useDark } from "@vueuse/core";
// const isDark = useDark();
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
