<script setup lang="ts">
import { defineClientComponent } from "vitepress";
import { applyPureReactInVue } from "veaury";
import { createRoot } from "react-dom/client";
import { setVeauryOptions } from 'veaury'
// React组件ReactButton
import { ref,onMounted } from "vue";
import { Repl } from "../repl-react/src/Repl";
interface Props {
  code: string
}
const slots = defineSlots();
const props = withDefaults(defineProps<Props>(), {
  code: "",

});
setVeauryOptions({
  react: {
    createRoot
  }
})
const ReplComponent = applyPureReactInVue(Repl)
function onClickForReact() {
  console.log("clicked!");
}
const code = ref()
onMounted(() => {
   if (props.code) {
    try {
      const raw = decodeURIComponent(props.code).trim();
      const cleaned = raw.replace(/,\s*([}\]])/g, "$1");
      code.value = cleaned ? JSON.parse(cleaned) : {};
      console.log(code.value);
      
    } catch (e) {
      console.error("playgound 配置解析错误", e);
    }
  }
  
})
</script>
<template>
  <!-- 在React组件ReactButton中可以使用props.onClick()触发这个事件绑定的函数 -->
    <ReplComponent v-if="code" :defaultCode="code"></ReplComponent>
</template>
