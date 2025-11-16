# vuepak

[[Docs](https://parsehex.github.io/vuepak/)]

This is a component library for Vue intended for [my](https://parsehex.github.io/) own use. There are some components that I use in several projects, so I figured I might as well start a collection of them which I can import and stop rewriting.

## Install

```bash
npm install @parsehex/vuepak
```

Import the CSS:

```js
import '@parsehex/vuepak/vuepak.css';
```

## Components

### JSON Viewer

```vue
<script setup>
import { JsonViewer } from '@parsehex/vuepak';

const someData = {
	name: 'John Smith',
	age: 30,
	isStudent: false,
	courses: ['History', 'Math', 'Science'],
};
</script>
<template>
	<JsonViewer :data="someData" />
</template>
```

### Spinner

```vue
<script setup>
import { Spinner } from '@parsehex/vuepak';

const loading = ref(false);

// update loading state
</script>
<template>
	<Spinner v-if="loading" />
</template>
```

## License

This project is licensed under the [MIT License](./LICENSE). Please see the LICENSE file for details.
