function T(r, o, f) {
  function t(n) {
    return n.trim().split(" ", 2)[0] === o;
  }
  function a(n, d, y, h, e) {
    return n[d].nesting === 1 && n[d].attrJoin("class", o), e.renderToken(n, d, y, h, e);
  }
  f = f || {};
  const u = 3, c = f.marker || ":", s = c.charCodeAt(0), i = c.length, C = f.validate || t, k = f.render || a;
  function P(n, d, y, h) {
    let e, M = !1, l = n.bMarks[d] + n.tShift[d], _ = n.eMarks[d];
    if (s !== n.src.charCodeAt(l))
      return !1;
    for (e = l + 1; e <= _ && c[(e - l) % i] === n.src[e]; e++)
      ;
    const b = Math.floor((e - l) / i);
    if (b < u)
      return !1;
    e -= (e - l) % i;
    const $ = n.src.slice(l, e), R = n.src.slice(e, _);
    if (!C(R, $))
      return !1;
    if (h)
      return !0;
    let p = d;
    for (; p++, !(p >= y || (l = n.bMarks[p] + n.tShift[p], _ = n.eMarks[p], l < _ && n.sCount[p] < n.blkIndent)); )
      if (s === n.src.charCodeAt(l) && !(n.sCount[p] - n.blkIndent >= 4)) {
        for (e = l + 1; e <= _ && c[(e - l) % i] === n.src[e]; e++)
          ;
        if (!(Math.floor((e - l) / i) < b) && (e -= (e - l) % i, e = n.skipSpaces(e), !(e < _))) {
          M = !0;
          break;
        }
      }
    const I = n.parentType, N = n.lineMax;
    n.parentType = "container", n.lineMax = p;
    const m = n.push("container_" + o + "_open", "div", 1);
    m.markup = $, m.block = !0, m.info = R, m.map = [d, p], n.md.block.tokenize(n, d + 1, p);
    const v = n.push("container_" + o + "_close", "div", -1);
    return v.markup = n.src.slice(l, e), v.block = !0, n.parentType = I, n.lineMax = N, n.line = p + (M ? 1 : 0), !0;
  }
  r.block.ruler.before("fence", "container_" + o, P, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  }), r.renderer.rules["container_" + o + "_open"] = k, r.renderer.rules["container_" + o + "_close"] = k;
}
const g = "@";
function j(r, o) {
  const f = [];
  let t = o + 1;
  for (; t < r.length; ) {
    const a = r[t];
    if (a.type === "container_playground_close") break;
    if (a.type === "paragraph_open") {
      const u = r[t + 1];
      if (u?.type === "inline" && u.content.startsWith(`${g}file `)) {
        const c = u.content.replace(`${g}file `, "").trim(), s = r[t + 3];
        s?.type === "fence" && f.push({ fileName: c, fileContent: s.content.trimEnd() }), t += 4;
        continue;
      }
      if (u?.content === `${g}import`) {
        const c = r[t + 3];
        c?.type === "fence" && f.push({ fileName: "__import_map.json", fileContent: c.content.trimEnd() }), t += 4;
        continue;
      }
      if (u?.content === `${g}setting`) {
        const c = r[t + 3];
        c?.type === "fence" && f.push({ fileName: "__setting.json", fileContent: c.content.trimEnd() }), t += 4;
        continue;
      }
    }
    t++;
  }
  return f;
}
const U = (r, o) => {
  if (r[o].nesting === -1) return `</VuePlayground>
`;
  const t = r[o].info.trim().toLowerCase().includes("monaco") ? "Monaco" : "CodeMirror", a = j(r, o);
  if (a.length > 0) {
    const u = a.find((i) => i.fileName === "__setting.json")?.fileContent || "{}", c = a.find((i) => i.fileName === "__import_map.json")?.fileContent || "{}", s = a.filter((i) => !i.fileName.startsWith("__"));
    return encodeURIComponent(JSON.stringify(s)), r[o].nesting === 1 ? `<VuePlayground
      editor="${t}"
      files="${encodeURIComponent(JSON.stringify(s))}"
      config="${encodeURIComponent(u)}"
      importMap="${encodeURIComponent(c)}"
      >` : `</VuePlayground>
`;
  } else if (r[o].nesting === 1) {
    const u = r[o].info.toLowerCase().indexOf("monaco") > -1 ? "Monaco" : "CodeMirror", c = r.slice(o).find((i) => i.info === "vue"), s = r.slice(o).find((i) => i.info === "json") || "";
    return `<VuePlayground editor="${u}" config="${encodeURIComponent(s.content)}">${encodeURIComponent(c.content)}
`;
  } else
    return `</VuePlayground>
`;
};
function V(r) {
  const o = r.renderer.rules.fence, f = /^playground\s*(CodeMirror|Monaco)?\s*$/i;
  r.use(T, "playground", {
    validate: function(t) {
      return t.trim().match(f);
    },
    render: U
  }), r.renderer.rules.fence = (t, a, u, c, s) => {
    const i = t[a - 1];
    return i && i.nesting === 1 && i.info.trim().match(/^playground\s*(.*)$/) ? "" : o(t, a, u, c, s);
  };
}
export {
  V as VueReplMdPlugin
};
