# vitepress-plugin-repl

[简体中文](README.zh.md) | English

<p align="center">
    <a href="https://www.npmjs.com/package/vitepress-plugin-repl" target="_black">
      <img src="https://img.shields.io/npm/v/vitepress-plugin-repl.svg?color=33A6B8&label="/>
    </a>
    <a href="https://npmcharts.com/compare/vitepress-plugin-repl?minimal=true">
      <img src="https://img.shields.io/npm/dm/vitepress-plugin-repl.svg?color=476582&label=" />
    </a>
    <a href="https://github.com/yeminxuan/vitepress-plugin-repl" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/yeminxuan/vitepress-plugin-repl?style=social">
    </a><br>

</p>

Turns fenced code block in your VitePress docs into a live, editable playground—no build step, just add `::: playground`

## 🚀 Features

- [x] SFC Single-file playground via bare **```vue** blocks—drop code, run instantly.
- [x] use `@file fileName` to add file
- [x] use `@import` then a json block to customize "import map"
- [x] use `@setting` then a json block to customize settings

## 📦 Install

```bash
npm i vitepress-plugin-repl -D

# yarn
yarn add vitepress-plugin-repl -D

# pnpm
pnpm add vitepress-plugin-repl -D
```

## 🦄 Usage

```js
// config.ts
import { VueReplMdPlugin } from "vitepress-plugin-repl";

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(VueReplMdPlugin);
    },
  },
});
```

```js
// theme/index.ts
import Playground from "vitepress-plugin-repl/components/index.vue";
import DefaultTheme from "vitepress/theme";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component("VuePlayground", Playground);
  },
};
```
### Edit Select

- CodeMirror `default`
- Monaco
- Sanbox

because this library playground extend field default is `CodeMirror`, here is an example of Monaco Editor

````markdown
::: playground Monaco

```vue
<template>
  <div>test</div>
  <button @click="count += 1">{{ count }}</button>
</template>
<script setup lang="ts">
const count = ref(1);
</script>
<style scoped>
div {
  color: red;
}
</style>
```

:::
````
### Single Vue File Mode


````markdown
::: playground

```vue
<template>
  <button @click="count += 1">Click me {{ count }}</button>
</template>
<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>
<style scoped>
button {
  color: green;
}
</style>
```

:::
````

### Multiple File Mode

use `@file` prefix to define fileName, for example:

````markdown
::: playground

@file Comp.vue

```vue
<template>
  <button @click="count += 1">Click me {{ count }}</button>
  <ButtonVue :count="count"></ButtonVue>
</template>
<script setup>
import ButtonVue from "./Button.vue";
import { ref } from "vue";
const count = ref(0);
</script>

<style scoped>
button {
  color: red;
}
</style>
```

@file Button.vue

```vue
<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div>
    <button>display count {{ props.count }}</button>
  </div>
</template>
```

:::
````

### Import Map And playground Components Config

#### Single File Mode

Just place the desired configuration directly in the json block

````markdown
::: playground Monaco

```vue
<template>
  <p>{{ width }} x {{ height }}</p>
</template>
<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
</script>
<style scoped>
div {
  color: red;
}
</style>
```

```json
{
  "imports": {
    "vue": "https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.18/dist/runtime-dom.esm-browser.js",
    "vue/server-renderer": "https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.5.18/dist/server-renderer.esm-browser.js",
    "@vueuse/core": "https://unpkg.com/@vueuse/core/index.mjs"
  },
  "autoResize": true,
  "showCompileOutput": false,
  "showSsrOutput": false,
  "editorOptions": {
    "autoSaveText": true,
    "showErrorText": true,
    "monacoOptions": {
      "cursorBlinking": "solid"
    }
  }
}
```

:::
````

#### Multiple File Mode

````markdown
::: playground

@file Comp.vue

```vue
<template>
  <div>test @file</div>
  <button @click="clickAdd">Click me {{ count }}</button>
  <WindowSize></WindowSize>
</template>
<script setup>
import WindowSize from "./WindowSize.vue";
import { ref } from "vue";
const count = ref(0);
const clickAdd = () => {
  count.value++;
};
</script>

<style scoped>
button {
  color: red;
}
</style>
```

@file WindowSize.vue

```vue
<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
</script>

<template>
  <p>{{ width }} x {{ height }}</p>
</template>
```

@setting

```json
{
  "autoResize": true,
  "showCompileOutput": false,
  "showSsrOutput": false,
  "editorOptions": {
    "autoSaveText": true,
    "showErrorText": true,
    "monacoOptions": {
      "cursorBlinking": "solid"
    }
  }
}
```

@import

```json
{
  "imports": {
    "vue": "https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.18/dist/runtime-dom.esm-browser.js",
    "vue/server-renderer": "https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.5.18/dist/server-renderer.esm-browser.js",
    "@vueuse/core": "https://unpkg.com/@vueuse/core/index.mjs"
  }
}
```

:::
````

## Config API

| Field | description | type | default |
|---|---|---|---|
| theme | ||
## Contributors

Thank you to everyone who contributed to this project.

<a href="https://github.com/yeminxuan/vitepress-plugin-repl/graphs/contributors">
<img src="https://contrib.rocks/image?repo=yeminxuan/vitepress-plugin-repl" />
</a>

## 📄 License

[MIT](./LICENSE) License Copyright (c) 2025 [yeminxuan](https://github.com/yeminxuan)