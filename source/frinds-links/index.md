---
title: 友情链接
---

<div class="friend-links-container">

  <a class="link-item" href="https://www.csfdb.cn/" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/中文科幻数据库.png" alt="">
    <div class="link-info">
      <div class="link-name">中文科幻数据库</div>
      <div class="link-descr">我们见证，我们记录，我们讲述</div>
    </div>
  </a>

  <a class="link-item" href="https://www.0gsf.com/" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/零重力科幻.png" alt="">
    <div class="link-info">
      <div class="link-name">零重力科幻</div>
      <div class="link-descr">科幻迷的聚集地，创作者的新手村！</div>
    </div>
  </a>

  <a class="link-item" href="https://gpabooks.github.io" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/上海交大.png" alt="">
    <div class="link-info">
      <div class="link-name">上海交大会刊GPA</div>
      <div class="link-descr">我来，我看，我叙事！</div>
    </div>
  </a>

  <a class="link-item" href="https://hubingsf.cn/" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/合工大.png" alt="">
    <div class="link-info">
      <div class="link-name">斛兵群星科幻协会</div>
      <div class="link-descr">天马行空的幻想咖啡厅！</div>
    </div>
  </a>

  <a class="link-item" href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzMDgyMzg2NA==&scene=124#wechat_redirect" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/42号邮局.png" alt="">
    <div class="link-info">
      <div class="link-name">42号邮局</div>
      <div class="link-descr">为你无处投递的科幻梦找一个归宿</div>
    </div>
  </a>

  <a class="link-item" href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzMDgyMzg2NA==&scene=124#wechat_redirect" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/川TUO.png" alt="">
    <div class="link-info">
      <div class="link-name">川TUO</div>
      <div class="link-descr">四川给你一坨子！</div>
    </div>
  </a>

  <a class="link-item" href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzMDgyMzg2NA==&scene=124#wechat_redirect" target="_blank">
    <img class="link-avatar" src="../photos/friend-links/河流公众号.png" alt="">
    <div class="link-info">
      <div class="link-name">宇宙尽头和牛馆</div>
      <div class="link-descr">河流个人微信公众号</div>
    </div>
  </a>

</div>

<style>
    /* 基础样式 */
    .friend-links-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .link-item {
        min-width: 0;  
        display: flex;
        align-items: center;
        padding: 15px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.05);
        gap: 10px;
    }
    
    .link-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 1);
    }
    
    .link-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 0;
    }
    
    .link-info {
        min-width: 0;
        flex: 1;
        overflow-wrap: anywhere;
    }
    
    .link-name {
        font-weight: 600;
        font-size: 1.25rem;
        color: #333;
        margin-bottom: 4px;
    }
    
    .link-descr {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.4;
    }
    
    /* 夜间模式样式 */
    html[data-theme="dark"] .link-item {
        background: rgba(30, 30, 40, 0.85);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    html[data-theme="dark"] .link-item:hover {
        background: rgba(40, 40, 50, 0.95);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }
    
    html[data-theme="dark"] .link-name {
        color: #f0f0f0;
    }
    
    html[data-theme="dark"] .link-descr {
        color: #aaa;
    }
    
    .theme-toggle i {
        font-size: 24px;
        color: #333;
    }
    
    html[data-theme="dark"] .theme-toggle i {
        color: #f0f0f0;
    }
    
    /* 页面背景 */
    body {
        background: #f8f9fa;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        transition: background 0.3s ease;
    }
    
    html[data-theme="dark"] body {
        background: #121212;
    }
</style>
