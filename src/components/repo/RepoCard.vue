<template>
	<div v-if="view === 'grid'"
		class="bg-white dark:bg-gray-800/60 shadow-md rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
		<h2 class="flex items-center text-2xl font-semibold mb-3 font-heading">
			<Tippy :content="linkTooltipCfg.content" :delay="linkTooltipCfg.delay">
				<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
					class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" :aria-label="linkLabel"> {{ repo.name
					}} </a>
			</Tippy>
			<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" />
		</h2>
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
		<CardFooter :view="view" :repo="repo" :readme-manifest="readmeManifest"
			@readme-click="$emit('readme-click', repo)" />
	</div>
	<div v-else
		class="bg-white dark:bg-gray-800/60 shadow-md rounded-xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 space-y-3 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
		<div class="space-y-2">
			<h2 class="text-xl font-semibold font-heading">
				<Tippy :content="linkTooltipCfg.content" :delay="linkTooltipCfg.delay">
					<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
						class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" :aria-label="linkLabel"> {{ repo.name
						}}</a>
				</Tippy>
				<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" />
			</h2>
			<p v-if="repo.description" class="text-gray-600 dark:text-gray-300 leading-relaxed"> {{ repo.description }} </p>
		</div>
		<div v-if="repo.topics && repo.topics.length > 0" class="flex flex-wrap gap-2 mb-2">
			<TopicBadge v-for="topic in repo.topics" :key="topic" :topic="topic" />
		</div>
		<CardFooter :view="view" :repo="repo" :readme-manifest="readmeManifest" @readme-click="toggleReadme" />
		<ExpandableReadme :is-expanded="isReadmeExanded" @toggle="toggleReadme" :repo-name="repo?.name || ''"
			:readme-content="readmeContent" />
	</div>
</template>
<script setup lang="ts">
import { Clock, Calendar } from 'lucide-vue-next'
import type { Repo, ReadmeManifestItem, Config } from '../../types'
import { showRelativeTime, formatDate } from '../../utils'
import LangBadge from './LangBadge.vue'
import TopicBadge from './TopicBadge.vue'
import CardFooter from './CardFooter.vue'
import { computed, inject, onMounted, ref } from 'vue'
import ExpandableReadme from './ExpandableReadme.vue'
import { Tippy } from 'vue-tippy'

interface Props {
	repo: Repo
	view: 'grid' | 'list'
	readmeManifest: ReadmeManifestItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'readme-click': [repo: Repo]
}>()

const config = inject('config') as Config
const ghUsername = inject('ghUsername') as string

const isReadmeExanded = ref(false)
const readmeContent = ref<string | null>(null)
const expandReadme = async () => {
	const manifestItem = props.readmeManifest.find((item) => item.repo === props.repo.name)

	if (manifestItem?.path) {
		try {
			const response = await fetch(manifestItem.path)
			if (response.ok) {
				readmeContent.value = await response.text()
			} else {
				readmeContent.value = null
			}
		} catch (error) {
			console.error('Error loading README:', error)
			readmeContent.value = null
		}
	} else {
		readmeContent.value = null
	}

	isReadmeExanded.value = true
}
const toggleReadme = () => {
	isReadmeExanded.value = !isReadmeExanded.value
	if (isReadmeExanded.value) expandReadme()
}

const linkLabel = computed(() => {
	return `Link to ${ghUsername}'s project called ${props.repo.name}`
})
const linkTooltipCfg = computed(() => ({
	content: `Go to ${props.repo.name} on GitHub`,
	delay: 150
}))
</script>
