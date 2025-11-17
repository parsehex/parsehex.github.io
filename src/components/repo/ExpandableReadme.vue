<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
		<div @click="$emit('toggle')" class="flex items-center justify-between p-4 cursor-pointer">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">README - {{ repoName }}</h3>
			<button
				class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
				<svg class="w-6 h-6 transition-transform duration-300" :class="{ 'rotate-180': isExpanded }" fill="none"
					stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>
		<div class="overflow-hidden transition-all duration-300 ease-in-out"
			:style="{ maxHeight: isExpanded ? '1000px' : '0px' }">
			<div v-show="isExpanded" class="p-6 border-t border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto">
				<div v-if="parsedReadmeContent" class="prose dark:prose-invert max-w-none" v-html="parsedReadmeContent"></div>
				<div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
					<p>No README available for this repository.</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { sanitizeMd } from '../../utils'

interface Props {
	isExpanded: boolean
	repoName: string
	readmeContent: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
	toggle: []
}>()

const parsedReadmeContent = ref<string>('')

watch(() => props.readmeContent, async (newContent) => {
	if (!newContent) {
		parsedReadmeContent.value = ''
		return
	}
	parsedReadmeContent.value = await sanitizeMd(newContent)
}, { immediate: true })
</script>
<style scoped>
@reference '../../index.css';

.prose :where(h1, h2, h3):not(:where([class~="not-prose"] *)) {
	@apply text-gray-900 dark:text-white;
}

.prose :where(p):not(:where([class~="not-prose"] *)) {
	@apply text-gray-700 dark:text-gray-300;
}

.prose :where(a):not(:where([class~="not-prose"] *)) {
	@apply text-blue-600 dark:text-blue-400 hover:underline;
}

.prose :where(blockquote):not(:where([class~="not-prose"] *)) {
	@apply border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400;
}
</style>
