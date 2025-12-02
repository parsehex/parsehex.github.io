<template>
	<div v-if="view === 'grid'"
		class="bg-white dark:bg-gray-800/60 shadow-md rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 dark:border-gray-700/50">
		<div class="flex flex-wrap items-center mb-3 gap-3">
			<h2 class="flex-1 grow text-2xl font-semibold font-heading break-words">
				<a v-if="hasReadme" :href="`/projects/${repo.name.replace(/\//g, '-')}/readme`"
					class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"> {{ repo.name }} </a>
				<span v-else>{{ repo.name }}</span>
			</h2>
			<div class="flex items-center gap-2 flex-shrink-0">
				<Tippy v-if="repo.homepage" content="Visit homepage">
					<a :href="repo.homepage" target="_blank" rel="noopener noreferrer"
						class="flex items-center justify-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
						:aria-label="`Visit ${repo.name} homepage`">
						<ExternalLink class="w-5 h-5" />
					</a>
				</Tippy>
				<Tippy content="View on GitHub">
					<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
						class="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
						:aria-label="`View ${repo.name} on GitHub`">
						<Github class="w-5 h-5" />
					</a>
				</Tippy>
			</div>
			<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" :lang-colors="langColors" />
		</div>
		<p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"> {{ repo.description || 'No description provided.'
		}} </p>
		<div class="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-2">
			<div class="flex items-center gap-2 flex-wrap">
				<Clock class="w-4 h-4" />
				<Tippy :content="formatDate(repo.pushed_at, true)"> {{ repo.latest_update?.label }}: {{ repo.latest_update &&
					showRelativeTime(repo.latest_update.value) }} </Tippy>
			</div>
			<div v-if="repo.created_at" class="flex items-center gap-2 flex-wrap">
				<Calendar class="w-4 h-4" />
				<Tippy :content="formatDate(repo.created_at, true)"> Created: {{ showRelativeTime(repo.created_at) }} </Tippy>
			</div>
		</div>
		<div v-if="repo.topics && repo.topics.length > 0" class="flex flex-wrap gap-2 mb-4 mt-auto">
			<TopicBadge v-for="topic in repo.topics" :key="topic" :topic="topic" />
		</div>
		<CardFooter :view="view" :repo="repo" />
	</div>
	<div v-else
		class="bg-white dark:bg-gray-800/60 shadow-md rounded-xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 space-y-3 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
		<div class="flex items-start justify-between gap-3">
			<div class="flex-1 space-y-2">
				<h2 class="text-xl font-semibold font-heading">
					<a v-if="hasReadme" :href="`/projects/${repo.name.replace(/\//g, '-')}/readme`"
						class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"> {{ repo.name }} </a>
					<span v-else>{{ repo.name }}</span>
				</h2>
				<p v-if="repo.description" class="text-gray-600 dark:text-gray-300 leading-relaxed"> {{ repo.description }} </p>
			</div>
			<div class="flex items-center gap-2 flex-shrink-0">
				<Tippy v-if="repo.homepage" content="Visit homepage">
					<a :href="repo.homepage" target="_blank" rel="noopener noreferrer"
						class="flex items-center justify-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
						:aria-label="`Visit ${repo.name} homepage`">
						<ExternalLink class="w-5 h-5" />
					</a>
				</Tippy>
				<Tippy content="View on GitHub">
					<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
						class="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
						:aria-label="`View ${repo.name} on GitHub`">
						<Github class="w-5 h-5" />
					</a>
				</Tippy>
			</div>
			<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" :lang-colors="langColors" />
		</div>
		<div v-if="repo.topics && repo.topics.length > 0" class="flex flex-wrap gap-2 mb-2">
			<TopicBadge v-for="topic in repo.topics" :key="topic" :topic="topic" />
		</div>
		<CardFooter :view="view" :repo="repo" />
	</div>
</template>
<script setup lang="ts">
import { Clock, Calendar, Github, ExternalLink } from 'lucide-vue-next'
import type { Repo, ReadmeManifestItem } from '../../types'
import { showRelativeTime, formatDate } from '../../utils'
import LangBadge from './LangBadge.vue'
import TopicBadge from './TopicBadge.vue'
import CardFooter from './CardFooter.vue'
import { computed, inject } from 'vue'
import { Tippy } from 'vue-tippy'

interface Props {
	repo: Repo
	view: 'grid' | 'list'
	readmeManifest: ReadmeManifestItem[]
	langColors: any
}

const props = defineProps<Props>()

const ghUsername = inject('ghUsername') as string

const hasReadme = computed(() => props.readmeManifest.some(item => item.repo === props.repo.name && item.success))
</script>
