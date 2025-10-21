<template>
	<div v-if="topic" class="inline-flex items-center">
		<a class="px-3 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-medium rounded-full select-none" :href="`https://github.com/topics/${topic}`" target="_blank" rel="noopener noreferrer" role="status" v-tippy="{ content:`${topic} topic on GitHub`, placement: 'bottom' }" :aria-label="`This repo is marked with the topic '${props.topic}'. Click to view the topic on GitHub.`"> {{ topic }} </a>
	</div>
</template>
<script setup lang="ts">
interface Props {
	topic: string
}

const props = defineProps<Props>()
</script>
