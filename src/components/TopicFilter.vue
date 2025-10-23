<template>
	<div class="container mx-auto mb-4 topic-filter-container basis-auto text-gray-700 dark:text-gray-300 flex-1 rounded shadow" ref="containerRef">
		<button @click="selectTopic(null)"
			class="topic-button x bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-red-700 dark:text-red-300" :class="selectedTopics.length ? 'visible' : 'invisible'" aria-label="Clear filtered topics">
			<X />
		</button>
		<button v-for="topic in topics" :key="topic" @click="selectTopic(topic)"
			:class="['topic-button bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600', selectedTopics.includes(topic) ? 'selected' : '']" :aria-label="`Filter by ${topic}`">
			<span class="text-xs text-gray-400 dark:text-gray-500">#</span>{{ topic }}
		</button>
	</div>
</template>
<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
	topics: string[];
	selectedTopics: string[];
}>();

const emit = defineEmits<{
	(e: 'update:selectedTopics', value: string[]): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scrollStep = 200; // pixels to scroll per click

const scrollLeft = () => {
	if (containerRef.value) {
		containerRef.value.scrollBy({ left: -scrollStep, behavior: 'smooth' });
	}
};

const scrollRight = () => {
	if (containerRef.value) {
		containerRef.value.scrollBy({ left: scrollStep, behavior: 'smooth' });
	}
};

const selectTopic = (topic: string | null) => {
	if (!topic) return emit('update:selectedTopics', []);
	const newSelectedTopics = [...props.selectedTopics];
	const index = newSelectedTopics.indexOf(topic);
	if (index > -1) {
		newSelectedTopics.splice(index, 1);
	} else {
		newSelectedTopics.push(topic);
	}
	emit('update:selectedTopics', newSelectedTopics);
};

// Add keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
	if (containerRef.value) {
		if (event.key === 'ArrowLeft') {
			scrollLeft();
		} else if (event.key === 'ArrowRight') {
			scrollRight();
		}
	}
};

onMounted(() => {
	if (containerRef.value) {
		containerRef.value.addEventListener('keydown', handleKeyDown);
	}
});

onUnmounted(() => {
	if (containerRef.value) {
		containerRef.value.removeEventListener('keydown', handleKeyDown);
	}
});
</script>
<style scoped>
.topic-filter-container {
	display: flex;
	overflow-x: auto;
	scroll-behavior: smooth;
	scrollbar-width: none;
	gap: 4px;
	padding: 4px 8px;
	position: relative;
}

.topic-filter-container::-webkit-scrollbar {
	display: none;
}

.topic-button {
	padding: 4px 12px;
	border-radius: 20px;
	cursor: pointer;
	white-space: nowrap;
}
.topic-button.x {
	padding: 4px;
}

.topic-button.selected {
	background: #007bff;
	color: white;
	border-color: #007bff;
}
</style>
