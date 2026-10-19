---
title: "轨迹生图 Skill"
subtitle: "先核对路线，再把它画成一张图"
summary: "将真实轨迹、点位与照片整理成可检查的几何资产和提示词，探索更可控的 AI 路线图制作流程。"
category: "experiment"
status: "exploring"
origin: "Agent 工作流实验"
featured: false
order: 6
topics: ["ai-practice", "outdoor-life"]
stack: ["Python", "GPX / KML / KMZ", "SVG", "Agent Skill"]
repository: "https://github.com/g-dxw/trail-image-generation-skill"
cover: "/images/projects/trail-nanshan-example.png"
focus: "减少 AI 路线图中的轨迹变形、点位遗漏与照片对应错误。"
updatedAt: "2026-08-10"
---

## 从哪里开始

AI 很容易生成一张“像地图”的图片，却可能移动起终点、漏掉标记，甚至镜像真实路线。轨迹生图 Skill 围绕这个问题，把路线制作拆成逐步确认的过程，让画面之前先有可核对的事实。

## 怎样组织这件事

工作流从 GPX、KML 或 KMZ 出发，提取路线与照片，整理唯一的路线核对单。点位确认后生成 SVG、PNG 和布局数据，再确定文案、画面规格与完整提示词；有图像工具且获得授权时，才进入生成。

## 实现中的选择

关键取舍是把几何与装饰分开。路线、方向、起终点和编号优先于背景与排版；地标照片可以先转绘成统一画风，再经审核组成参考板。实际上传素材与执行器能力也需要记录，避免过程里悄悄丢掉重要参考。

## 目前做到哪一步

项目已提供路线分析、几何生成、参考板与执行清单校验工具，以及南山十二峰案例。它仍是一项持续探索：模型可能改变文字和几何，最终路线图需要人工验收，也不能作为出行导航或安全判断的依据。

## 继续了解

完整流程与可核对案例见 [trail-image-generation-skill](https://github.com/g-dxw/trail-image-generation-skill)。没有图像服务时，也可以只完成路线整理与提示词。
