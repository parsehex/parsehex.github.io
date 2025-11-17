<template>
	<section
		class="hero prose dark:prose-invert p-6 pb-2 bg-white dark:bg-gray-800  shadow-md transition rounded flex flex-col items-center"
		:class="{}">
		<div ref="heroContent" v-html="parsedMarkdown"
			:class="{ 'truncated-content': isTruncated && needsTruncation, 'text-center': config.hero.center, 'text-left': !config.hero.center }"
			@click="isTruncated && needsTruncation && toggleTruncate()">
		</div>
		<div v-if="needsTruncation" @click="toggleTruncate" class="w-full py-2 cursor-pointer">
			<svg :class="{ 'rotate-180': !isTruncated }"
				class="mx-auto w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none"
				stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
			</svg>
		</div>
	</section>
</template>
<script setup lang="ts">
import { ref, watch, nextTick, onMounted, inject } from 'vue'
import { Config } from './types';
import { sanitizeMd } from './utils';

const TRUNCATE_HEIGHT = 300;
const isTruncated = ref(true);
const heroContent = ref<HTMLElement | null>(null);

const toggleTruncate = () => {
	isTruncated.value = !isTruncated.value;
};

const needsTruncation = ref(false);

const checkTruncation = () => {
	if (heroContent.value) {
		needsTruncation.value = heroContent.value.scrollHeight > TRUNCATE_HEIGHT;
	} else {
		needsTruncation.value = false;
	}
};

interface Props {
	source: string
}

const props = defineProps<Props>()
const config = inject('config') as Config

const parsedMarkdown = ref('');

watch(() => props.source, async (newSource) => {
	if (!newSource) {
		parsedMarkdown.value = ''
		return
	}
	parsedMarkdown.value = await sanitizeMd(newSource)
	await nextTick(); // Ensure DOM is updated before checking scrollHeight
	checkTruncation();
}, { immediate: true })

onMounted(() => {
	checkTruncation();
});
</script>
<style>
/* Custom styles for markdown elements */
@reference './index.css';

.truncated-content {
	max-height: 300px;
	/* This should match TRUNCATE_HEIGHT */
	overflow: hidden;
	position: relative;
}

.truncated-content::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	/* Height of the fade effect */
	background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
	pointer-events: none;
	/* Allow clicks to pass through to the indicator */
}

@media (prefers-color-scheme: dark) {
	.truncated-content::after {
		background: linear-gradient(to top, rgba(31, 41, 55, 1), rgba(0, 0, 0, 0));
		/* Dark mode background */
	}
}

h1,
h2 {
	margin-top: 0 !important;
}

.hero h2 {
	border-bottom: 1px solid lightgray;
	padding-bottom: .3em;
}

.prose {
	max-width: inherit;
}

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
