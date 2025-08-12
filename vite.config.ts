/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2025-08-12 10:58:33
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2025-08-12 17:58:04
 * @FilePath: /vitepress-plugin-repl/vite.config.ts
 * @Description:
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
export default defineConfig({
  plugins: [vue(), dts(), cssInjectedByJsPlugin()],
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
        "@vue/repl",
        "vue/compiler-sfc",
        "vue-demi",
        "vitepress",
      ], // ← 关键：告诉 Rollup 忽略 vue
    },
  },
});
