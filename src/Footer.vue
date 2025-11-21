<template>
	<footer class="mt-8 space-y-2 text-center text-gray-600 dark:text-gray-400">
		<p v-if="footerText" v-html="footerText"></p>
		<p v-if="includeGitCaseLink" class="text-xs"> Showcase your GitHub repositories with <a
				href="https://github.com/ProjectDepot/Gallery" target="_blank" rel="noopener noreferrer"
				class="underline hover:text-blue-500"> ProjectDepot Gallery </a>
		</p>
	</footer>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import type { Config } from './types'
import { sanitizeHtml } from './utils';

interface Props {
	config?: Config
}

const props = defineProps<Props>()
const config = props.config || inject('config') as Config

const footerText = ref('');
const includeGitCaseLink = computed(() => config.footer.includeGitCaseLink !== false)

onMounted(async () => {
	const val = await sanitizeHtml(config.footer.text)
	footerText.value = val || ''
});
</script>
