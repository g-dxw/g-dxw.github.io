# AGENTS.md

## 项目概述

基于 Astro 的个人博客系统，源码托管 GitHub，Vercel 部署。

## 常用命令

```bash
npm run dev        # 启动开发服务器 (localhost:4321)
npm run build      # 生产构建
npm run preview    # 本地预览构建产物
npx astro check    # TypeScript 类型检查
npx astro add      # 添加集成
```

## 项目结构

```
src/
├── content/
│   └── blog/                  # Markdown 文章（Content Collections）
│       └── YYYY-MM-DD-slug.md # 命名规范：日期-短标题
├── components/                # Astro 组件
│   ├── Header.astro           # 导航栏（毛玻璃效果 + 暗色切换）
│   ├── Footer.astro           # 页脚
│   ├── PostCard.astro         # 文章卡片
│   ├── PostGrid.astro         # 文章网格
│   ├── ImageViewer.astro      # Lightbox 图片查看器
│   ├── TagBadge.astro         # 标签徽章
│   ├── SearchBox.astro        # 搜索框
│   └── ThemeToggle.astro      # 暗色模式切换按钮
├── layouts/
│   ├── Base.astro             # 基础布局（SEO + 暗色模式防闪白）
│   └── Post.astro             # 文章详情布局
├── pages/
│   ├── index.astro            # 首页
│   ├── blog/[slug].astro      # 文章详情
│   ├── blog/tag/[tag].astro   # 标签筛选
│   ├── about.astro            # 关于页
│   ├── rss.xml.ts             # RSS
│   └── 404.astro              # 404
├── styles/
│   └── global.css             # 全局样式 + CSS 变量 + Tailwind
└── utils/
    ├── theme.ts               # 暗色模式切换逻辑
    └── search.ts              # Pagefind 搜索封装
```

## 新增文章

在 `src/content/blog/` 下创建 `YYYY-MM-DD-slug.md`：

```markdown
---
title: "文章标题"
date: 2026-06-04
cover: "/images/cover.jpg"    # 可选
tags: ["标签1", "标签2"]       # 可选
summary: "文章摘要"             # 可选
draft: false                   # true 时构建跳过
---

正文（Markdown 格式）
```

### 配图规范

**文章尽量多配图。** 图文并茂的阅读体验远优于纯文字，尤其技术文章。每篇新文章应至少考虑配 1 张封面图 + 必要的文中示意图。

- **封面图（cover）**：frontmatter 的 `cover` 字段，存于 `public/images/`，建议 16:9 宽图
- **文中示意图**：存于 `public/images/`，在正文中用 Markdown 语法 `![alt 描述](/images/xxx.svg)` 引用
- **图片格式**：
  - 概念图 / 流程图 / 对比图 → 优先用 **SVG**（矢量、清晰、体积小、可被 rehype 插件处理）
  - 截图 / 真实界面 → 用 PNG
  - 照片类 → 用 JPG / WebP
- **存放路径**：统一放 `public/images/`，命名用 `kebab-case` + 文章相关前缀（如 `ai-four-mechanisms.svg`、`agent-loop-flow.png`）
- **alt 文本**：每张图必须有描述性 alt，既用于无障碍，也利于 SEO
- **懒加载**：项目已配置 `rehypeLazyImages` 插件，Markdown 正文图片会自动注入 `loading="lazy"` 和 `decoding="async"`，无需手动添加
- **风格**：配图配色尽量对齐设计令牌（强调色 `#e87b35` / `#f0984a`，背景 `#fafaf8` / `#111110`），保持全站视觉统一

## 设计令牌

| Token | 亮色 | 暗色 |
|-------|------|------|
| 背景 | `#fafaf8` | `#111110` |
| 卡片 | `#ffffff` | `#1a1a19` |
| 正文 | `#2d2d2a` | `#e0e0dd` |
| 强调 | `#e87b35` | `#f0984a` |

## 部署

- `git push main` → GitHub Actions 触发 → Vercel 生产部署
- PR → Vercel 自动创建预览部署
- 环境变量需在 Vercel Dashboard 配置：无（纯静态站点）

## 技术栈

- **框架**: Astro v6（SSG 模式）
- **样式**: Tailwind CSS v4（CSS-first 配置）
- **搜索**: Pagefind（构建时索引）
- **部署**: Vercel（GitHub Actions）
- **内容**: Markdown + Content Collections + Zod 校验
