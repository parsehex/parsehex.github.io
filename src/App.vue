<template>
	<div class="mx-auto p-4">
		<div class="flex flex-col md:flex-row md:items-start md:justify-center gap-4 mb-4 relative">
			<Header v-if="config?.header" class="md:w-1/4 md:mt-4" />
			<Hero v-if="heroMd" :source="heroMd" class="md:w-1/2" />
		</div>
		<div class="container mx-auto flex flex-wrap justify-center sm:justify-between items-center mb-4 space-x-6">
			<!-- <div class="flex items-center space-x-4"> -->
			<SortControls :sort-by="sortBy" :sort-options="sortOptions" :sort-order="sortOrder"
				@sort-change="handleSortChange" />
			<!-- </div> -->
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
import { ref, onMounted, watch, computed, toRefs } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import Hero from './Hero.vue'
import heroMd from './hero.md?raw'
import repos from './repos.json'
import readmeManifest from './readme-manifest.json'
import Header from './Header.vue'
import Footer from './Footer.vue'
import ReadmeModal from './components/repo/ReadmeModal.vue'
import { ReadmeManifestItem, Repo, SortOption } from './types'
import SortControls from './SortControls.vue'
import ViewToggle from './ViewToggle.vue'
import { RepoCard } from './components/repo'
import { useConfigStore, Config } from './stores/config'
import TopicFilter from './components/TopicFilter.vue'
import LanguageFilter from './components/LanguageFilter.vue'

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

let configStore: ReturnType<typeof useConfigStore> | null = null
const config = ref<Config | null>(null)
const siteTitle = ref('')

onMounted(() => {
	configStore = useConfigStore()
	const storeRefs = toRefs(configStore)
	config.value = storeRefs.config.value
	siteTitle.value = storeRefs.siteTitle.value

	useHead({
		title: siteTitle.value,
	})
	const description = `List of ${configStore.ghUsername}'s GitHub projects`
	useSeoMeta({
		title: siteTitle.value,
		description,
		ogDescription: description,
		ogTitle: siteTitle.value,
	})
})

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
</script>
<style>
button.readme.narrow span {
	display: none;
}
</style>
