<template>
	<div class="flex items-center">
		<button @click="$emit('view-change', 'grid')" class="py-1 px-2 rounded-l transition" :class="[
			view === 'grid'
				? 'bg-blue-500 text-white'
				: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
		]">
			<span>
				<Grid :class="iconSize" />
			</span>
		</button>
		<button @click="$emit('view-change', 'list')" class="py-1 px-2 rounded-r transition" :class="[
			view === 'list'
				? 'bg-blue-500 text-white'
				: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
		]">
			<List :class="iconSize" />
		</button>
	</div>
</template>
<script setup lang="ts">
import { Grid, Layout, List } from 'lucide-vue-next'

interface Props {
	view: 'grid' | 'list'
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'view-change': [view: 'grid' | 'list']
}>()

const iconSize = 'w-5 h-5'
</script>
