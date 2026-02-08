<template>
	<div class="flex flex-wrap items-center gap-4 text-gray-700 dark:text-gray-300 text-sm mt-auto">
		<Tippy v-if="repo.stargazers_count > 0" class="flex items-center gap-1" :content="starsTooltip">
			<Star class="w-4 h-4 text-yellow-500" />
			<span>{{ repo.stargazers_count }}</span>
		</Tippy>
		<Tippy v-if="repo.forks_count > 0" class="flex items-center gap-1" :content="forksTooltip">
			<GitBranch class="w-4 h-4" />
			<span>{{ repo.forks_count }}</span>
		</Tippy>
		<a v-if="hasProjectPage" :href="`/projects/${projectPageSlug}`"
			class="text-blue-500 dark:text-blue-400 hover:border-b" title="View Project Page"> Learn more </a>
		<div>
			<a :href="repo.homepage" target="_blank" rel="noopener noreferrer"
				class="flex items-center justify-center gap-1 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
				:aria-label="`Visit ${repo.name} homepage`"> Visit <b>{{ repo.name }}</b>
				<ExternalLink class="w-5 h-5 ml-2" />
			</a>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { Tippy } from 'vue-tippy';
import { Star, GitBranch, ExternalLink } from 'lucide-vue-next'
import type { Repo } from '../../types'

interface Props {
	repo: Repo
}

const props = defineProps<Props>()

const projectPages = inject('projectPages') as string[]

const projectPageSlug = computed(() => {
	if (!projectPages) return null
	if (projectPages.includes(props.repo.name)) return props.repo.name

	const fullNameSlug = props.repo.full_name.replace('/', '-').toLowerCase()
	if (projectPages.includes(fullNameSlug)) return fullNameSlug

	// Also try preserving case just in case
	const fullNameSlugCase = props.repo.full_name.replace('/', '-')
	if (projectPages.includes(fullNameSlugCase)) return fullNameSlugCase

	return null
})

const hasProjectPage = computed(() => !!projectPageSlug.value)
const starsTooltip = computed(() => {
	const s = props.repo.stargazers_count > 1 ? 's' : ''
	return props.repo.stargazers_count + ' star' + s
})
const forksTooltip = computed(() => {
	const s = props.repo.forks_count > 1 ? 's' : ''
	return props.repo.forks_count + ' fork' + s
})
</script>
