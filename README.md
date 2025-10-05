# 奇点科普科幻协会博客网站 ✨

> **“让科学插上想象的翅膀。”**  
> —— 欢迎来到奇点科普科幻协会官方博客，在这里我们会持续分享**科普资讯、科幻小说、活动记录与会员创作**。

---

## 🚀 项目速览
- **框架：** [Hexo](https://hexo.io) – 快速、简洁且高效的静态博客框架  
- **主题：** [kratos-rebirth](https://github.com/Candinya/kratos-rebirth) – 轻量、响应式、深色/浅色自动切换  
- **部署：** GitHub Pages + GitHub Actions 全自动发布  
- **域名：** qidian.space

---

## 📂目录结构
    ├── _config.yml          # Hexo 主配置
    ├── _config.kratos-rebirth.yml   # 主题配置
    ├── source/
        ├──── _post/      # 文章与封面图
        └──── photos/     # 文章配图
    ├── scaffolds/           # 文章模板
    ├── themes/kratos-rebirth # 主题文件（git submodule）
    └── .github/workflows/   # GitHub Actions 自动部署

## 🤝 贡献指南
我们欢迎所有同学一起维护这个博客！
- **发现错别字 / 死链** → 直接提 Issue
- **想发表文章** → Fork→ 新建分支 → 提 PR
- **想改进功能** → 参考 https://github.com/Candinya/Kratos-Rebirth

## 🏗️ 本地开发
我们建议你使用 VSCode 编辑器
<br>
https://code.visualstudio.com/
1. 克隆仓库
   ```bash
   git clone https://github.com/qidiankepukehuan/qidiankepukehuan.git
   cd qidiankepukehuan
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动本地预览
   ```bash
   hexo clean && Hexo g  #清理，生成静态文件
   hexo server  #浏览器访问 http://localhost:4000
   ```
## ✍️ 写作 & 发布
1. 新建文章
   <br>
   找到 /source/_posts/ 目录并进入
2. 在 _posts/ 目录下新建 文章标题.md 文件
3. 编辑 .md 头信息
   你必须保证你的 .md 文件开头看起来像这样：
   ```markdown
   ---
    title: 《星际拓荒》指北——欢迎来到「拓荒」知识之塔
    author: 十口
    date: 2025-05-01 00:00:00
    categories: 
    - 引力波
    tags:
    - 社论
    - 游戏评测
    cover: cover.jpg    # 封面图存放至文章同名文件夹下，并与文章置于同一目录下
   ---

   以下接正文（使用 markdown 格式书写）

   ......
   ```
4. 本地预览无误后即可上传发布
<br> 如果你不会 git，那么我们建议你花十分钟去了解一下
<br> commit 信息格式为 "YYYY-MM-DD HH-MM-SS Upload posts..."

## 👀 联系我们
- 协会邮箱： tsblydyzbjb@163.com
- QQ群：292437202
- <img width="300" height="300" alt="temp_qrcode_share_292437202" src="https://github.com/user-attachments/assets/ffc50f47-4ea8-4bb3-a6e6-a5a84d8cedd5" />
      
<br> 让每一次想象，都有科学的注脚。


## © 2025 奇点科普科幻协会
本网站所有内容著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。本站原创内容采用 https://creativecommons.org/licenses/by-nc-sa/4.0/ 协议，转载请注明出处并禁止商用。
<br>
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
  <img alt="知识共享许可协议" src="https://licensebuttons.net/l/by-nc-sa/4.0/80x15.png" />
</a>
