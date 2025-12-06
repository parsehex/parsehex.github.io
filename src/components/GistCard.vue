<template>
	<div
		class="bg-white dark:bg-gray-800/60 shadow-md rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 dark:border-gray-700/50 mb-4">
		<div class="flex flex-wrap items-center mb-3 gap-3">
			<h2 class="flex-1 grow text-xl font-semibold font-heading break-words">
				<a :href="gist.html_url" target="_blank" rel="noopener noreferrer"
					class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"> {{ gist.description ||
						Object.keys(gist.files)[0] }} </a>
			</h2>
			<div class="flex items-center gap-2 flex-shrink-0">
				<Tippy content="View on GitHub">
					<a :href="gist.html_url" target="_blank" rel="noopener noreferrer"
						class="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
						:aria-label="`View gist on GitHub`">
						<Github class="w-5 h-5" />
					</a>
				</Tippy>
			</div>
		</div>
		<div class="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-2">
			<div class="flex items-center gap-4 flex-wrap">
				<div class="flex items-center gap-2">
					<Calendar class="w-4 h-4" />
					<Tippy :content="formatDate(gist.created_at, true)"> Created: {{ showRelativeTime(gist.created_at) }} </Tippy>
				</div>
				<div class="flex items-center gap-2">
					<Clock class="w-4 h-4" />
					<Tippy :content="formatDate(gist.updated_at, true)"> Updated: {{ showRelativeTime(gist.updated_at) }} </Tippy>
				</div>
			</div>
		</div>
		<div class="space-y-4">
			<!-- Code -->
			<slot />
		</div>
	</div>
</template>
<script setup lang="ts">
import { Calendar, Clock, Github } from 'lucide-vue-next'
import { Tippy } from 'vue-tippy'
import type { Gist } from '../types'
import { showRelativeTime, formatDate } from '../utils'

interface Props {
	gist: Gist
}

defineProps<Props>()
</script>
