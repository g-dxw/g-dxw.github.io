# Astro 个人博客系统设计文档

**日期**: 2026-06-04
**状态**: 设计完成，待用户审阅

---

## 1. 概述

基于 Astro 搭建的现代个人博客系统，源码托管 GitHub，通过 GitHub Actions 触发 Vercel 部署。

### 关键目标
- 图文混合型博客，良好图片展示体验
- Markdown 管理内容，后续可接入 CMS
- 现代有个性的设计，支持暗色模式
- RSS 订阅 + 客户端静态搜索
- Git push 自动部署，支持预览部署

### 非目标
- 评论系统（暂不加）
- 多作者管理
- 后端 CMS 集成（预留但不实现）
- i18n / 多语言

---

## 2. 技术栈

| 层面 | 选择 |
|------|------|
| 框架 | Astro v6（Content Collections） |
| 样式 | Tailwind CSS |
| 暗色模式 | CSS 变量 + Tailwind dark: 前缀 + localStorage 持久化 |
| 图片优化 | Astro 内置 `<Image />` 组件 |
| 搜索 | Pagefind（构建时生成索引） |
| 部署 | Vercel（GitHub Actions 触发） |
| RSS | Astro RSS 包（@astrojs/rss） |
| 内容校验 | Zod（Content Collections 内置） |
| 类型 | TypeScript |

---

## 3. 项目结构

```
my-blog/
├── src/
│   ├── content/
│   │   └── blog/                    # Markdown 文章
│   │       └── 2026-06-04-hello-world.md
│   ├── components/
│   │   ├── Header.astro             # 导航 + 暗色切换 + 毛玻璃效果
│   │   ├── Footer.astro
│   │   ├── PostCard.astro           # 文章卡片
│   │   ├── PostGrid.astro           # 文章网格布局
│   │   ├── ImageViewer.astro        # Lightbox 图片查看
│   │   ├── TagBadge.astro           # 标签徽章
│   │   ├── SearchBox.astro          # 搜索框
│   │   └── ThemeToggle.astro        # 暗色模式切换按钮
│   ├── layouts/
│   │   ├── Base.astro               # 基础布局（SEO meta）
│   │   └── Post.astro               # 文章详情布局
│   ├── pages/
│   │   ├── index.astro              # 首页文章列表
│   │   ├── blog/[slug].astro        # 文章详情
│   │   ├── blog/tag/[tag].astro     # 标签筛选
│   │   ├── about.astro              # 关于页
│   │   ├── rss.xml.ts               # RSS 订阅
│   │   └── 404.astro                # 自定义 404
│   ├── styles/
│   │   └── global.css               # 全局样式 + CSS 变量
│   └── utils/
│       ├── search.ts                # Pagefind 搜索封装
│       └── images.ts                # 图片工具
├── public/
│   └── images/                      # 静态图片资源
├── astro.config.ts
├── tailwind.config.ts
├── .github/
│   └── workflows/
│       └── deploy.yml               # Vercel 部署工作流
└── CLAUDE.md
```

---

## 4. 视觉设计

### 色彩方案

| Token | 亮色模式 | 暗色模式 |
|-------|---------|---------|
| 背景 | `#fafaf8` | `#111110` |
| 卡片表面 | `#ffffff` | `#1a1a19` |
| 正文 | `#2d2d2a` | `#e0e0dd` |
| 次要文字 | `#6b6b65` | `#99998f` |
| 强调色 | `#e87b35` | `#f0984a` |
| 强调色 hover | `#d0651f` | `#e87b35` |
| 代码块背景 | `#f4f4f2` | `#0d0d0c` |
| 边框 | `#e5e5df` | `#2a2a27` |

### 排版
- 正文字体: Inter + Noto Sans SC（fallback）
- 等宽字体: JetBrains Mono
- 文章栏最大宽度: `65ch`（约 650px）
- 大图可全宽溢出（突破 65ch 限制）

### 个性点缀
- 导航栏滚动时毛玻璃模糊 + 半透明背景
- 卡片 hover 上浮 + 阴影
- 标签切换过渡动画
- 暗色模式切换平滑渐变（CSS transition on `background-color`、`color`）
- 图片点击进入全屏 lightbox，支持键盘左右切换

---

## 5. 数据流

```
Markdown 文件 → Astro Content Collections (Zod 校验)
    → 静态 HTML 生成
    → Pagefind 生成搜索索引
    → Vercel 部署 + CDN
```

---

## 6. 页面路由

| 路由 | 功能 |
|------|------|
| `/` | 首页，文章卡片网格，分页 |
| `/blog/[slug]` | 文章详情页 |
| `/blog/tag/[tag]` | 标签筛选页 |
| `/about` | 关于页 |
| `/rss.xml` | RSS 订阅源 |
| `/404` | 自定义 404 页面 |

---

## 7. Markdown Frontmatter Schema

```ts
{
  title: string;          // 文章标题
  date: Date;             // 发布日期
  cover?: string;         // 封面图路径（可选）
  tags?: string[];        // 标签列表
  summary?: string;       // 摘要（缺省取正文前150字）
  draft?: boolean;        // 草稿（构建时忽略）
}
```

---

## 8. 错误处理 & 边界情况

- **404**: 自定义页面，含返回首页链接 + 搜索入口
- **构建校验**: frontmatter 缺失必填字段 → 构建报错中止
- **图片缺失**: 构建时报错，明确指出文件路径
- **搜索空结果**: 显示"未找到相关文章"
- **搜索词 < 2 字符**: 不触发搜索
- **响应式**: 移动端表格横向滚动，长代码自动换行，超大图限制高度

---

## 9. 测试策略

| 阶段 | 内容 | 方式 |
|------|------|------|
| CI 构建 | `astro build` 无错误 | GitHub Actions |
| 类型检查 | `astro check` 通过 | CI |
| 页面可用 | 首页、文章、标签、RSS 返回正确内容 | `astro dev` 手动验证 |

---

## 10. 部署流程

1. 本地 `git push` 到 GitHub `main` 分支
2. GitHub Actions 触发 Vercel 生产部署
3. PR 自动触发 Vercel 预览部署（Preview URL）
4. 合并 PR 后自动部署到生产环境
