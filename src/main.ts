import { Component, createApp } from 'vue';
import { createPinia } from 'pinia';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import './index.css';
import { createHead } from '@unhead/vue/client';

export default function createVueApp(App: Component) {
	const app = createApp(App);
	const pinia = createPinia();
	app.use(pinia);
	app.use(
		createHead({
			init: [
				{
					htmlAttrs: { lang: 'en-US' },
				},
			],
		})
	);
	app.use(VueTippy, {
		defaultProps: {},
	});
	return app;
}
