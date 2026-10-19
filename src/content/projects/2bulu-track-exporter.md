---
title: "两步路轨迹导出"
subtitle: "让轨迹与标注照片一起离开原来的页面"
summary: "浏览器用户脚本，导出轨迹和标注点，保留照片信息，并提供 GPX、KML、TCX、CSV 与 JSON。"
category: "tool"
status: "active"
origin: "个人工具"
featured: false
order: 7
topics: ["outdoor-life"]
stack: ["JavaScript", "用户脚本", "GPX", "KML"]
repository: "https://github.com/g-dxw/2bulu-track-exporter"
cover: "/images/projects/track-export-flow.svg"
focus: "补齐网页轨迹导出时丢失的照片标注，并方便后续整理和创作。"
updatedAt: "2026-08-28"
---

## 从哪里开始

整理户外记录时，轨迹文件只有一条线往往不够。沿途标注与照片提供了地点、风景和行程的上下文。这个小工具从两步路 PC 端导出格式有限、标注照片容易丢失的问题出发。

## 怎样组织这件事

脚本运行在浏览器的轨迹页面，读取轨迹点与标注点后一起导出。它可以识别当前详情页或分享页，也支持在轨迹入口输入 Track ID 或 URL，并处理多层编码的轨迹标识。

## 实现中的选择

输出包括通用 GPX、两种 KML、TCX、CSV 与 JSON。不同格式分别服务于地图查看、运动工具和程序处理；轨迹分段、时间、海拔、速度与照片信息在可获得时保留，让后续工具仍能继续使用这些材料。

## 目前做到哪一步

它使用当前页面的请求能力，需要浏览器本身能够访问目标轨迹。登录、人机验证和页面接口变化仍会影响使用，脚本不会绕过访问控制。相比建立另一个平台，这个项目选择先解决一个清楚而具体的数据出口问题。

## 继续了解

安装方式、格式说明与截图见 [2bulu-track-exporter](https://github.com/g-dxw/2bulu-track-exporter)。导出的材料也可以作为轨迹工作台与路线图制作的输入。
