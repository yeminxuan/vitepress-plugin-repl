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

| Property | Description | Type | Default |
|---|---|---|---|
| theme | Set the overall theme | "dark" \| "light" | "light" |
| previewTheme | Whether the preview pane follows the value of `theme` | Boolean | false |
| autoResize | Whether the playground automatically resizes with the viewport | Boolean | true |
| showCompileOutput | Whether to display the compiled code | Boolean | true |
| showOpenSourceMap | Whether to show the “OPEN SourceMap” toggle | Boolean                         | false |
| showImportMap | Whether to show the “Import Map” toggle | Boolean | true |
| showSsrOutput     | Whether to display the SSR-compiled code | Boolean | false |
| showTsConfig | Whether to show the “tsconfig.json” toggle | Boolean | false |
| clearConsole | Whether to automatically clear the console after the project starts | Boolean | true |
| layout | Layout direction | "horizontal" \| "vertical" | "horizontal" |
| layoutReverse | Whether to reverse the layout | Boolean | false |
| ssr | Whether to enable SSR | Boolean | false |
| layoutReverse | Whether to reverse the layout | Boolean | false |
| layoutReverse | Whether to reverse the layout | Boolean | false |
| previewOptions | Preview pane options | [Object](#previewoptions-api) | () => ({})   |
| editorOptions | Editor options | [Object](#editoroptions-api) | () => ({})   |
| splitPaneOptions | Split-pane options | [Object](#splitpaneoptions-api) | () => ({}) |

### PreviewOptions API
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| showRuntimeError | Whether to display runtime error messages | Boolean | true |
| showRuntimeWarning | Whether to display runtime warning messages | Boolean | true |
| headHTML | Raw HTML appended to `<head>` inside the preview `<iframe>`—useful for extra `<meta>`, `<link>`, third-party scripts, or styles | String | "" |
| bodyHTML | Raw HTML inserted at the beginning of `<body>` inside the preview `<iframe>` | String | "" |
| placeholderHTML | Raw HTML shown as a placeholder when the project hasn’t started (e.g., compile errors or empty project) | String | "" |
| customCode | Extra code injected into the auto-generated entry file—usually for importing libraries or utilities | [Object](#customcode-api) | undefined |

#### CustomCode API
| Property | Description | Type   | Default |
| --- | --- | --- | --- |
| importCode | Code to insert at the top of the auto-generated entry file—commonly used to pre-import libraries or utilities | String | "" |
| useCode | Code to run after `createApp()` but before `app.mount()`—used for registering plugins, global properties, router guards, etc. | String | "" |

### EditorOptions API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| showErrorText | Whether to show inline error text (hover tooltip) when there are compile-time errors (SFC syntax errors, TS type errors, etc.). Set to `false` to suppress. | String \| false | false |
| autoSaveText  | Custom text displayed in the bottom-right auto-save toast (triggered on debounced input). | String | "" |
| monacoOptions | [Monaco Editor initialization options](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html#cursorBlinking) | any | undefined |

### SplitPaneOptions API
| Property | Description | Type   | Default |
| --- | --- | --- | --- |
| codeTogglerText | Text shown on the left (code pane) collapse/expand button | String | "" |
| outputTogglerText | Text shown on the right (output pane) collapse/expand button | String | "" |

## Contributors

Thank you to everyone who contributed to this project.

<a href="https://github.com/yeminxuan/vitepress-plugin-repl/graphs/contributors">
<img src="https://contrib.rocks/image?repo=yeminxuan/vitepress-plugin-repl" />
</a>

## 📄 License

[MIT](./LICENSE) License Copyright (c) 2025 [yeminxuan](https://github.com/yeminxuan)