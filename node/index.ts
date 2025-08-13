import MarkdownItContainer from "markdown-it-container";
import type { RenderRule } from "markdown-it/lib/renderer";

const AT_MARKER = "@";
const VALID_MARKERS = ["file", "import", "setting"] as const;
/** 解析 playground 内所有 token，返回 {fileName, fileContent} 数组 */
function parsePlaygroundFiles(tokens: any[], idx: number) {
  const files: { fileName: string; fileContent: string }[] = [];
  let i = idx + 1;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === "container_playground_close") break;

    if (t.type === "paragraph_open") {
      const inline = tokens[i + 1];
      if (inline?.type === "inline" && inline.content.startsWith(`${AT_MARKER}file `)) {
        const fileName = inline.content.replace(`${AT_MARKER}file `, "").trim();
        const fence = tokens[i + 3]; // paragraph_open / inline / paragraph_close / fence
        if (fence?.type === "fence") {
          files.push({ fileName, fileContent: fence.content.trimEnd() });
        }
        i += 4;
        continue;
      }
      if (inline?.content === `${AT_MARKER}import`) {
        const fence = tokens[i + 3];
        if (fence?.type === "fence") {
          files.push({ fileName: "import-map.json", fileContent: fence.content.trimEnd() });
        }
        i += 4;
        continue;
      }
      if (inline?.content === `${AT_MARKER}setting`) {
        const fence = tokens[i + 3];
        if (fence?.type === "fence") {
          files.push({ fileName: "__setting.json", fileContent: fence.content.trimEnd() });
        }
        i += 4;
        continue;
      }
    }
    i++;
  }
  return files;
}
const playgroundRender: RenderRule = (tokens, idx) => {
  if (tokens[idx].nesting === -1) return "</VuePlayground>\n";

  const info = tokens[idx].info.trim();
  const editor = info.toLowerCase().includes("monaco") ? "Monaco" : "CodeMirror";

  const fileList = parsePlaygroundFiles(tokens, idx);
  if (fileList.length > 0) {
    const config = fileList.find(f => f.fileName === "__setting.json")?.fileContent || "{}";
    // @vue/repl Render the Import Map by obtaining the file name of import-map.json, so the same name needs to be set here
    const importMap = fileList.find(f => f.fileName === "import-map.json")?.fileContent || "{}";
    const codeFiles = fileList.filter(f => !f.fileName.startsWith("__"));

    if (tokens[idx].nesting === 1) {
      return `<VuePlayground
      editor="${editor}"
      files="${encodeURIComponent(JSON.stringify(codeFiles))}"
      config="${encodeURIComponent(config)}"
      importMap="${encodeURIComponent(importMap)}"
      >`;
    } else {
      return "</VuePlayground>\n";
    }
  } else {
    if (tokens[idx].nesting === 1) {
      const editor = tokens[idx].info.toLowerCase().indexOf("monaco") > -1 ? "Monaco" : "CodeMirror";
      const vueToken: any = tokens.slice(idx).find(e => e.info === "vue");
      const jsonToken: any = tokens.slice(idx).find(e => e.info === "json") || "";
      return `<VuePlayground editor="${editor}" config="${encodeURIComponent(jsonToken.content)}">${encodeURIComponent(vueToken.content)}\n`;
    } else {
      // closing tag
      return "</VuePlayground>\n";
    }
  }
};
export function VueReplMdPlugin(md: any) {
  const defaultRender = md.renderer.rules.fence;
  //正则匹配自定义的md-container是否包含 playground  + | CodeMirror | Monaco
  const pattern = /^playground\s*(CodeMirror|Monaco)?\s*$/i;
  md.use(MarkdownItContainer, "playground", {
    validate: function (params: string) {
      return params.trim().match(pattern);
    },
    render: playgroundRender,
  });

  md.renderer.rules.fence = (tokens: any[], idx: number, options: markdownit.Options, env: any, self: any) => {
    const prevToken = tokens[idx - 1];
    const inPlayground = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^playground\s*(.*)$/);
    // 当前在 playground 块中, 不去渲染内容
    if (inPlayground) {
      return "";
    }

    return defaultRender!(tokens, idx, options, env, self);
  };
}
