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
import { computed, onMounted, ref, toRefs } from 'vue'
import DOMPurify from 'dompurify'
import { useConfigStore, Config } from './stores/config'

let configStore: ReturnType<typeof useConfigStore> | null = null
const config = ref<Config | null>(null)

onMounted(() => {
	configStore = useConfigStore()
	const { config: storeConfig } = toRefs(configStore)
	config.value = storeConfig.value
})

const footerText = computed(() => config.value?.footer.text ? DOMPurify.sanitize(config.value?.footer.text) : '')
const includeGitCaseLink = computed(() => config.value?.footer.includeGitCaseLink !== false)
</script>
