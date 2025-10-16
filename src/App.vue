<template>
	<div class="mx-auto p-4">
		<div class="flex flex-col md:flex-row md:items-start md:justify-center gap-4 mb-4 relative">
			<Header v-if="config?.header" class="md:w-1/4 md:mt-4" />
			<Hero v-if="heroMd" :source="heroMd" class="md:w-1/2" />
		</div>
		<div class="container mx-auto flex justify-between mb-4">
			<SortControls :sort-by="sortBy" :sort-options="sortOptions" :sort-order="sortOrder"
				@sort-change="handleSortChange" />
			<ViewToggle :view="view" @view-change="setView" />
		</div>
		<main :class="viewClassCommon + ' ' + viewClass">
			<RepoCard v-for="repo in sortedRepos" :key="repo.id" :repo="repo" :view="view" :readme-manifest="readmeManifest"
				@readme-click="openReadmeModal" />
		</main>
		<Footer />
		<ReadmeModal :is-open="isReadmeModalOpen" @close="closeReadmeModal" :repo-name="selectedRepo?.name || ''"
			:readme-content="readmeContent" />
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed, toRefs } from 'vue'
import Hero from './Hero.vue'
import repos from './repos.json'
import Header from './Header.vue'
import Footer from './Footer.vue'
import ReadmeModal from './components/repo/ReadmeModal.vue'
import { ReadmeManifestItem, Repo, SortOption } from './types'
import SortControls from './SortControls.vue'
import ViewToggle from './ViewToggle.vue'
import { RepoCard } from './components/repo'
import { useConfigStore } from './stores/config'

const sortOptions = [
	{ key: 'pushed_at', label: 'Pushed' },
	{ key: 'updated_at', label: 'Updated' },
	{ key: 'created_at', label: 'Created' },
] as SortOption[]

const sortBy = ref<string>(localStorage.getItem('sortBy') || 'latest_update')
const sortOrder = ref<'' | 'asc' | 'desc'>((localStorage.getItem('sortOrder') as '' | 'asc' | 'desc') || '')

const view = ref<'grid' | 'list'>((localStorage.getItem('view') as 'grid' | 'list') || 'grid')

const setView = (newView: 'grid' | 'list') => {
	view.value = newView
}

const heroMd = ref<string>('')
const readmeManifest = ref<ReadmeManifestItem[]>([])
const isReadmeModalOpen = ref<boolean>(false)
const selectedRepo = ref<Repo | null>(null)
const readmeContent = ref<string | null>(null)

const configStore = useConfigStore()
const { config, siteTitle } = toRefs(configStore)

onMounted(async () => {
	await configStore.loadConfig()

	if (!config.value) return;

	if (config.value.hero.src) {
		fetch(config.value.hero.src)
			.then((res) => res.text())
			.then((text) => {
				heroMd.value = text
			})
			.catch((err) => console.error('Failed to load hero markdown:', err))
	}

	// Load README manifest
	fetch('/readme-manifest.json')
		.then((res) => res.json())
		.then((data) => readmeManifest.value = data)
		.catch((err) => console.error('Failed to load README manifest:', err))

	document.title = siteTitle.value
})

watch([sortBy, sortOrder, view], () => {
	if (sortBy.value) {
		localStorage.setItem('sortBy', sortBy.value)
	} else {
		localStorage.removeItem('sortBy')
	}
	localStorage.setItem('sortOrder', sortOrder.value)
	localStorage.setItem('view', view.value)
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
	const manifestItem = readmeManifest.value.find((item) => item.repo === repo.name)

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
	const repoList = [...(repos as Repo[])]
	repoList.sort((a, b) => {
		const key = sortBy.value as keyof Repo
		let aVal: any = key === 'latest_update' ? a.latest_update?.value : a[key]
		let bVal: any = key === 'latest_update' ? b.latest_update?.value : b[key]
		const timeA = new Date(aVal || '').getTime()
		const timeB = new Date(bVal || '').getTime()
		return sortOrder.value === 'asc' ? timeA - timeB : timeB - timeA
	})
	return repoList
})

const viewClassCommon = 'container mx-auto gap-4 grid grid-cols-1'
const viewClass = computed(() => view.value === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2')

const THRESHOLD = 36
const TIMEOUT = 25

const resizeReadmeBtns = () => {
	const btns = Array.from(document.querySelectorAll('button.readme')) as HTMLButtonElement[]
	for (const btn of btns) {
		const footer = btn.parentElement;
		if (!footer) continue;
		const rect = footer.getBoundingClientRect();
		const isNarrow = rect.height > THRESHOLD;
		if (isNarrow) btn.classList.add('narrow');
		else btn.classList.remove('narrow');
	}
}

onMounted(() => setTimeout(resizeReadmeBtns, TIMEOUT))
watch(() => view.value, () => setTimeout(resizeReadmeBtns, TIMEOUT))
</script>
<style>
button.readme.narrow span {
	display: none;
}
</style>
