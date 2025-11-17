<template>
	<header class="text-center py-4 space-y-2">
		<div class="flex items-center justify-center">
			<img src="/avatar.png" alt="GitHub Avatar"
				class="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center" :aria-label="'Profile avatar image for ' + cfg.ghUsername" />
			<div class="flex flex-col text-left pl-4">
				<h1 class="text-4xl font-bold"> {{ titleParts[0] }}<a v-if="titleParts[1] !== undefined"
						:href="`https://github.com/${cfg.ghUsername}`" target="_blank" rel="noopener noreferrer"
						class="hover:text-blue-500 dark:hover:text-blue-400">{{ cfg.ghUsername }}</a>{{ titleParts[1] }} </h1>
				<p v-if="cfg.headerText" class="text-lg mt-2 text-gray-600 dark:text-gray-400"> {{ cfg.headerText }} </p>
			</div>
		</div>
		<div v-if="cfg.links && cfg.links.length > 0" class="flex justify-center space-x-4 py-2">
			<a v-for="link in cfg.links" :key="link.url" :href="link.url" target="_blank" rel="me noopener noreferrer"
				class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center space-x-1" :aria-label="`Link to ${cfg.ghUsername}${link.name ? ' on ' + link.name : ''}`">
				<Tippy :content="link.icon ? link.name : ''" placement="bottom">
					<Icon v-if="link.icon" :name="link.icon" />
					<span v-else>{{ link.name }}</span>
				</Tippy>
			</a>
		</div>
		<span v-if="lastUpdatedDisplay" class="text-gray-700 dark:text-gray-300 text-sm select-none" v-tippy="{ content: lastUpdatedTooltip, delay: 250, placement: 'bottom' }">Last updated {{
					lastUpdatedDisplay }}</span>
	</header>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { Tippy } from 'vue-tippy';
import { useConfigStore } from './stores/config'
import Icon from './components/Icon.vue';
import { formatDate, showRelativeTime } from './utils';

const cfg = useConfigStore()
const { config } = toRefs(cfg)

const titleParts = computed(() => {
	if (!config.value) return '';
	const title = cfg.siteTitle;
	const username = cfg.ghUsername;
	if (title.includes(username)) {
		return title.split(username);
	}
	return [title];
})

const lastUpdatedTooltip = computed(() => {
	if (!config.value?.lastUpdated) return '';
	return formatDate(config.value.lastUpdated, true);
});
const lastUpdatedDisplay = computed(() => {
	if (!config.value?.lastUpdated) return '';
	return showRelativeTime(config.value.lastUpdated);
});
</script>
