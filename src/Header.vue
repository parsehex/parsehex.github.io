<template>
	<header class="text-center py-4 flex items-center justify-center">
		<img src="/avatar.png" alt="GitHub Avatar"
			class="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center" />
		<div class="flex flex-col text-left pl-4">
			<h1 class="text-4xl font-bold">
				<a :href="`https://github.com/${githubUsername}`" target="_blank" rel="noopener noreferrer"
					class="hover:text-blue-500 dark:hover:text-blue-400"> {{ githubUsername }} </a> 's Sites
			</h1>
			<p class="text-lg mt-2 text-gray-600 dark:text-gray-400"> A list of my projects that have a GitHub Pages site.
			</p>
		</div>
	</header>
</template>
<script setup lang="ts">
import 'tippy.js/dist/tippy.css'

const githubUsername = import.meta.env.VITE_GITHUB_ACTOR || 'your_username'
</script>
