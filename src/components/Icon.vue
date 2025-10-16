<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const formattedName = computed(() => {
  const name = props.name.replace(/-/g, '_');
  // Capitalize the first letter of each word to match PascalCase component names
  return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
});

const iconComponent = computed(() => {
  if (!formattedName.value) return null;
  // Use defineAsyncComponent for lazy loading the icon
  return defineAsyncComponent(() =>
    import(`@tabler/icons-vue`).then(module => {
      return module[`Icon${formattedName.value}`];
    })
  );
});
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" class="w-8 h-8" />
</template>