<template>
	<div class="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
		<label> Sort by: <select v-model="localSortBy" @change="onSortChange($event)"
				class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-2">
				<option value=""> </option>
				<option v-for="option in sortOptions" :key="option.key" :value="option.key"> {{ option.label }} </option>
			</select>
		</label>
		<button @click="onSortChange(sortBy)"
			class="flex items-center p-1 rounded bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
			:aria-label="sortLabel">
			<ArrowUpDown v-if="!sortOrder" class="w-4 h-4" />
			<ArrowUp v-else-if="sortOrder === 'asc'" class="w-4 h-4" />
			<ArrowDown v-else class="w-4 h-4" />
		</button>
	</div>
</template>
<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next'
import { computed } from 'vue'
import type { SortOption } from './types'

interface Props {
	sortBy: string
	sortOrder: '' | 'asc' | 'desc'
	sortOptions: SortOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'sort-change': [key: string]
}>()

const onSortChange = (key: string | Event) => {
	if (key instanceof Event) {
		key = (key.target as HTMLSelectElement).value;
	}
	emit('sort-change', key);
}

const localSortBy = computed({
	get: () => props.sortBy || 'latest_update',
	set: (value) => onSortChange(value)
})

const sortLabel = computed(() => {
	const selectedOption = props.sortOptions.find(option => option.key === props.sortBy);
	const sortByKey = selectedOption ? selectedOption.label : props.sortBy;
	if (props.sortOrder === 'asc') {
		return `Sort by ${sortByKey} ascending`;
	} else if (props.sortOrder === 'desc') {
		return `Sort by ${sortByKey} descending`;
	} else {
		return `Sort by ${sortByKey}`;
	}
})
</script>
