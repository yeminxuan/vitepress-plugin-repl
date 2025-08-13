<script setup lang="ts">
import { ref, onMounted, computed, toRaw } from "vue";
import { Repl, useStore } from "@vue/repl";
import { defineClientComponent } from "vitepress";
import type { Ref } from "vue";
import "@vue/repl/style.css";
interface FileItem {
  fileName: string;
  fileContent: string;
}
interface Props {
  editor: string;
  config?: string;
  files?: string;
  importMap?: string;
}
interface ReplConfig {
  theme?: "dark" | "light"; //set playground theme
  previewTheme?: boolean; // Whether the preview interface follows the playground theme Settings
  autoResize?: boolean; // The playground adapts to the window
  showCompileOutput?: boolean; // Additional display of compiled/translated code or console output (for example, the result of compiling Vue SFC into JS)
  showOpenSourceMap?: boolean;
  showImportMap?: boolean;
  showSsrOutput?: boolean;
  showTsConfig?: boolean;
  clearConsole?: boolean;
  layout?: "horizontal" | "vertical";
  layoutReverse?: boolean;
  ssr?: boolean;
  previewOptions?: {
    headHTML?: string;
    bodyHTML?: string;
    placeholderHTML?: string;
    customCode?: {
      importCode?: string;
      useCode?: string;
    };
    showRuntimeError?: boolean;
    showRuntimeWarning?: boolean;
  };
  editorOptions?: {
    showErrorText?: string | false;
    autoSaveText?: string | false;
    monacoOptions?: any;
  };
  splitPaneOptions?: {
    codeTogglerText?: string;
    outputTogglerText?: string;
  };
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
const config: Ref<ReplConfig> = ref({}) as any;
const singleVueImport: Ref<ReplConfig & { imports: any }> = ref({}) as any;
const importMap = ref({}) as any;
const editorOptions = computed(() => {
  return config.value.editorOptions ? config.value.editorOptions : {};
});
const splitPaneOptions = computed(() => {
  return config.value.splitPaneOptions ? config.value.splitPaneOptions : {};
});
const previewOptions = computed(() => {
  return config.value.previewOptions ? config.value.previewOptions : {};
});

onMounted(() => {
  const files: FileItem[] =
    (props.files && JSON.parse(decodeURIComponent(props.files))) || [];
  const children = slots.default();
  const code = children?.[0]?.children;
  store.value = useStore({});
  if (props.config) {
    try {
      const raw = decodeURIComponent(props.config).trim();
      const cleaned = raw.replace(/,\s*([}\]])/g, "$1");
      config.value = cleaned ? JSON.parse(cleaned) : {};
      singleVueImport.value = cleaned ? JSON.parse(cleaned) : {};
    } catch (e) {
      console.error("playgound 配置解析错误", e);
    }
  }
  if (props.importMap) {
    try {
      const raw = decodeURIComponent(props.importMap).trim();
      const cleaned = raw.replace(/,\s*([}\]])/g, "$1");
      importMap.value = cleaned ? JSON.parse(cleaned) : {};
    } catch (e) {
      console.error("导入映射解析错误", e);
    }
  }
  //如果当前为多文件模式
  if (files.length > 0) {
    const newFile: Record<string, string> = {};
    for (let i = 0; i < files.length; i++) {
      newFile[`${files[i].fileName}`] = files[i].fileContent;
    }
    store.value.setFiles(newFile, files[0].fileName);
  } else {
    //当前为单文件模式
    const file = {
      "App.vue": decodeURIComponent(code),
      "import-map.json": JSON.stringify(toRaw(singleVueImport.value)),
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
      :autoResize="config.autoResize || false"
      :store="store"
      :editor="editor === 'CodeMirror' ? CodeMirror : Monaco"
      :showCompileOutput="config.showCompileOutput"
      :clearConsole="config.clearConsole || false"
      :theme="config.theme"
      :previewTheme="config.previewTheme"
      :showImportMap="config.showImportMap"
      :showOpenSourceMap="config.showOpenSourceMap"
      :showSsrOutput="config.showSsrOutput"
      :showTsConfig="config.showTsConfig"
      :layoutReverse="config.layoutReverse"
      :ssr="config.ssr"
      :layout="config.layout"
      :splitPaneOptions="splitPaneOptions"
      :editorOptions="editorOptions"
      :previewOptions="previewOptions"
    />
  </div>
</template>
