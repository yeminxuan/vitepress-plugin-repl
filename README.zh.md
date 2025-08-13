# vitepress-plugin-repl

简体中文 | [English](README.md)

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

在您的 VitePress 文档中，只需添加 `::: playground`，即可将带围栏的代码块转换为实时可编辑的代码编辑器，无需构建步骤。

## 🚀 功能

- [x] SFC 通过单独的 **```vue** 代码块定义单文件模式
- [x] 使用 `@file 文件名` 紧跟文件的代码块
- [x] 使用 `@import` 紧跟一个自定义“导入映射”的 json 块
- [x] 使用 `@setting` 紧跟一个自定义设置的 json 块

## 📦 安装

```bash
npm i vitepress-plugin-repl -D

# yarn
yarn add vitepress-plugin-repl -D

# pnpm
pnpm add vitepress-plugin-repl -D
```

## 🦄 使用

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

### 编辑器选择

- CodeMirror `default`
- Monaco
- Sanbox

because this library playground extend field default is `CodeMirror`, here is an example of Monaco Editor

````markdown
::: playground Monaco

```vue
<template>
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

### 单 vue 文件模式

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

### 多文件模式

使用 `@file` 前缀后面紧跟文件名, 例如：

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

### 导入映射 && playground 组件配置

#### 单文件模式

将想要的配置直接放置在 json 中即可

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

#### 多文件模式
- use `@import` then a json block to customize "import map"
- use `@setting` then a json block to customize settings
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

## 配置 API

| 属性名 | 说明 | 类型 | 默认 |
|---|---|---|---|
| theme | 设置整体的主题 | "dark" \| "light" | "light" |
| previewTheme | 设置预览界面的主题是否跟随`theme`的配置 | Boolean | false |
| autoResize | 设置 `playground` 是否跟随屏幕自适应 | Boolean | true |
| showCompileOutput | 是否显示编译后的代码 | Boolean |true |
| showOpenSourceMap | 是否显示 `OPEN SourceMap` 开关 | Boolean | false |
| showImportMap | 是否显示`Import Map` 选项切换 | Boolean | true |
| showSsrOutput | 是否显示 `ssr` 的编译后代码 | Boolean | false |
| showTsConfig | 是否显示 `tsconfig.json` 选项切换 | Boolean | false |
| clearConsole | 是否在启动项目后自动清空 `console` 的输出 | Boolean | true |
| layout | 布局 | "horizontal" \| "vertical" | "horizontal" |
| layoutReverse | 是否反向布局 | Boolean | false |
| ssr | 是否开启 `ssr` | Boolean | false |
| layoutReverse | 是否反向布局 | Boolean | false |
| layoutReverse | 是否反向布局 | Boolean | false |
| previewOptions | 预览界面选项配置 | [Object](#previewoptions-api) | () => ({})|
| editorOptions | 编辑器选项配置 | [Object](#editoroptions-api) | () => ({})|
| splitPaneOptions | 分割选项配置 | [Object](#splitpaneoptions-api) | () => ({})|

### PreviewOptions API
| 属性名 | 说明 | 类型 | 默认 |
|---|---|---|---|
| showRuntimeError | 是否显示运行时的错误信息 | Boolean | true |
| showRuntimeWarning | 是否显示运行时的警告信息 | Boolean | true |
| headHTML | 直接拼接到 `<iframe>` 的 `<head>` 里。可用于追加 `<meta>`、`<link>`、第三方脚本，或者额外样式： | String | "" |
| bodyHTML | 直接拼接到 `<iframe>` 的 `<body>` 最前面。 | String | "" |
| placeholderHTML | 是否显当项目还没有运行成功（编译错误、空项目）时，用来替换整个预览区的占位内容。示运行时的警告信息 | String | "" |
| customCode | 在「自动生成的入口文件」顶部额外插入一段 import 语句。常用于把「组件库」或「工具函数」预先注入： | [Object](#customcode-api) | undefined |
#### CustomCode API
| 属性名 | 说明 | 类型 | 默认 |
|---|---|---|---|
| importCode | 在「自动生成的入口文件」顶部额外插入一段 import 语句。常用于把「组件库」或「工具函数」预先注入 | String | "" |
| useCode | 在「入口文件」创建完应用实例（createApp()）之后、挂载（app.mount()）之前插入的代码。注册插件、挂载全局属性、添加路由守卫等 | String | "" |
### EditorOptions API
| 属性名 | 说明 | 类型 | 默认 |
|---|---|---|---|
| showErrorText | 当代码有编译期错误（SFC 语法错、TS 类型错等）时，Monaco 会在对应行首显示一个红色图标并在 hover 时弹出提示。 | String \| false | false |
| autoSaveText | 当「自动保存」被触发（通常是 debounced 的输入事件），Monaco 会在右下角闪现一条小提示。用于自定义提示文字 | String | "" |
| monacoOptions | [monaco editor的初始化配置](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html#cursorBlinking) | any | undefined |
### SplitPaneOptions API
| 属性名 | 说明 | 类型 | 默认 |
|---|---|---|---|
| codeTogglerText | 左侧「代码区」折叠/展开按钮上的文字。 | String | "" |
| outputTogglerText | 右侧「预览区」折叠/展开按钮上的文字。| String | "" |
## 贡献者

感谢为这个项目做出贡献的每一个人

<a href="https://github.com/yeminxuan/vitepress-plugin-repl/graphs/contributors">
<img src="https://contrib.rocks/image?repo=yeminxuan/vitepress-plugin-repl" />
</a>

## 📄 许可证

[MIT](./LICENSE) License Copyright (c) 2025 [yeminxuan](https://github.com/yeminxuan)
