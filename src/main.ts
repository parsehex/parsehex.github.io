import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import './index.css';
import App from './App.vue';
import { useColorMode } from '@vueuse/core'

useColorMode()

const app = createApp(App);
app.use(createPinia());
app.use(VueTippy, {
	defaultProps: {},
});
app.mount('#app');
