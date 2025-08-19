import MarkdownItContainer from "markdown-it-container";
import type { RenderRule } from "markdown-it/lib/renderer";
const AT_MARKER = "@";
const parseReactPlaygroundFiles = (tokens: any[], idx: number) => {
 const files: { fileName: string; fileContent: string }[] = [];
  let i = idx + 1;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === "container_react-playground_close") break;

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
const ReactPlaygroundRender: RenderRule = (tokens, idx) => {
  const fileList = parseReactPlaygroundFiles(tokens, idx);
  if (fileList.length > 0) {
    if (tokens[idx].nesting === 1) {
      return `<ReactPlayground>\n`;
    } else {
      // closing tag
      return "</ReactPlayground>\n";
    }
  }else {
    if (tokens[idx].nesting === 1) {
     
      const reactToken: any = tokens.slice(idx).find(e => e.info === "react");
       console.log(reactToken);
      return `<ReactPlayground code="${encodeURIComponent(JSON.stringify(reactToken.content))}">\n`;
    } else {
      // closing tag
      return "</ReactPlayground>\n";
    }
  }

}
export function ReactReplMdPlugin(md: any) {
  const defaultRender = md.renderer.rules.fence;
  //正则匹配自定义的md-container是否包含 playground  + | CodeMirror | Monaco
  const pattern = /^react-playground\s*(CodeMirror|Monaco)?\s*$/i;
  
  md.use(MarkdownItContainer, "react-playground", {
    validate: function (params: string) {
      return params.trim().match(pattern);
    },
    render: ReactPlaygroundRender,
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