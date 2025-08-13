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

### SFC Mode

````markdown
::: playground

```vue
<template>
  <div>test</div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
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
  <div>test @file</div>
  <button @click="clickAdd">Click me {{ count }}</button>
  <ButtonVue :count="count"></ButtonVue>
</template>
<script setup>
import ButtonVue from "./Button.vue";
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

## Code Editor Config

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

## SFC Single Vue Config & Imports

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

```json
{
  "imports": {
    "ant-design-vue": "xxx"
  },
  "setting": {
    "showCompileOutput": true
  }
}
```

:::
````
## Contributors

Thank you to everyone who contributed to this project.

<a href="https://github.com/yeminxuan/vitepress-plugin-repl/graphs/contributors">
<img src="https://contrib.rocks/image?repo=yeminxuan/vitepress-plugin-repl" />
</a>

## 📄 License

[MIT](./LICENSE) License Copyright (c) 2025 [yeminxuan](https://github.com/yeminxuan)