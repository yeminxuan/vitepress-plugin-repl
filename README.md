# vite-plugin-repl


## install

```shell
npm i vite-plugin-repl -D
```



## config

```js
// config.ts
import { VueReplMdPlugin } from 'vite-plugin-repl';

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(VueReplMdPlugin)
    }
  },
})
```


```js
// theme/index.ts
import Playground from 'vite-plugin-repl/components/index.vue'
import DefaultTheme from 'vitepress/theme';

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
      ctx.app.component('VuePlayground', Playground);
    },
};
```


## Usage
````markdown

::: playground
```vue
<template>
  <div>test</div>
</template>
<script setup lang="ts">

</script>
<style scoped>

</style>

```
:::

````

## Code Editor Config

+ CodeMirror `default`
+ Monaco
+ Sanbox

因默认为 `CodeMirror` 下面给出的是 `Monaco Editor` 的案例：

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

## Vue Repl Config & imports

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
  }
}
```
:::

````