<template>
	<span v-if="language" class="inline-flex items-center px-2 py-1 ml-4 text-xs font-semibold select-none rounded"
		:style="{ backgroundColor: color, color: contrast }"> {{ language }} </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getColor, getContrastYIQ } from '../../utils'

interface Props {
	language: string
}

const props = defineProps<Props>()

const color = computed(() => getColor(props.language))
const contrast = computed(() => getContrastYIQ(color.value))
</script>
