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

</div>

<style>
.friend-links-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
.link-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.link-item:hover {
  background: rgba(255,255,255,1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.link-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}
.link-info {
  flex: 1;
}
.link-name {
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
}
.link-descr {
  color: #666;
  font-size: 0.9em;
  margin-top: 2px;
}
</style>
