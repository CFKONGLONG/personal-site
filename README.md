# 陈科宏 · 个人主页

沈阳理工大学计算机专业大一，浙江台州人。在学 C 语言、Python 和算法，喜欢写代码、旅行和打游戏。

纯静态站点——一个 `index.html`、一份 CSS、一个 JS，没有构建步骤，也没有外部依赖。改完直接 push，GitHub Pages 就会发布。

线上地址：<https://cfkonglong.github.io/>

## 目录结构

```
├─ index.html              页面内容（文案、技能、时间线、联系方式都在这里）
├─ 404.html                自定义 404
├─ robots.txt / sitemap.xml
├─ assets/
│  ├─ css/site.css         配色变量、版式、明暗主题、响应式
│  ├─ js/site.js           主题切换、滚动淡入、导航高亮、卡片光斑、复制联系方式
│  └─ img/                 favicon、Apple 图标、分享封面
├─ legacy/                 原仓库旧版站点的存档（本站不引用，可以删）
└─ README.md
```

## 页面结构

| 编号 | 板块 | 内容 |
| --- | --- | --- |
| — | 首屏 | 陈科宏 / 沈阳 · 计算机大一 / 三个数字（2008、2026、∞） |
| 01 | 关于 | 台州 → 沈阳，为什么开始写代码，现在的状态 + 资料卡 + 一句引文 |
| 02 | 在学什么 | 6 项能力（Python / C / 数据结构 / 前端 / Git / AI 工具），带自评进度条（纯萌新档位） + 「我的循环」 |
| 03 | 历程 | 2008 出生 → 2023 高中 → 2026 沈阳 → 现在 → 下一个 |
| 04 | 代码之外 | 去过的地方、在玩的游戏、折腾 AI 工具 |
| 05 | 联系 | 邮件、QQ、GitHub（一键复制） |

## 怎么改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 标题、简介、分享卡片 | `index.html` 顶部 `<head>` 里的 `<title>`、`description`、`og:*` |
| 首屏文字、三个数字 | `.hero` 区块 |
| 关于我、技术标签、右侧资料卡、引文 | `.about` / `.quote` 区块 |
| 技能和自评进度 | `.cards--skills` 里的 `card__pct`（数字）和 `--v:30%`（进度条宽度） |
| 时间线 | `.timeline` 里复制一整段 `<li class="timeline__item">` |
| 去过的地方 | `.places` 里的 `<li>` |
| 联系方式 | `.contact__cards` 里的 `data-copy` 和显示文字（两处都要改） |
| 配色、字体、间距 | `assets/css/site.css` 开头的 `:root`，主色是 `--seal` |
| 分享封面 | 替换 `assets/img/og-cover.jpg`（建议 1200×630） |

改文案时 `index.html` 里留着 `<!-- ... -->` 注释标出各板块的位置。

## 本地预览

不需要 Node，用 Python 起个静态服务器就行：

```bash
python -m http.server 8765
# 打开 http://127.0.0.1:8765/
```

也可以直接双击 `index.html`（`file://` 下一切正常，只有「复制」按钮在部分浏览器里需要 https 才生效，脚本已做降级）。

## 部署

要发布到 `https://cfkonglong.github.io/`，仓库名必须是 **`CFKONGLONG.github.io`**：

1. 把这个仓库的内容推到 `CFKONGLONG/CFKONGLONG.github.io` 的默认分支；
2. 仓库 → Settings → Pages → Source 选 *Deploy from a branch*，
   分支选默认分支，目录选 **/ (root)**；
3. 等一两分钟，访问 <https://cfkonglong.github.io/>。

> 如果发布到别的仓库（比如 `CFKONGLONG/personal-site`，网址会带子路径），
> 记得把 `index.html` 里的三处绝对地址改成新域名：
> `<link rel="canonical">`、`og:url`、`og:image` / `twitter:image`，
> 以及 `robots.txt`、`sitemap.xml` 里的域名。

## 站点细节

- **明暗两套主题**：首次访问跟随系统，手动切换后记在 `localStorage`。
- **动效克制**：滚动淡入用 `IntersectionObserver`，技能条进入视口才展开，卡片有跟随指针的柔光；
  开启「减少动态效果」时全部关闭。
- **无 JS 也不会空白**：淡入只在 `.js` 类存在时生效。
- **可访问性**：跳过链接、`aria` 状态、键盘焦点样式、语义化标签。
- **SEO**：OG / Twitter 卡片、`canonical`、JSON-LD `Person`、`sitemap.xml`、`robots.txt`。

## 关于 legacy/

`legacy/` 是从原仓库带过来的旧版站点（别人写的一个 Vue 单页应用）的存档，本站没有任何地方引用它。
想让仓库干净一点，直接删掉这个目录，并去掉 `robots.txt` 里的 `Disallow: /legacy/` 即可。
