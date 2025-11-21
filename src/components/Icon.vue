<script setup>
import { computed } from 'vue';
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandMedium,
  IconBrandDribbble,
  IconBrandBehance,
  IconBrandPatreon,
  IconBrandDiscord,
  IconBrandReddit,
  IconBrandStackoverflow,
  IconBrandTwitch,
  IconBrandTiktok,
  IconMail,
  IconMug,
  IconLink,
  IconWorld,
  IconBrandMastodon,
  IconBrandBluesky,
  IconBrandThreads,
  IconBrandX
} from '@tabler/icons-vue';

// This is messy but it saves some KBs

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const iconMap = {
  'brand-github': IconBrandGithub,
  'brand-twitter': IconBrandTwitter,
  'brand-linkedin': IconBrandLinkedin,
  'brand-facebook': IconBrandFacebook,
  'brand-instagram': IconBrandInstagram,
  'brand-youtube': IconBrandYoutube,
  'brand-medium': IconBrandMedium,
  'brand-dribbble': IconBrandDribbble,
  'brand-behance': IconBrandBehance,
  'brand-patreon': IconBrandPatreon,
  'brand-discord': IconBrandDiscord,
  'brand-reddit': IconBrandReddit,
  'brand-stackoverflow': IconBrandStackoverflow,
  'brand-twitch': IconBrandTwitch,
  'brand-tiktok': IconBrandTiktok,
  'mail': IconMail,
  'mug': IconMug,
  'link': IconLink,
  'world': IconWorld,
  'brand-mastodon': IconBrandMastodon,
  'brand-bluesky': IconBrandBluesky,
  'brand-threads': IconBrandThreads,
  'brand-x': IconBrandX
};

const iconComponent = computed(() => {
  if (!props.name) return null;
  // Normalize name to match keys in iconMap (e.g., "BrandGithub" -> "brand-github" or just use the name if it matches)
  // The config likely uses names like "brand-github".
  // Let's try to match exact keys first, then try to normalize if needed.

  // If the user passes "brand-github", it matches.
  if (iconMap[props.name]) return iconMap[props.name];

  // If the user passes "BrandGithub", convert to "brand-github" (kebab-case) might be needed,
  // but let's assume the config uses kebab-case as per Tabler conventions for now.

  return null;
});
</script>
<template>
  <component :is="iconComponent" v-if="iconComponent" class="w-8 h-8" />
</template>
