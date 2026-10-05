#!/usr/bin/env node
/**
 * 把药研悬案局打包成一个单文件 HTML：GitHub Pages 部署用，也可以离线双击打开。
 *
 * 用法（项目根）：npm run build:standalone [-- 输出路径]
 * 默认输出 out/standalone/index.html。
 *
 * 为什么不用 esbuild/vite：这个脚本最初是 Minis 在 iSH 上写的，那里 node_modules 里的
 * esbuild 是 @esbuild/darwin-arm64（Mac 的），跑不了；tsc CLI 在 iSH 上静默不写文件。
 * 所以这里用 ts.transpileModule 内存转译 + 手写一个极简 CJS loader，把 react / react-dom /
 * scheduler 的 production 构建内联进去。不碰 app/api，也不需要 Next 的 basePath。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'out/standalone/index.html'));

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ---- 1. React 运行时（CJS production 构建，依赖关系: react/scheduler 无依赖）----
const vendor = `
(function(){
  var __mods = {}, __cache = {};
  function define(name, fn){ __mods[name] = fn; }
  function require(name){
    if (__cache[name]) return __cache[name].exports;
    var m = { exports: {} };
    __cache[name] = m;
    if (!__mods[name]) throw new Error('missing module: ' + name);
    __mods[name](m, m.exports, require);
    return m.exports;
  }
  var process = { env: { NODE_ENV: 'production' } };
  define('react', function(module, exports, require){ ${read('node_modules/react/cjs/react.production.js')} });
  define('scheduler', function(module, exports, require){ ${read('node_modules/scheduler/cjs/scheduler.production.js')} });
  define('react-dom', function(module, exports, require){ ${read('node_modules/react-dom/cjs/react-dom.production.js')} });
  define('react-dom/client', function(module, exports, require){ ${read('node_modules/react-dom/cjs/react-dom-client.production.js')} });
  define('react/jsx-runtime', function(module, exports, require){ ${read('node_modules/react/cjs/react-jsx-runtime.production.js')} });
  window.__req = require;
})();
`;

// ---- 2. 组件：转译 tsx，把 import 改写成 __req 调用 ----
// 组件清单从 CaseHub.tsx 的 import 自动派生：新案只要接进大厅就会被打包。
// （原先写死清单——新案漏改时 CI 照绿、Pages 照部署，线上点开新案却白屏）
const CASES = [...read('app/CaseHub.tsx').matchAll(/^import\s+\w+\s+from\s+"\.\/(\w+)";?\s*$/gm)].map((m) => m[1]);
const COMPONENTS = [...CASES, 'CaseHub'];
let appCode = '(function(){\nvar __c = {};\n';
for (const name of COMPONENTS) {
  let src = read(`app/${name}.tsx`);
  src = src.replace(/import\s+"\.\/[\w-]+\.css";?/g, '');
  const js = ts.transpileModule(src, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  appCode += `__c["${name}"] = (function(){ var module={exports:{}}, exports=module.exports;
    var require = function(n){ if(n.charAt(0)==="."){ return __c[n.replace(/^\\.\\//,"")]; } return window.__req(n); };
    ${js}
    return module.exports; })();\n`;
}
appCode += `
var React = window.__req('react');
var createRoot = window.__req('react-dom/client').createRoot;
createRoot(document.getElementById('root')).render(React.createElement(__c['CaseHub'].default));
})();
`;

// ---- 3. 样式：合并各案 css（剥 tailwind import；globals 只取 :root 变量与基础重置）----
// 样式同理：按「大厅在前、各案按大厅 import 顺序」收集每个组件自己 import 的 css（顺序与原清单一致）
const cssFiles = ['CaseHub', ...CASES].flatMap((n) => [...read(`app/${n}.tsx`).matchAll(/import\s+"\.\/([\w-]+\.css)";?/g)].map((m) => `app/${m[1]}`));
for (const name of COMPONENTS) if (!fs.existsSync(path.join(ROOT, `app/${name}.tsx`))) throw new Error(`CaseHub 引用了不存在的组件 ${name}`);
let css = cssFiles.map((f) => read(f).replace(/@import\s+"tailwindcss";?/g, '')).join('\n');
const globals = read('app/globals.css').replace(/@import\s+"tailwindcss";?/g, '');
const rootVars = (globals.match(/:root\s*\{[^}]*\}/) || [''])[0];

const RESET = `*,*::before,*::after{box-sizing:border-box}
body,h1,h2,h3,h4,p,figure,blockquote,dl,dd,fieldset,legend{margin:0}
fieldset{border:0;padding:0}
body{min-height:100vh;-webkit-text-size-adjust:100%;font-family:-apple-system,"PingFang SC",sans-serif}
button,input,select,textarea{font:inherit;color:inherit}
button{cursor:pointer}
img{max-width:100%;display:block}
pre{font-family:ui-monospace,monospace}`;

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#efece5">
<title>药研悬案局</title>
<style>${RESET}\n${rootVars}\n${css}</style>
</head>
<body>
<div id="root"></div>
<script>${vendor}</script>
<script>${appCode}</script>
</body>
</html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
process.stdout.write(`OK  ${path.relative(ROOT, OUT)}  ${(html.length / 1024).toFixed(0)} KB  ·  ${CASES.length} 宗案件：${CASES.join(', ')}  ·  ${cssFiles.length} 份样式\n`);
