<template>
	<header class="text-center py-4 flex items-center justify-center">
		<img src="/avatar.png" alt="GitHub Avatar"
			class="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center" />
		<div class="flex flex-col text-left pl-4">
			<h1 class="text-4xl font-bold"> {{ titleParts[0] }}<a v-if="titleParts[1] !== undefined"
					:href="`https://github.com/${cfg.ghUsername}`" target="_blank" rel="noopener noreferrer"
					class="hover:text-blue-500 dark:hover:text-blue-400">{{ cfg.ghUsername }}</a>{{ titleParts[1] }} </h1>
			<p v-if="cfg.headerText" class="text-lg mt-2 text-gray-600 dark:text-gray-400"> {{ cfg.headerText }} </p>
		</div>
	</header>
</template>
<script setup lang="ts">
import { useConfigStore } from './stores/config'
import { computed } from 'vue'

const cfg = useConfigStore()

const titleParts = computed(() => {
	const title = cfg.siteTitle;
	const username = cfg.ghUsername;
	if (title.includes(username)) {
		return title.split(username);
	}
	return [title];
})
</script>
