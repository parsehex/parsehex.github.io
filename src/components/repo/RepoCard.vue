<template>
	<div v-if="view === 'grid'"
		class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 hover:shadow-xl dark:hover:shadow-lg transition flex flex-col">
		<h2 class="flex items-center text-2xl font-semibold mb-2">
			<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
				class="hover:text-blue-500 dark:hover:text-blue-400" :aria-label="linkLabel"> {{ repo.name }} </a>
			<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" />
		</h2>
		<p class="text-gray-700 dark:text-gray-300 mb-2"> {{ repo.description || 'No description provided.' }} </p>
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
		<div v-if="repo.topics && repo.topics.length > 0" class="flex flex-wrap gap-2 mb-4">
			<TopicBadge v-for="topic in repo.topics" :key="topic" :topic="topic" />
		</div>
		<CardFooter :view="view" :repo="repo" :readme-manifest="readmeManifest"
			@readme-click="$emit('readme-click', repo)" />
	</div>
	<div v-else
		class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-xl dark:hover:shadow-lg transition space-y-2">
		<div class="space-y-2">
			<h2 class="text-xl font-semibold">
				<a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
					class="hover:text-blue-500 dark:hover:text-blue-400" :aria-label="linkLabel"> {{ repo.name }} </a>
				<LangBadge v-if="repo.language" :language="repo.language" :languages="repo.languages" />
			</h2>
			<p v-if="repo.description" class="text-gray-700 dark:text-gray-300"> {{ repo.description }} </p>
		</div>
		<div v-if="repo.topics && repo.topics.length > 0" class="flex flex-wrap gap-2 mb-4">
			<TopicBadge v-for="topic in repo.topics" :key="topic" :topic="topic" />
		</div>
		<CardFooter :view="view" :repo="repo" :readme-manifest="readmeManifest" @readme-click="toggleReadme" />
		<ExpandableReadme :is-expanded="isReadmeExanded" @toggle="toggleReadme" :repo-name="repo?.name || ''"
			:readme-content="readmeContent" />
	</div>
</template>
<script setup lang="ts">
import { Clock, Calendar } from 'lucide-vue-next'
import { useConfigStore } from '../../stores/config'
import type { Repo, ReadmeManifestItem } from '../../types'
import { showRelativeTime, formatDate } from '../../utils'
import LangBadge from './LangBadge.vue'
import TopicBadge from './TopicBadge.vue'
import CardFooter from './CardFooter.vue'
import { computed, ref } from 'vue'
import ExpandableReadme from './ExpandableReadme.vue'

const cfg = useConfigStore()

interface Props {
	repo: Repo
	view: 'grid' | 'list'
	readmeManifest: ReadmeManifestItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'readme-click': [repo: Repo]
}>()

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

const linkLabel = computed(() => `Link to ${cfg.ghUsername}'s project called ${props.repo.name}`)
</script>
