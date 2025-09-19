<template>
	<footer class="mt-8 text-center text-gray-600 dark:text-gray-400">
		<p v-if="footerText">{{ footerText }}</p>
		<p class="text-xs"> Showcase your GitHub repositories with <a v-if="includeGitCaseLink"
				href="https://github.com/GitCase-app/GitCase" target="_blank" rel="noopener noreferrer"
				class="underline hover:text-blue-500"> GitCase </a>
			<span v-else>GitCase</span>
		</p>
	</footer>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const footerConfig = ref<any>({})

const loadConfig = async () => {
	let configData: any = null
	try {
		// Try to load config.user.json first
		const userConfigResponse = await fetch('/config.user.json')
		if (userConfigResponse.ok) {
			configData = await userConfigResponse.json()
		}
	} catch (error) {
		// Fall back to config.json
		try {
			const configResponse = await fetch('/config.json')
			if (configResponse.ok) {
				configData = await configResponse.json()
			}
		} catch (error) {
			console.error('Error loading config:', error)
		}
	}
	footerConfig.value = configData?.footer || {}
}

onMounted(() => {
	loadConfig()
})

const footerText = computed(() => footerConfig.value.text || '')
const includeGitCaseLink = computed(() => footerConfig.value.includeGitCaseLink !== false)
</script>
