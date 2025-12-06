<template>
	<header class="text-center py-4 space-y-2">
		<div class="flex items-center justify-center">
			<img src="/avatar-150.webp" alt="GitHub Avatar"
				class="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center"
				:aria-label="'Profile avatar image for ' + ghUsername" />
			<div class="flex flex-col text-left pl-4">
				<h1 class="text-4xl font-bold"> {{ titleParts[0] }}<a v-if="titleParts[1] !== undefined" :href="linkHref"
						:target="linkTarget" rel="noopener noreferrer" class="hover:text-blue-500 dark:hover:text-blue-400">{{
							ghUsername }}</a>{{ titleParts[1] }} </h1>
				<p v-if="subTitle" class="text-lg mt-2 text-gray-600 dark:text-gray-400"> {{ subTitle }} </p>
			</div>
		</div>
		<div v-if="links && links.length > 0" class="flex justify-center space-x-4 py-2">
			<a v-for="link in links" :key="link.url" :href="link.url" :target="link.url.startsWith('/') ? '_self' : '_blank'"
				rel="me noopener noreferrer"
				class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center space-x-1"
				:aria-label="`Link to ${ghUsername}${link.name ? ' on ' + link.name : ''}`">
				<Tippy :content="link.icon ? link.name : ''" placement="bottom">
					<img v-if="link.icon && link.icon.startsWith('/')" :src="link.icon" class="w-5 h-5" :alt="link.name" />
					<Icon v-else-if="link.icon" :name="link.icon" />
					<span v-else>{{ link.name }}</span>
				</Tippy>
			</a>
			<a href="/gists" class="text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 flex items-center ml-2"
				aria-label="Link to Gists">
				<Tippy class="flex items-center space-x-1 border border-gray-200 dark:border-gray-600 rounded-lg p-2"
					:content="`${ghUsername}'s Gists`" placement="bottom">
					<Icon name="brand-github-filled" />
					<span>Gists</span>
				</Tippy>
			</a>
		</div>
		<Tippy v-if="lastUpdatedDisplay" class="text-gray-700 dark:text-gray-300 text-sm select-none"
			:content="lastUpdatedTooltip" placement="bottom" :delay="250"> Last updated {{ lastUpdatedDisplay }} </Tippy>
	</header>
</template>
<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { Tippy } from 'vue-tippy';
import Icon from './components/Icon.vue';
import { formatDate, showRelativeTime } from './utils';
import { Config, GHProfile } from './types';

interface Props {
	config?: Config
	profile?: GHProfile
	ghUsername?: string
	siteTitle?: string | Ref<string>
	isHomePage?: boolean
	class?: string
}

const props = defineProps<Props>()

const config = props.config || inject('config') as Config
const profile = props.profile || inject('profile') as GHProfile
const ghUsername = props.ghUsername || inject('ghUsername') as string
const siteTitleInj = props.siteTitle || inject('siteTitle') as Ref<string> | string | undefined
const siteTitle = computed(() => {
	if (props.siteTitle) return typeof props.siteTitle === 'string' ? props.siteTitle : props.siteTitle.value
	if (typeof siteTitleInj === 'string') return siteTitleInj
	if (siteTitleInj) return siteTitleInj.value
	return ''
})

const linkHref = computed(() => {
	if (props.isHomePage) return `https://github.com/${ghUsername}`
	return '/'
})
const linkTarget = computed(() => {
	if (props.isHomePage) return '_blank'
	return '_self'
})

const { headerText, links } = config

const subTitle = computed(() => {
	if (!headerText && profile.bio) return profile.bio
	if (headerText) return headerText
	return 'A list of my projects that have a GitHub Pages site.'
})

const titleParts = computed(() => {
	if (!config) return '';
	const username = ghUsername;
	const titleTemplate = siteTitle.value;
	if (titleTemplate.includes(username)) {
		return titleTemplate.split(username);
	}
	return [titleTemplate];
})

const lastUpdatedTooltip = computed(() => {
	if (!config.lastUpdated) return '';
	return formatDate(config.lastUpdated, true);
});
const lastUpdatedDisplay = computed(() => {
	if (!config.lastUpdated) return '';
	return showRelativeTime(config.lastUpdated);
});
</script>
