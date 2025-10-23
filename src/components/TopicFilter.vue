<template>
	<div class="topic-filter-container mx-4 flex-1 max-w-1/3" ref="containerRef">
		<button v-for="topic in topics" :key="topic" @click="selectTopic(topic)"
			:class="['topic-button', selectedTopics.includes(topic) ? 'selected' : '']"> {{ topic }} </button>
	</div>
</template>
<script setup lang="ts">
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

const selectTopic = (topic: string) => {
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
	padding: 4px 0;
	position: relative;
}

.topic-filter-container::-webkit-scrollbar {
	display: none;
}

.topic-button {
	padding: 4px 12px;
	border: 1px solid #ccc;
	border-radius: 20px;
	background: white;
	cursor: pointer;
	white-space: nowrap;
	transition: all 0.2s ease;
}

.topic-button:hover {
	background: #f0f0f0;
}

.topic-button.selected {
	background: #007bff;
	color: white;
	border-color: #007bff;
}
</style>
