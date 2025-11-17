<template>
	<div v-if="topic" class="inline-flex items-center">
		<Tippy :content="`${topic} topic on GitHub`" placement="bottom">
			<a class="px-3 py-1 flex items-center gap-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-medium rounded-full select-none"
				:href="`https://github.com/topics/${topic}`" target="_blank" rel="noopener noreferrer" role="status"
				:aria-label="`This repo is marked with the topic '${props.topic}'. Click to view the topic on GitHub.`"> {{
					topic }}
				<ExternalLink :size="12" />
			</a>
		</Tippy>
	</div>
</template>
<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next';
import { Tippy } from 'vue-tippy';

interface Props {
	topic: string
}

const props = defineProps<Props>()
</script>
