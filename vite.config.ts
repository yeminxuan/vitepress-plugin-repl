import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";
import veauryVitePlugins from "veaury/vite";
import reactReplConfig from "./repl-react/vite.config";
export default defineConfig({
  ...reactReplConfig,
  base: "./",
  plugins: [
    vue(),
    react(),

    veauryVitePlugins({
      type: "vue",
      include: ["*.tsx"],
      // Configuration of @vitejs/plugin-vue
      // vueOptions: {},
      // // Configuration of @vitejs/plugin-react
      // reactOptions: {},
      // // Configuration of @vitejs/plugin-vue-jsx
      // vueJsxOptions: {}
    }),
  ],
  build: {
    lib: {
      entry: "./node/index.ts",
      name: "vitepress-plugin-repl",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "vue",
        "react",
        "@vue/repl",
        "vue/compiler-sfc",
        "vue-demi",
        "vitepress",
      ], // ← 关键：告诉 Rollup 忽略 vue
    },
  },
});
