<template>
	<footer class="mt-8 text-center text-gray-600 dark:text-gray-400">
		<p v-if="footerText">{{ footerText }}</p>
		<p v-if="includeGitCaseLink" class="text-xs"> Showcase your GitHub repositories with <a
				href="https://github.com/ProjectDepot/Gallery" target="_blank" rel="noopener noreferrer"
				class="underline hover:text-blue-500"> Project Depot Gallery </a>
		</p>
	</footer>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useConfigStore } from './stores/config'

const configStore = useConfigStore()
const { config } = toRefs(configStore)

const footerText = computed(() => config.value?.footer.text || '')
const includeGitCaseLink = computed(() => config.value?.footer.includeGitCaseLink !== false)
</script>
