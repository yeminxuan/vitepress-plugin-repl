<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Repl, useStore } from "@vue/repl";
import { utoa } from "./utils";
import { defineClientComponent } from "vitepress";
import "@vue/repl/style.css";
interface FileItem {
  fileName: string;
  fileContent: string;
}
interface Props {
  editor: string;
  config?: string;
  files?: string;
}
const store = ref();
const slots = defineSlots();
const props = withDefaults(defineProps<Props>(), {
  editor: "CodeMirror",
  config: "",
  files: "",
});
const Monaco = defineClientComponent(() => {
  return import("@vue/repl/monaco-editor");
});
const CodeMirror = defineClientComponent(() => {
  return import("@vue/repl/codemirror-editor");
});
const config = ref({}) as any;
const editorConfig = computed(() => {
  return config.value.editorConfig ? config.value.editorConfig : {};
});

onMounted(() => {
  console.log("接收到组件传值", props);
  const files: FileItem[] = (props.files && JSON.parse(decodeURIComponent(props.files))) || [];

  const children = slots.default();
  const code = children?.[0]?.children;
  store.value = useStore();
  if (props.config) {
    try {
      config.value = JSON.parse(decodeURIComponent(props.config));
    } catch (e) {
      console.error("playgound 配置解析错误", e);
    }
  }

  config.value?.imports &&
    store.value.setImportMap({
      imports: config.value.imports,
    });
  if (files.length > 0) {
    const newFile: Record<string, string> = {};
    for (let i = 0; i < files.length; i++) {
      newFile[`${files[i].fileName}`] = files[i].fileContent;
    }
    store.value.setFiles(newFile, files[0].fileName);
  } else {
    const file = {
      "App.vue": decodeURIComponent(code),
    };
    store.value.setFiles(file, "App.vue");
  }
});
</script>
<style scoped>
.playground {
  height: 400px;
}
.playground :deep(.left) {
  float: inherit;
  margin-left: initial;
  left: initial;
  right: initial;
  background-color: initial;
  min-height: initial;
}

.playground :deep(.right) {
  float: inherit;
  margin-left: initial;
  left: initial;
  right: initial;
  background-color: initial;
  min-height: initial;
}

.playground :deep(.wrapper) {
  display: none;
}
</style>
<template>
  <div class="playground">
    <Repl
      v-if="store"
      autoResize
      :store="store"
      :editor="editor === 'CodeMirror' ? CodeMirror : Monaco"
      :showCompileOutput="true"
      :clearConsole="false"
      v-bind="editorConfig"
    />
  </div>
</template>
