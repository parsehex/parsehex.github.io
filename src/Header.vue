<template>
	<header class="text-center py-4 space-y-2">
		<div class="flex items-center justify-center">
			<img src="/avatar.png" alt="GitHub Avatar"
				class="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center"
				:aria-label="'Profile avatar image for ' + ghUsername" />
			<div class="flex flex-col text-left pl-4">
				<h1 class="text-4xl font-bold"> {{ titleParts[0] }}<a v-if="titleParts[1] !== undefined"
						:href="`https://github.com/${ghUsername}`" target="_blank" rel="noopener noreferrer"
						class="hover:text-blue-500 dark:hover:text-blue-400">{{ ghUsername }}</a>{{ titleParts[1] }} </h1>
				<p v-if="headerText" class="text-lg mt-2 text-gray-600 dark:text-gray-400"> {{ headerText }} </p>
			</div>
		</div>
		<div v-if="links && links.length > 0" class="flex justify-center space-x-4 py-2">
			<a v-for="link in links" :key="link.url" :href="link.url" target="_blank" rel="me noopener noreferrer"
				class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center space-x-1"
				:aria-label="`Link to ${ghUsername}${link.name ? ' on ' + link.name : ''}`">
				<Tippy :content="link.icon ? link.name : ''" placement="bottom">
					<Icon v-if="link.icon" :name="link.icon" />
					<span v-else>{{ link.name }}</span>
				</Tippy>
			</a>
		</div>
		<Tippy class="text-gray-700 dark:text-gray-300 text-sm select-none" :content="lastUpdatedTooltip" placement="bottom"
			:delay="250"> Last updated {{ lastUpdatedDisplay }} </Tippy>
	</header>
</template>
<script setup lang="ts">
import { computed, ComputedRef, inject } from 'vue'
import { Tippy } from 'vue-tippy';
import Icon from './components/Icon.vue';
import { formatDate, showRelativeTime } from './utils';
import { Config } from './types';

const config = inject('config') as Config
const ghUsername = inject('ghUsername') as string
const siteTitle = inject('siteTitle') as ComputedRef<string>

const { headerText, links } = config

const titleParts = computed(() => {
	if (!config) return '';
	const username = ghUsername;
	const titleTemplate = siteTitle.value;
	if (titleTemplate.includes(username)) {
		return titleTemplate.split(username);
	}
	return [titleTemplate];
})

const lastUpdatedTooltip = computed(() => {
	if (!config.lastUpdated) return '';
	return formatDate(config.lastUpdated, true);
});
const lastUpdatedDisplay = computed(() => {
	if (!config.lastUpdated) return '';
	return showRelativeTime(config.lastUpdated);
});
</script>
