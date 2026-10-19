---
title: "闲鱼自动化工具"
subtitle: "从自动回复与发货，延伸到 AI 可操作的商品流程"
summary: "在开源闲鱼系统上扩展 MCP 商品发布与卡券管理，处理权限、重复请求、未知结果和持续交付。"
category: "product"
status: "active"
origin: "开源二次开发"
featured: true
order: 2
topics: ["ai-practice", "product-making"]
stack: ["FastAPI", "React", "MySQL", "Redis", "Playwright", "MCP"]
cover: "/images/projects/xianyu-workflow.svg"
focus: "把商品与库存操作开放给 AI，同时明确每次操作的权限和执行结果。"
updatedAt: "2026-10-14"
---

## 从哪里开始

回复消息、整理商品和发出卡券，都是线上经营里重复出现的工作。这个项目基于已有的闲鱼自动回复系统继续扩展，希望把后台里的操作串成更连贯的流程，也让 AI 能在明确授权下参与其中。

## 怎样组织这件事

原有系统提供多账号、消息、自动回复与发货能力。后续扩展加入 MCP 入口，让客户端可以查询账号、准备素材、发布商品和管理卡券；访问由个人 Token、权限范围、账号范围与资源归属共同约束。

## 实现中的选择

最值得花时间的是重复请求和不确定结果。写操作使用请求号避免同一意图被重复执行；发布任务保留可查询的操作记录，遇到服务中断或平台结果不明时标记为未知，留给实际核查。库存追加也要兼顾并发发货，避免覆盖扣减。

## 目前做到哪一步

工程侧补充了测试、构建产物交付与失败回滚流程。平台登录、风控与真实上架仍受外部环境影响，自动化测试覆盖协议和业务边界，实际账户的发布效果需要另外验收。目前不提供公开体验入口。

## 继续了解

基础系统来自 [zhinianboke/xianyu-auto-reply](https://github.com/zhinianboke/xianyu-auto-reply)。这里展示的是在其基础上继续做的流程扩展与工程实践。
