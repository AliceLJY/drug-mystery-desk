# 药研悬案局 Drug Mystery Desk

[English](./README.md)

由 Minis——我在 ChatGPT 侧的 AI——在 ChatGPT Apps 平台上对话开发。本仓是那个项目的公开镜像。

一个本地优先的证据桌，用来追踪药物研究里悬而未决的问题。每个案子保存一条预测、它的置信度、来自 ClinicalTrials.gov 和 openFDA 的快照，以及一部带日期的判断修订史。

## 环境要求

- Node.js `>=22.13.0`

## 本地运行

```bash
npm install
npm run dev
npm run build
```

打开 `http://localhost:3000`。案件数据存在浏览器 local storage 里；这个版本不需要账号、也不需要数据库。

## 当前范围

- 创建研究案件，并在多个案件之间切换
- 保存预测、置信度、复查日期与修订判据
- 从 ClinicalTrials.gov 拉取当前试验记录
- 从 openFDA 拉取当前药品标签记录
- 对比前后快照，记录上调 / 下调 / 不变的判断
- 全部个人笔记与案件史只留在当前设备

## 安全边界

这个应用只做公开证据的整理。它不诊断、不推荐治疗、不验证疗效、不估计获批概率，也不替代原始记录与专业审查。

## 验证

```bash
npm run lint
npm test
```
