<template>
	<section class="hero p-6 mx-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded"
		:class="{ 'text-center': config?.hero.center }">
		<div v-html="parsedMarkdown"></div>
	</section>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import config from '../config.json'

interface Props {
	source: string
}

const props = defineProps<Props>()

const configHero = config.hero || {}

const parsedMarkdown = ref('')

watch(() => props.source, async (newSource) => {
	if (!newSource) {
		parsedMarkdown.value = ''
		return
	}
	const html = await marked.parse(newSource)
	parsedMarkdown.value = DOMPurify.sanitize(html)
}, { immediate: true })
</script>
<style scoped>
@reference './index.css';

/* Custom styles for markdown elements */
h1 {
	@apply text-4xl font-bold my-4;
}

h2 {
	@apply text-3xl font-semibold my-3;
}

h3 {
	@apply text-2xl font-semibold my-2;
}

p {
	@apply my-2 text-base;
}

ul {
	@apply list-disc list-inside my-2;
}

ol {
	@apply list-decimal list-inside my-2;
}

li {
	@apply ml-6;
}

a {
	@apply text-blue-600 dark:text-blue-400 hover:underline;
}

blockquote {
	@apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400;
}
</style>
