# vitepress-plugin-repl

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
* [x] SFC 通过单独的 **```vue** 代码块定义单文件模式
* [x] 使用 `@file 文件名` 紧跟文件的代码块
* [x] use `@import` 紧跟一个自定义“导入映射”的 json 块
* [x] use `@setting` 紧跟一个自定义设置的 json 块

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

### SFC 模式

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

### 多文件模式

使用 `@file` 前缀后面紧跟文件名, 例如：

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

## 编辑器配置

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

## SFC 单文件Vue配置 && 导入映射

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
## 贡献者

感谢为这个项目做出贡献的每一个人。
<a href="https://github.com/yeminxuan/vitepress-plugin-repl/graphs/contributors">
<img src="https://contrib.rocks/image?repo=yeminxuan/vitepress-plugin-repl" />
</a>

## 📄 许可证

<p dir="auto"><a href="/vitepress-plugin-repl/blob/main/LICENSE">MIT</a> License Copyright (c) 2025 yeminxuan <a href="https://github.com/yeminxuan">yeminxuan</a></p>
