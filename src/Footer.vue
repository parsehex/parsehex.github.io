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
import { computed, inject } from 'vue'
import DOMPurify from 'dompurify'
import type { Config } from './types'

const config = inject('config') as Config

const footerText = computed(() => config.footer.text ? DOMPurify.sanitize(config.footer.text) : '')
const includeGitCaseLink = computed(() => config.footer.includeGitCaseLink !== false)
</script>
