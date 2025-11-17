import { Component, createApp } from 'vue';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';

export default function createVueApp(App: Component) {
	const app = createApp(App);
	app.use(VueTippy, {
		defaultProps: {},
	});
	return app;
}
