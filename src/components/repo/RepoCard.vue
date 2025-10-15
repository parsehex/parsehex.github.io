<template>
	<div v-if="view === 'grid'"
		class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 hover:shadow-xl dark:hover:shadow-lg transition flex flex-col">
		<h2 class="flex items-center text-2xl font-semibold mb-2">
			<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
				class="hover:text-blue-500 dark:hover:text-blue-400"> {{ repo.name }} </a>
			<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" />
		</h2>
		<p class="text-gray-700 dark:text-gray-300 mb-2 flex-grow"> {{ repo.description || 'No description provided.' }}
		</p>
		<div class="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
			<div class="flex items-center gap-2 flex-wrap">
				<Clock class="w-4 h-4" />
				<span v-tippy="formatDate(repo.pushed_at, true)" class="relative"> {{ repo.latest_update?.label }}: {{
					repo.latest_update && showRelativeTime(repo.latest_update.value) }} </span>
			</div>
			<div v-if="repo.created_at" class="flex items-center gap-2 flex-wrap">
				<Calendar class="w-4 h-4" />
				<span v-tippy="formatDate(repo.created_at, true)" class="relative"> Created: {{
					showRelativeTime(repo.created_at) }} </span>
			</div>
		</div>
		<div class="flex items-center gap-4 text-gray-700 dark:text-gray-300 text-sm mt-auto">
			<div v-if="repo.stargazers_count > 0" class="flex items-center gap-1">
				<Star class="w-4 h-4 text-yellow-500" />
				<span>{{ repo.stargazers_count }}</span>
			</div>
			<div v-if="repo.forks_count > 0" class="flex items-center gap-1">
				<GitBranch class="w-4 h-4" />
				<span>{{ repo.forks_count }}</span>
			</div>
			<a v-if="repo.homepage" :href="repo.homepage" target="_blank" rel="noopener noreferrer"
				class="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:border-b">
				<span>{{ repo.homepage }}</span>
			</a>
			<button v-if="hasReadme" @click="$emit('readme-click', repo)"
				class="readme flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				v-tippy="'View README'">
				<BookOpen class="w-4 h-4" />
				<span>README</span>
			</button>
		</div>
	</div>
	<div v-else
		class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-xl dark:hover:shadow-lg transition space-y-2">
		<div class="space-y-2">
			<h2 class="text-xl font-semibold">
				<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
					class="hover:text-blue-500 dark:hover:text-blue-400"> {{ repo.name }} </a>
				<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" />
			</h2>
			<p v-if="repo.description" class="text-gray-700 dark:text-gray-300"> {{ repo.description }} </p>
		</div>
		<div class="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
			<div v-if="repo.stargazers_count > 0" class="flex items-center gap-1">
				<Star class="w-4 h-4 text-yellow-500" />
				<span>{{ repo.stargazers_count }}</span>
			</div>
			<div v-if="repo.forks_count > 0" class="flex items-center gap-1">
				<GitBranch class="w-4 h-4" />
				<span>{{ repo.forks_count }}</span>
			</div>
			<a v-if="repo.homepage" :href="repo.homepage" target="_blank" rel="noopener noreferrer"
				class="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:underline">
				<span>{{ repo.homepage }}</span>
			</a>
			<button v-if="hasReadme" @click="$emit('readme-click', repo)"
				class="readme flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				v-tippy="'View README'">
				<BookOpen class="w-4 h-4" />
				<span>README</span>
			</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Clock, Calendar, Star, GitBranch, BookOpen } from 'lucide-vue-next'
import type { Repo, ReadmeManifestItem } from '../../types'
import { showRelativeTime, formatDate } from '../../utils'
import LangBadge from './LangBadge.vue'

interface Props {
	repo: Repo
	view: 'grid' | 'list'
	readmeManifest: ReadmeManifestItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'readme-click': [repo: Repo]
}>()

const hasReadme = computed(() => props.readmeManifest.some(item => item.repo === props.repo.name && item.success))
</script>
