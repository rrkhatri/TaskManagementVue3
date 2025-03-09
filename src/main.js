import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PiniaPluginPersistedState from "pinia-plugin-persistedstate";
import Toast from "vue-toastification";
import ApiService from "@/core/services/ApiService";

import App from './App.vue'
import router from './router'
import "vue-toastification/dist/index.css";

const pinia = createPinia()
pinia.use(PiniaPluginPersistedState)

const app = createApp(App)
const toastOptions = {};

app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

app.directive('required', {
    mounted: (el) => {
        el.innerHTML += ' <span style="color: red;">*</span>'
    }
})

ApiService.init(app)

app.mount('#app')
