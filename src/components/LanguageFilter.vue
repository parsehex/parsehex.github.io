<template>
	<div class="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
		<label> Filter by main language: <select :value="selectedLanguage" @change="onLanguageChange($event)"
				class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-2">
				<option value="">All</option>
				<option v-for="lang in allLanguages" :key="lang" :value="lang"> {{ lang }} </option>
			</select>
		</label>
	</div>
</template>
<script setup lang="ts">
interface Props {
	selectedLanguage: string
	allLanguages: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'update:selectedLanguage': [value: string]
}>()

const onLanguageChange = (event: Event) => {
	const value = (event.target as HTMLSelectElement).value;
	emit('update:selectedLanguage', value);
}
</script>
