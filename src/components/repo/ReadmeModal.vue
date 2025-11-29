<template>
	<div v-if="isVisible"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
		:class="{ 'opacity-100': isOpen, 'opacity-0': !isOpen }" @click="$emit('close')">
		<div
			class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
			@click.stop>
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white"> README - {{ repoName }} </h2>
				<button @click="$emit('close')"
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="flex-1 overflow-y-auto p-6">
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
import { sanitizeMdToHtml } from '../../utils'

interface Props {
	isOpen: boolean
	repoName: string
	readmeContent: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
	close: []
}>()

const isVisible = ref(false)
const parsedReadmeContent = ref<string>('')

watch(() => props.isOpen, (newIsOpen) => {
	if (newIsOpen) {
		isVisible.value = true
	} else {
		const timer = setTimeout(() => {
			isVisible.value = false
		}, 300)
		return () => clearTimeout(timer)
	}
}, { immediate: true })

watch(() => props.readmeContent, async (newContent) => {
	if (!newContent) {
		parsedReadmeContent.value = ''
		return
	}
	parsedReadmeContent.value = await sanitizeMdToHtml(newContent)
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
