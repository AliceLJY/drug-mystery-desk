import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished evidence desk", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  // title 会随案件增减调整（曾是「药研悬案局｜消失的第七码」），断言只锁品牌名，
  // 后缀有无都放行——避免每次改标题都要回来改测试
  assert.match(html, /<title>药研悬案局[^<]*<\/title>/i);
  assert.match(html, /药研悬案局/);
  assert.match(html, /选择一宗悬案/);
  assert.match(html, /所有案件均为虚构/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps the medical boundary in the rendered product", async () => {
  const source = await readFile(
    new URL("../app/InvestigationDesk.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /不提供诊断、用药建议、疗效或风险结论/);
  assert.match(source, /本机保存/);
  assert.match(source, /没有变化，就不制造结论/);
});
