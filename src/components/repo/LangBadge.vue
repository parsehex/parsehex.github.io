<template>
	<div v-if="language" class="inline-flex items-center">
		<Tippy class="inline-flex items-center px-2 py-1 ml-4 text-xs font-semibold select-none rounded"
			:style="{ backgroundColor: color, color: contrast }" role="status"
			:aria-label="`This repo primarily uses ${language}. Hover to see all language usage.`"
			:content="languageDistributionHtml" :delay="[100, 50]" :allow-h-t-m-l="true" placement="top" :interactive="true"
			theme="light-border" max-width="none"> {{ language }} </Tippy>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Tippy } from 'vue-tippy';
import { getColor, getContrastYIQ } from '../../utils'

interface Props {
	language: string
	languages?: { [key: string]: number }
}

const props = defineProps<Props>()

const color = computed(() => getColor(props.language))
const contrast = computed(() => getContrastYIQ(color.value))

const sortedLanguages = computed(() => {
	if (!props.languages) return {}
	return Object.entries(props.languages)
		.sort(([, percentA], [, percentB]) => percentB - percentA)
		.reduce((acc, [lang, percent]) => ({ ...acc, [lang]: percent }), {})
})

const languageDistributionHtml = computed(() => {
	if (!props.languages || Object.keys(props.languages).length === 0) return ''

	// Language list:
	let html = '<div class="lang p-2 bg-white dark:bg-gray-700 rounded-md shadow-xl">'
	for (const [lang, percent] of Object.entries(sortedLanguages.value)) {
		html += `<div class="flex justify-between text-sm gap-4 py-0.5">
					<span  class="text-gray-800 dark:text-gray-200">${lang}</span>
					<span style="color: ${getColor(lang)}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${(percent as number).toFixed(1)}%</span>
				</div>`
	}
	// Colors bar:
	html += '<div class="lang flex w-full h-2 rounded-b-md overflow-hidden mt-2">'
	for (const [lang, percent] of Object.entries(sortedLanguages.value)) {
		html += `<div style="width: ${percent}%; background-color: ${getColor(lang)};" class="h-full"></div>`
	}
	html += '</div></div>'
	return html
})
</script>
<style scoped>
div>*>*:not(.lang) {
	background-color: transparent;
}
</style>
