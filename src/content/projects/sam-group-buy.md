---
title: "山姆代购与小区团购"
subtitle: "把选品、拼份和采购中的实际规则放进系统"
summary: "面向小区团购的轻量工具，连接商品选取、定价、顾客自选、按份拼单与订单汇总。"
category: "product"
status: "active"
origin: "业务工具"
featured: true
order: 3
topics: ["product-making"]
stack: ["React", "Node.js", "SQLite", "飞书开放平台"]
repository: "https://github.com/g-dxw/sam-group-buy"
cover: "/images/projects/sam-customer-products.webp"
focus: "让顾客选择与团长采购共享清楚的商品、价格和份数信息。"
updatedAt: "2026-10-15"
---

## 从哪里开始

小区团购看起来只是收集订单，真正做起来却有价格变化、整件采购、分装份数和顾客确认等细节。这个工具从山姆代购场景出发，把散落在聊天记录与表格里的信息组织成一条可查看的业务流程。

## 怎样组织这件事

团长先选品、核对价格与规则，再建立团购期次，通过链接或二维码让顾客自选。订单汇总后用于采购和分货。页面既要让顾客容易理解，也要让团长能看清每件商品的实际采购需求。

<figure>
  <img src="/images/projects/sam-admin-batches.webp" alt="山姆团购管理后台：按小区查看团购期次、分享收集链接和二维码、设置取货安排" width="1280" height="1360" loading="lazy" decoding="async" />
  <figcaption>团购期次管理 · 把商品、收集入口与取货安排放在同一期里。截图使用演示数据。</figcaption>
</figure>

## 实现中的选择

定价与按份拼单是核心：一份的售价、整件规格和采购数量需要分别表达，避免把“顾客买几份”误当作“采购几件”。商品和订单以本地 SQLite 为准，飞书承担可选的手动备份与导出，减少多处修改造成的歧义。

<figure>
  <img src="/images/projects/sam-admin-orders.webp" alt="山姆团购订单统计后台：费用汇总、采购数量及按商品整理的采购清单" width="1280" height="2310" loading="lazy" decoding="async" />
  <figcaption>订单统计与采购汇总 · 将顾客选择整理为团长可执行的采购清单。截图中的订单与金额均为演示数据。</figcaption>
</figure>

## 目前做到哪一步

当前已具备商品、期次、订单和按份拼单等流程。网页不在线收款，付款和采购仍需独立确认；它帮助整理经营信息，实际履约由团长完成。价格时效、删除恢复与备份也属于持续维护的内容。

## 继续了解

代码、使用流程及规则说明见 [sam-group-buy](https://github.com/g-dxw/sam-group-buy)，其中保留了定价、分装、飞书备份和部署维护的说明。
