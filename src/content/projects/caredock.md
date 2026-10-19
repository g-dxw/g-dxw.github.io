---
title: "CareDock · 安养台"
subtitle: "为小型养老服务机构探索本地优先工作台"
summary: "围绕机构初始化与本地数据管理设计桌面原型，并探索 SQLite 迁移、事务和升级前备份。"
category: "experiment"
status: "prototype"
origin: "产品原型与技术验证"
featured: false
order: 8
topics: ["product-making"]
stack: ["Tauri", "React", "TypeScript", "Rust", "SQLite"]
repository: "https://github.com/g-dxw/caredock"
cover: "/images/projects/caredock-dashboard.png"
focus: "探索业务工作台怎样在本地数据、桌面体验与可维护性之间取得平衡。"
updatedAt: "2026-08-02"
---

## 从哪里开始

小型养老服务机构的业务工具，既要贴近日常操作，也要考虑本地数据保存、升级与恢复。CareDock 从这一场景出发，先用产品原型表达业务流程，再验证桌面工程能否承载这些设想。

## 怎样组织这件事

界面使用 React，桌面壳采用 Tauri，Rust 侧分层处理命令与数据访问。原型覆盖邮箱账号、机构初始化和本地数据管理等链路，浏览器预览与桌面窗口复用同一套组件，便于讨论和调整交互。

## 实现中的选择

工程验证重点放在 SQLite、事务、迁移与升级前备份。正式数据库和技术探针分开，演示数据也不写入正式库。这让产品讨论与数据基础可以分别推进，减少原型演示对真实数据环境的影响。

## 目前做到哪一步

当前业务界面仍使用匿名演示数据，尚未连接正式数据访问层；账号、验证码和离线会话是本地模拟。它目前是一项产品与技术验证，距离机构实际使用，还需要业务接线、真实认证与设备安装验证。

## 继续了解

项目状态、工程说明与只读原型入口见 [caredock](https://github.com/g-dxw/caredock)。这个案例记录的是如何把复杂场景逐步拆到可以讨论和验证的程度。
