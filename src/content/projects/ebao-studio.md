---
title: "e宝工坊"
subtitle: "把 AI、插件与日常工作放进同一个桌面"
summary: "围绕 DeepSeek Harness 构建桌面工作台，将插件、配置隔离、多平台发布与原生桌面体验组织起来。"
category: "product"
status: "active"
origin: "开源二次开发与产品集成"
featured: true
order: 1
topics: ["ai-practice", "product-making"]
stack: ["Electron", "TypeScript", "DeepSeek Harness", "Yarn"]
repository: "https://github.com/cqai-club/ebao-studio"
cover: "/images/projects/ebao-home.jpg"
focus: "让分散的 AI 工具成为可安装、可配置、能持续使用的桌面工作流。"
updatedAt: "2026-10-15"
---

## 从哪里开始

AI 工具的能力越来越多，真正使用时却经常要在网页、命令行和不同配置之间来回切换。e宝工坊从这个问题出发，把本地 AI 工作环境带进一个桌面窗口，并围绕日常使用中的具体任务逐步组合插件。

## 怎样组织这件事

项目以 DeepSeek Harness 为基础，保留固定版本的上游源码，通过自己的 Electron 启动器与桌面插件提供窗口、托盘、原生终端、Profile 管理和故障恢复。把上游能力与产品扩展分开，是为了让后续升级仍有清晰边界。

## 实现中的选择

多平台发布是其中一条正在推进的工作流：桌面端组织内容、账号与任务，发布执行衔接 MatrixMedia。这里关心的既是“能提交”，也是执行状态、失败反馈和配置恢复能否让人理解。

## 目前做到哪一步

当前已经提供 Windows 与 macOS 安装包，实际能力取决于版本、Profile 和启用的插件。社区独立维护的桌面集成仍在演进，各内容平台的登录与发布结果也需要分别验证。

## 继续了解

项目代码与使用说明见 [e宝工坊](https://github.com/cqai-club/ebao-studio)。基础能力来自 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)，发布集成使用 [MatrixMedia](https://github.com/cqai-club/MatrixMedia)。
