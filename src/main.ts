/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
// import Draggable from 'vue-draggable-next'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import VOtpInput from "vue3-otp-input"
import VueTelInput from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'
import 'vue3-tree-vue/dist/style.css'


loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(VueTelInput);   
app.component('VueDatePicker', VueDatePicker);
// app.use(Draggable);*
// app.component('draggable', Draggable)
app.component('v-otp-input', VOtpInput)

// Mount vue app
app.mount('#app')


