<template>
	<div class="mx-auto p-4">
		<div class="flex flex-col md:flex-row md:items-start md:justify-center gap-4 mb-4 relative">
			<Header v-if="config?.header" class="md:w-1/3 md:mt-4" />
			<div v-if="hasHero" class="md:w-1/2">
				<slot name="hero"></slot>
			</div>
		</div>
		<div class="container mx-auto flex flex-wrap justify-center sm:justify-between items-center mb-4 space-x-6">
			<SortControls :sort-by="sortBy" :sort-options="sortOptions" :sort-order="sortOrder"
				@sort-change="handleSortChange" />
			<LanguageFilter :selected-language="selectedLanguage" :all-languages="allLanguages"
				@update:selectedLanguage="selectedLanguage = $event" />
			<ViewToggle :view="view" @view-change="setView" />
		</div>
		<TopicFilter :topics="allTopics" :selected-topics="selectedTopics"
			@update:selectedTopics="selectedTopics = $event" />
		<main :class="viewClassCommon + ' ' + viewClass">
			<RepoCard v-for="repo in sortedRepos" :key="repo.id" :repo="repo" :view="view" :readme-manifest="readmeManifest"
				@readme-click="openReadmeModal" />
		</main>
		<Footer />
		<ReadmeModal v-if="view === 'grid'" :is-open="isReadmeModalOpen" @close="closeReadmeModal"
			:repo-name="selectedRepo?.name || ''" :readme-content="readmeContent" />
	</div>
</template>
<script setup lang="ts">
import './index.css';
import { ref, onMounted, watch, computed, provide } from 'vue'
import Header from './Header.vue'
// Hero injected via slot
import repos from './repos.json'
import readmeManifest from './readme-manifest.json'
import Footer from './Footer.vue'
import ReadmeModal from './components/repo/ReadmeModal.vue'
import { Config, GHProfile, Repo, SortOption } from './types'
import SortControls from './SortControls.vue'
import ViewToggle from './ViewToggle.vue'
import { RepoCard } from './components/repo'
import TopicFilter from './components/TopicFilter.vue'
import LanguageFilter from './components/LanguageFilter.vue'

interface Props {
	config: Config
	profile: GHProfile
	ghUsername: string
	projectPages: string[]
	hasHero: boolean
}

const props = defineProps<Props>()

const sortOptions = [
	{ key: 'pushed_at', label: 'Pushed' },
	{ key: 'updated_at', label: 'Updated' },
	{ key: 'created_at', label: 'Created' },
] as SortOption[]

const safeLocalStorage = {
	getItem: (key: string) => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(key)
		}
		return null
	},
	setItem: (key: string, value: string) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(key, value)
		}
	},
	removeItem: (key: string) => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem(key)
		}
	}
}

const sortBy = ref<string>('latest_update')
const sortOrder = ref<'' | 'asc' | 'desc'>('')
const view = ref<'grid' | 'list'>('grid')

onMounted(() => {
	const storedSortBy = safeLocalStorage.getItem('sortBy')
	if (storedSortBy) sortBy.value = storedSortBy

	const storedSortOrder = safeLocalStorage.getItem('sortOrder') as '' | 'asc' | 'desc'
	if (storedSortOrder) sortOrder.value = storedSortOrder

	const storedView = safeLocalStorage.getItem('view') as 'grid' | 'list'
	if (storedView) view.value = storedView
})

const setView = (newView: 'grid' | 'list') => {
	view.value = newView
}

const isReadmeModalOpen = ref<boolean>(false)
const selectedRepo = ref<Repo | null>(null)
const readmeContent = ref<string | null>(null)
const selectedTopics = ref<string[]>([])
const selectedLanguage = ref<string>('')

const siteTitle = computed(() => {
	if (!props.config) return '';

	let title = '';

	// if the key hasn't been set, use old value
	if (props.config.siteTitle === undefined) title = "{username}'s Sites";
	else title = props.config.siteTitle;

	// replace {username} with actual username
	return title.replace(/\{username\}/g, props.ghUsername);
});

watch([sortBy, sortOrder, view], () => {
	if (sortBy.value) {
		safeLocalStorage.setItem('sortBy', sortBy.value)
	} else {
		safeLocalStorage.removeItem('sortBy')
	}
	safeLocalStorage.setItem('sortOrder', sortOrder.value)
	safeLocalStorage.setItem('view', view.value)
})

const handleSortChange = (key: string) => {
	if (key === '') {
		sortBy.value = 'latest_update'
		sortOrder.value = ''
		return
	}
	if (sortBy.value === key) {
		sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
	} else {
		sortBy.value = key
		sortOrder.value = sortOrder.value === '' ? 'desc' : sortOrder.value
	}
}

const openReadmeModal = async (repo: Repo) => {
	selectedRepo.value = repo
	const manifestItem = readmeManifest.find((item) => item.repo === repo.name)

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

	isReadmeModalOpen.value = true
}

const closeReadmeModal = () => {
	isReadmeModalOpen.value = false
	selectedRepo.value = null
	readmeContent.value = null
}

const sortedRepos = computed(() => {
	let repoList = [...(repos as Repo[])];

	if (selectedTopics.value.length > 0) {
		repoList = repoList.filter((repo) =>
			selectedTopics.value.every((topic) => repo.topics?.includes(topic))
		);
	}

	if (selectedLanguage.value) {
		repoList = repoList.filter((repo) => repo.language === selectedLanguage.value);
	}

	repoList.sort((a, b) => {
		const key = sortBy.value as keyof Repo;
		let aVal: any = key === 'latest_update' ? a.latest_update?.value : a[key];
		let bVal: any = key === 'latest_update' ? b.latest_update?.value : b[key];
		const timeA = new Date(aVal || '').getTime();
		const timeB = new Date(bVal || '').getTime();
		return sortOrder.value === 'asc' ? timeA - timeB : timeB - timeA;
	});
	return repoList;
});

const allTopics = computed(() => {
	if (!repos.length) return [];
	const topics = new Set<string>();
	repos.forEach((repo) => {
		repo.topics?.forEach((topic) => topics.add(topic));
	});
	return Array.from(topics).sort();
});

const allLanguages = computed(() => {
	if (!repos.length) return [];
	const languages = new Set<string>();
	repos.forEach((repo) => {
		if (repo.language) {
			languages.add(repo.language);
		}
	});
	return Array.from(languages).sort();
});

const viewClassCommon = 'container mx-auto gap-4 grid grid-cols-1'
const viewClass = computed(() => view.value === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')

// Provide props to all child components
provide('config', props.config)
provide('projectPages', props.projectPages)
provide('profile', props.profile)
provide('ghUsername', props.ghUsername)
provide('siteTitle', siteTitle)
</script>
<style>
button.readme.narrow span {
	display: none;
}
</style>
