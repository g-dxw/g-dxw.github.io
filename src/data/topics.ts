export interface Topic {
  id: string;
  title: string;
  kicker: string;
  description: string;
  intro: string;
  postIds: string[];
  projectIds: string[];
}

export const topics: Topic[] = [
  {
    id: 'ai-practice',
    title: '与 AI 一起做事',
    kicker: 'AI & PRACTICE',
    description: '从理解 Agent，到协作、判断和验证，探索 AI 怎样进入真实的工作。',
    intro: '这里从 Agent 的基础概念开始，逐步走向工具、记忆与协作方式。可以先读入门系列，再看具体项目：把概念放进实际流程，才会遇到权限、状态、失败与结果验证这些更具体的问题。',
    postIds: ['2026-07-22-what-is-ai-agent', '2026-07-22-how-agent-thinks', '2026-07-22-agent-tools-and-memory', '2026-07-22-agent-advanced-and-practice', '2026-07-23-ai-describe-vs-prescribe', '2026-07-23-ai-thinking-framework'],
    projectIds: ['ebao-studio', 'xianyu-auto-reply', 'lingweave'],
  },
  {
    id: 'product-making',
    title: '把想法做成东西',
    kicker: 'IDEAS INTO THINGS',
    description: '从一个具体的问题出发，记录产品、工具和业务规则怎样逐渐成形。',
    intro: '一张创作画布、一次团购、一套桌面工作台，出发点各不相同。放在一起看，可以观察需求怎样变成流程，流程怎样变成产品，以及那些需要在实现过程中不断调整的选择。',
    postIds: ['2026-07-16-lingweave', '2026-06-05-neighbor', '2026-06-04-my-vibecoding'],
    projectIds: ['sam-group-buy', 'ebao-studio', 'xianyu-auto-reply', 'lingweave', 'caredock'],
  },
  {
    id: 'outdoor-life',
    title: '走到屏幕之外',
    kicker: 'OUTSIDE THE SCREEN',
    description: '徒步、摩旅与路线，也让生活中的兴趣长出新的工具和实验。',
    intro: '走过的路线、沿途的照片和旅行的记忆，也可以成为做东西的起点。这里把户外记录与轨迹工具放在一起：既保留走出去的感受，也尝试用软件整理和表达这些经历。',
    postIds: ['2026-07-03-why-go-to-mountains'],
    projectIds: ['2bulu-track-exporter', 'trail-image-generation-skill', 'dsh-plugin-track'],
  },
];

export const getTopic = (id: string) => topics.find((topic) => topic.id === id);
