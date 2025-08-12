# vitepress-plugin-repl


## install

```shell
npm i vitepress-plugin-repl -D
```



## config

```js
// config.ts
import { VueReplMdPlugin } from 'vitepress-plugin-repl';

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
import Playground from 'vitepress-plugin-repl/components/index.vue'
import DefaultTheme from 'vitepress/theme';

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
      ctx.app.component('VuePlayground', Playground);
    },
};
```


## Usage 

### SFC Mode
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
