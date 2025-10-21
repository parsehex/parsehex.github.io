<template>
	<div class="flex flex-wrap items-center gap-4 text-gray-700 dark:text-gray-300 text-sm mt-auto">
		<div v-if="repo.stargazers_count > 0" class="flex items-center gap-1" v-tippy="starsTooltip">
			<Star class="w-4 h-4 text-yellow-500" />
			<span>{{ repo.stargazers_count }}</span>
		</div>
		<div v-if="repo.forks_count > 0" class="flex items-center gap-1"  v-tippy="forksTooltip">
			<GitBranch class="w-4 h-4" />
			<span>{{ repo.forks_count }}</span>
		</div>
		<button v-if="hasReadme" @click="$emit('readme-click', repo)"
			class="readme flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
			title="View README">
			<BookOpen class="w-4 h-4" />
			<span>README</span>
		</button>
		<a v-if="repo.homepage" :href="repo.homepage" target="_blank" rel="noopener noreferrer"
			class="grow w-full text-blue-500 dark:text-blue-400 hover:border-b">
			<span>{{ repo.homepage }}</span>
		</a>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Star, GitBranch, BookOpen } from 'lucide-vue-next'
import type { Repo, ReadmeManifestItem } from '../../types'

interface Props {
	repo: Repo
	readmeManifest: ReadmeManifestItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'readme-click': [repo: Repo]
}>()

const hasReadme = computed(() => props.readmeManifest.some(item => item.repo === props.repo.name && item.success))
const starsTooltip = computed(() => {
	const s = props.repo.stargazers_count > 1 ? 's' : ''
	return props.repo.stargazers_count + ' star' + s
})
const forksTooltip = computed(() => {
	const s = props.repo.forks_count > 1 ? 's' : ''
	return props.repo.forks_count + ' fork' + s
})
</script>
