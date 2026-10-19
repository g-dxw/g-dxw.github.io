---
title: "LingWeave · 灵织"
subtitle: "在无限画布上连接素材、想法与生成结果"
summary: "用节点与连线组织提示词、参考素材、模型配置和生成结果，让创作可以保留上下文并继续分支。"
category: "product"
status: "exploring"
origin: "开源二次开发"
featured: false
order: 4
topics: ["ai-practice", "product-making"]
stack: ["React", "TypeScript", "Vite", "IndexedDB", "WebDAV"]
repository: "https://github.com/g-dxw/lingweave"
cover: "/images/lingweave-home.png"
focus: "把一次次生成连接为可以回看、复用和继续探索的创作过程。"
updatedAt: "2026-08-24"
---

## 从哪里开始

视觉创作常常从一张参考图开始，经过多次改写、生成与比较，再延伸出新的方向。聊天记录擅长按时间排列内容，却不容易看清不同素材与结果之间的关系。LingWeave 尝试用画布承接这种探索。

## 怎样组织这件事

提示词、图片、视频、音频与生成配置都可以成为节点，连线表达引用关系。一个满意的结果可以继续作为下一次生成的输入，也能存入本地素材库，让过程保留在画布上。

## 实现中的选择

项目以 Web 前端为主体，画布和素材默认保存在浏览器本地，并提供导入导出与可选 WebDAV 同步。AI 请求使用当前环境配置的兼容接口。后续还加入了本地 Canvas Agent 与 Codex 协作，让人工整理和 Agent 操作使用同一张画布。

## 目前做到哪一步

它仍处于开发阶段，本地数据结构可能变化，更适合个人使用或可信环境部署。使用前需要配置自己的模型服务，也需要主动备份画布；目前没有面向公网多人协作的业务后端。

## 继续了解

项目从 [basketikun/infinite-canvas](https://github.com/basketikun/infinite-canvas) 起步，保留来源与提交历史，在 [LingWeave 仓库](https://github.com/g-dxw/lingweave)继续维护，并遵循 AGPL-3.0。
