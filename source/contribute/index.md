---
sidebar: false
comments: false
toc: false
donate: false
share: false
copyright: false
date: 2025-10-26 20:15:58
---

<div id="app-contribute" class="contribute-page"></div>

<script>
(function () {
  const backend_url = "https://contribute.qidian.space";

  // 多次 PJAX 进入同一页面时防止重复初始化
  function alreadyMounted(mountPoint) {
    return mountPoint && mountPoint.dataset.vjsMounted === "1";
  }

  function mountContributeApp() {
    const mountPoint = document.getElementById("app-contribute");
    if (!mountPoint || alreadyMounted(mountPoint)) return;

    // Shadow DOM
    const shadow = (mountPoint.shadowRoot) ? mountPoint.shadowRoot : mountPoint.attachShadow({ mode: "open" });
    mountPoint.dataset.vjsMounted = "1";
    mountPoint.setAttribute("data-has-shadow", "");

    // 清空之前的内容（防止 PJAX 残留）
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

    // 外部样式（作用于 shadow 内）
    const linkBootstrap = document.createElement("link");
    linkBootstrap.rel = "stylesheet";
    linkBootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";

    const linkToastUI = document.createElement("link");
    linkToastUI.rel = "stylesheet";
    linkToastUI.href = "https://uicdn.toast.com/editor/latest/toastui-editor.min.css";

    // 自定义样式
    const styleCustom = document.createElement("style");
    styleCustom.textContent = `
      .main-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      .guide, .card-section {
        padding: 15px;
        background: #fff;
        border-radius: 8px;
        border: 1px solid #ddd;
        margin-bottom: 20px;
        transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      .tag {
        display: inline-flex;
        align-items: center;
        margin: 3px;
        padding: 4px 8px;
        background: #51aded;
        color: #fff;
        border-radius: 5px;
        font-size: 0.9rem;
      }
      .tag .remove {
        margin-left: 6px;
        cursor: pointer;
        font-weight: bold;
        color: #fff;
        transition: color 0.2s ease;
      }
      .tag .remove:hover { color: #ffdddd; }

      .preview-img {
        max-width: 120px;
        margin: 5px;
        display: inline-block;
        text-align: center;
        background: #f8f9fa;
        padding: 5px;
        border-radius: 5px;
        transition: background 0.3s ease;
      }
      .preview-img img { max-width: 100%; border-radius: 4px; }
      .img-btns {
        display: flex; justify-content: space-between; margin-top: 5px;
      }
      .email-group { display: flex; gap: 5px; margin-bottom: 5px; }
      .email-group input { flex: 1; }
      .btn-sm { font-size: 0.8rem; padding: 0.25rem 0.5rem; }

      .custom-border { border: 1px solid #CECECE; border-radius: 5px; transition: border-color 0.3s ease; }
      .blue-border { border: 1px solid #0d6efd; border-radius: 5px; }
      .red-border { border: 1px solid #dc3545; border-radius: 5px; }

      :host([data-theme="dark"]) .guide,
      :host([data-theme="dark"]) .card-section {
        background: #1e1e28; border-color: #333; color: #e0e0e0;
      }
      :host([data-theme="dark"]) .tag { background: #2979ff; color: #fff; }
      :host([data-theme="dark"]) .tag .remove { color: #fff; }
      :host([data-theme="dark"]) .tag .remove:hover { color: #ff9999; }
      :host([data-theme="dark"]) .preview-img { background: #2a2a35; }
      :host([data-theme="dark"]) .custom-border { border-color: #444; }
      :host([data-theme="dark"]) .blue-border { border-color: #66aaff; }
      :host([data-theme="dark"]) .red-border { border-color: #ff6677; }
      :host([data-theme="dark"]) { background: #121212; color: #e0e0e0; }

      :host([data-theme="dark"]) .toastui-editor-md,
      :host([data-theme="dark"]) .toastui-editor-md-container,
      :host([data-theme="dark"]) .toastui-editor-md-preview,
      :host([data-theme="dark"]) .ProseMirror {
        background: #ffffff !important;
        color: #000000 !important;
      }

      .toast-info {
        position: fixed;
        right: 20px;
        bottom: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        z-index: 9999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }
      .toast-info.info { background: rgba(13,110,253,.85); }
      .toast-info.success { background: rgba(25,135,84,.9); }
      .toast-info.error { background: rgba(220,53,69,.9); }
      :host([data-theme="dark"]) .toast-info.info { background: rgba(13,110,253,.35); box-shadow: 0 4px 10px rgba(0,0,0,.6); }
      :host([data-theme="dark"]) .toast-info.success { background: rgba(25,135,84,.55); box-shadow: 0 4px 10px rgba(0,0,0,.6); }
      :host([data-theme="dark"]) .toast-info.error { background: rgba(220,53,69,.6); box-shadow: 0 4px 10px rgba(0,0,0,.6); }
    `;

    shadow.appendChild(linkBootstrap);
    shadow.appendChild(linkToastUI);
    shadow.appendChild(styleCustom);

    // 根容器
    const root = document.createElement("div");
    shadow.appendChild(root);

    // Toast 容器
    const toastBox = document.createElement("div");
    root.appendChild(toastBox);

    function showToast(msg, type) {
      toastBox.innerHTML = "";
      if (!msg) return;
      const t = document.createElement("div");
      t.className = "toast-info " + (type || "info");
      t.textContent = msg;
      toastBox.appendChild(t);
      setTimeout(() => { if (toastBox.contains(t)) toastBox.removeChild(t); }, 3000);
    }

    // ====== 状态 ======
    const state = {
      title: "",
      author: "",
      email: "",
      emailCode: "",
      tags: [],
      cover: null,     // { name, base64 }
      images: [],      // [{name, base64}, ...]
      editor: null
    };

    // ====== UI 结构 ======
    // 主布局
    const mainLayout = document.createElement("div");
    mainLayout.className = "main-layout";
    root.appendChild(mainLayout);

    // 左侧表单
    const left = document.createElement("div");
    left.className = "card-section";
    mainLayout.appendChild(left);

    // 标题
    const gTitle = document.createElement("div");
    gTitle.className = "mb-3";
    gTitle.innerHTML = `
      <label class="form-label">文章标题</label>
      <input type="text" class="form-control custom-border" />
    `;
    const titleInput = gTitle.querySelector("input");
    titleInput.addEventListener("input", (e) => state.title = e.target.value);
    left.appendChild(gTitle);

    // 作者
    const gAuthor = document.createElement("div");
    gAuthor.className = "mb-3";
    gAuthor.innerHTML = `
      <label class="form-label">作者名</label>
      <input type="text" class="form-control custom-border" />
    `;
    const authorInput = gAuthor.querySelector("input");
    authorInput.addEventListener("input", (e) => state.author = e.target.value);
    left.appendChild(gAuthor);

    // 邮箱 + 验证
    const gEmail = document.createElement("div");
    gEmail.className = "mb-3";
    gEmail.innerHTML = `
      <label class="form-label">作者邮箱</label>
      <div class="email-group">
        <input type="email" class="form-control custom-border" placeholder="邮箱" />
        <button class="btn btn-outline-primary btn-sm blue-border" type="button">发送验证码</button>
        <input type="text" class="form-control custom-border" placeholder="验证码" />
        <button class="btn btn-outline-primary btn-sm blue-border" type="button">验证并提交</button>
      </div>
    `;
    const [emailInput, btnSendCode, codeInput, btnSubmit] = gEmail.querySelectorAll("input,button");
    emailInput.addEventListener("input", (e) => state.email = e.target.value);
    codeInput.addEventListener("input", (e) => state.emailCode = e.target.value);
    left.appendChild(gEmail);

    // 标签
    const gTags = document.createElement("div");
    gTags.className = "mb-3";
    gTags.innerHTML = `
      <label class="form-label">标签</label>
      <input type="text" class="form-control custom-border" placeholder="输入后回车添加" />
      <div class="mt-2"></div>
    `;
    const tagInput = gTags.querySelector("input");
    const tagWrap = gTags.querySelector("div.mt-2");
    tagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const v = tagInput.value.trim();
        if (v && !state.tags.includes(v)) {
          state.tags.push(v);
          tagInput.value = "";
          renderTags();
        }
      }
    });
    left.appendChild(gTags);

    function renderTags() {
      tagWrap.innerHTML = "";
      state.tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag";
        const rm = document.createElement("span");
        rm.className = "remove";
        rm.textContent = "×";
        rm.addEventListener("click", () => {
          state.tags = state.tags.filter(x => x !== t);
          renderTags();
        });
        span.appendChild(document.createTextNode(t + " "));
        span.appendChild(rm);
        tagWrap.appendChild(span);
      });
    }

    // 封面
    const gCover = document.createElement("div");
    gCover.className = "mb-3";
    gCover.innerHTML = `
      <label class="form-label">封面图</label>
      <input type="file" class="form-control custom-border" accept="image/*" />
      <div class="mt-2" id="cover-preview"></div>
    `;
    const coverInput = gCover.querySelector('input[type="file"]');
    const coverPreview = gCover.querySelector("#cover-preview");
    left.appendChild(gCover);

    async function handleCoverChange(file) {
      if (!file) return;
      try {
        const options = {
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          initialQuality: 0.8,
          fileType: "image/webp"
        };
        const compressedFile = await imageCompression(file, options);
        const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
        const base64Data = base64.split(",")[1];
        state.cover = { name: "cover.webp", base64: base64Data };
        renderCover();
      } catch (err) {
        console.error(err);
        showToast("图片压缩或处理失败，请重试。", "error");
      }
    }

    function renderCover() {
      coverPreview.innerHTML = "";
      if (!state.cover) return;
      const box = document.createElement("div");
      box.className = "preview-img mt-2";
      const img = document.createElement("img");
      img.src = `data:image/webp;base64,${state.cover.base64}`;
      const br = document.createElement("br");
      box.appendChild(img);
      box.appendChild(br);
      box.appendChild(document.createTextNode("cover.webp"));
      coverPreview.appendChild(box);
    }

    coverInput.addEventListener("change", (e) => handleCoverChange(e.target.files[0]));

    // 插图
    const gImages = document.createElement("div");
    gImages.className = "mb-3";
    gImages.innerHTML = `
      <label class="form-label">文章插图</label>
      <input type="file" class="form-control custom-border" accept="image/*" multiple />
      <div class="mt-2 d-flex flex-wrap" id="images-wrap"></div>
    `;
    const imgsInput = gImages.querySelector('input[type="file"]');
    const imagesWrap = gImages.querySelector("#images-wrap");
    left.appendChild(gImages);

    async function handleImagesChange(files) {
      if (!files || !files.length) return;
    
      try {
        const startIndex = state.images.length + 1;
    
        const processed = await Promise.all(
          Array.from(files).map(async (file, i) => {
            const options = {
              maxWidthOrHeight: 1280,
              useWebWorker: true,
              initialQuality: 0.8,
              fileType: "image/webp",
            };
            const compressedFile = await imageCompression(file, options);
            const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
            const base64Data = base64.split(",")[1];
    
            // 用序号命名：1.webp, 2.webp, ...
            const fileName = `${startIndex + i}.webp`;
    
            return { name: fileName, base64: base64Data };
          })
        );
    
        // 合并并按数字排序，保证顺序正确
        state.images = state.images
          .concat(processed)
          .sort((a, b) => parseInt(a.name) - parseInt(b.name));
    
        renderImages();
      } catch (err) {
        console.error(err);
        showToast("图片压缩或处理失败，请重试。", "error");
      }
    }

    function renderImages() {
      imagesWrap.innerHTML = "";
      state.images.forEach((imgObj) => {
        const box = document.createElement("div");
        box.className = "preview-img";
        const img = document.createElement("img");
        img.src = `data:image/webp;base64,${imgObj.base64}`;
        const nameDiv = document.createElement("div");
        nameDiv.textContent = imgObj.name;

        const btns = document.createElement("div");
        btns.className = "img-btns";

        const btnInsert = document.createElement("button");
        btnInsert.className = "btn btn-outline-primary btn-sm blue-border";
        btnInsert.textContent = "插入";
        btnInsert.addEventListener("click", () => insertImage(imgObj.name));

        const btnDel = document.createElement("button");
        btnDel.className = "btn btn-outline-danger btn-sm red-border";
        btnDel.textContent = "删除";
        btnDel.addEventListener("click", () => {
          state.images = state.images.filter(x => x.name !== imgObj.name);
          renderImages();
        });

        btns.appendChild(btnInsert);
        btns.appendChild(btnDel);

        box.appendChild(img);
        box.appendChild(nameDiv);
        box.appendChild(btns);

        imagesWrap.appendChild(box);
      });
    }

    imgsInput.addEventListener("change", (e) => handleImagesChange(e.target.files));

    // 右侧指南
    const guide = document.createElement("div");
    guide.className = "guide";
    guide.innerHTML = `
      <h5>投稿指南</h5>
        <div>
            <strong>一、投稿前请确认</strong>
            <ul>
                <li>请务必在填写完所有内容后，再点击<strong>“发送验证码”</strong>与<strong>“验证并提交”</strong>提交投稿。</li>
                <li>文章标题将用作系统内的文件夹名称，例如：<code>./posts/我的文章</code></li>
            </ul>
        </div>
        <div>
            <strong>二、图片处理与插入</strong>
            <ul>
                <li>所有上传图片将自动转换为 <code>WebP</code> 格式。</li>
                <li>推荐：上传后点击“插入”按钮将图片添加到编辑器（预览区不显示属正常，不影响发布）。</li>
                <li>可选：直接复制粘贴插入图片（Base64 格式，可预览，但性能较差，不推荐）。</li>
            </ul>
        </div>
        <div>
            <strong>三、投稿与后续</strong>
            <ul>
                <li>点击“投稿”后，系统需要约 <strong>20秒</strong> 进行处理，请耐心等待，切勿重复点击，以免造成重复提交。</li>
                <li>投稿过程中如遇任何问题，请联系：<code>tsblydyzbjb@qidian.space</code></li>
            </ul>
        </div>
    `;
    mainLayout.appendChild(guide);

    // Editor 容器（放在主布局下方，和你原来一致）
    const editorDiv = document.createElement("div");
    editorDiv.id = "editor";
    root.appendChild(editorDiv);

    // ====== 交互函数 ======
    async function sendEmailCode() {
      if (!state.email) {
        showToast("请先填写邮箱！", "error");
        return;
      }
    
      showToast("正在发送验证码...", "info");
    
      try {
        const res = await fetch(`${backend_url}/auth/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: state.email })
        });
    
        if (res.ok) {
          showToast("验证码已发送！", "success");
        } else {
          const text = await res.text();
          showToast("发送失败: " + text, "error");
        }
      } catch (err) {
        console.error(err);
        showToast("网络请求失败，请检查连接或稍后重试。", "error");
      }
    
      // 可选：3秒后自动清理提示
      setTimeout(() => showToast("", "info"), 3000);
    }

    // 可选：把标题做个安全处理，避免出现 / \ : * ? " < > | 等非法字符
    function sanitizeTitle(str) {
      return (str || "未命名文章")
        .trim()
        .replace(/[\\\/:*?"<>|]+/g, "")   // 去掉非法字符
        .replace(/\s+/g, "_")             // 空格转下划线
        .slice(0, 60);                     // 防止过长
    }
    
    function insertImage(name) {
      if (!state.editor) {
        showToast("编辑器尚未初始化", "error");
        return;
      }
      const safeTitle = sanitizeTitle(state.title);
      const path = `../photos/${safeTitle}/${name}`;
      state.editor.insertText(`![请输入图注](${path})\n`);
      showToast("已插入到正文", "success");
    }

    async function handleSubmit() {
      if (!state.title || !state.author || !state.email || !state.emailCode) {
        showToast("请填写完整信息！", "error");
        return;
      }
      const content = state.editor ? state.editor.getMarkdown() : "";
      if (!content) {
        showToast("正文不能为空！", "error");
        return;
      }
    
      const payload = {
        title: state.title,
        author: state.author,
        email: state.email,
        email_code: state.emailCode,
        tags: state.tags,
        cover: state.cover,
        images: state.images,
        content,
      };
    
      try {
        showToast("正在提交，请稍候...", "info");
        const res = await fetch(`${backend_url}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        if (res.ok) {
          showToast("投稿成功！", "success");
          // 重置
          state.title = state.author = state.email = state.emailCode = "";
          state.tags = [];
          state.cover = null;
          state.images = [];
          state.editor && state.editor.setMarkdown("# 请输入正文");
          titleInput.value = "";
          authorInput.value = "";
          emailInput.value = "";
          codeInput.value = "";
          renderTags();
          renderCover();
          renderImages();
        } else {
          const text = await res.text();
          showToast("投稿失败: " + text, "error");
        }
      } catch (err) {
        console.error(err);
        showToast("网络请求失败，请检查连接或稍后重试。", "error");
      }
    }

    // 绑定按钮事件
    btnSendCode.addEventListener("click", sendEmailCode);
    btnSubmit.addEventListener("click", handleSubmit);

    // ====== 输入交互高亮（与原逻辑一致） ======
    shadow.addEventListener("change", function (e) {
      const target = e.target;
      if (target.classList && target.classList.contains("custom-border")) {
        target.classList.add("blue-border");
      }
      if (target.matches && target.matches('input[type="file"]')) {
        target.classList.add("blue-border");
        setTimeout(() => target.classList.remove("blue-border"), 1500);
      }
    }, true);

    // ====== Editor 初始化 ======
    state.editor = new toastui.Editor({
      el: editorDiv,
      height: "500px",
      initialEditType: "markdown",
      previewStyle: "vertical",
      initialValue: "# 请输入正文",
      theme: "dark"
    });

    // 主题联动（跟随 <html data-theme="...">）
    function applyThemeToHostAndEditor() {
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      mountPoint.setAttribute("data-theme", theme);
      // 细化 TUI 内部样式（与原逻辑一致）
      const toolbar = shadow.querySelector(".toastui-editor-defaultUI-toolbar");
      const markdown = shadow.querySelector(".toastui-editor-md-container");
      const preview = shadow.querySelector(".toastui-editor-panes .toastui-editor-pane:nth-child(2)");
      const previewTabs = shadow.querySelectorAll(".toastui-editor-md-split-container .toastui-editor-tabs button");

      if (!toolbar || !markdown || !preview) return;

      if (theme === "dark") {
        toolbar.style.backgroundColor = "#343a40";
        toolbar.style.borderColor = "#454d55";
        preview.style.backgroundColor = "#1e1e28";
        preview.style.color = "#f8f9fa";
        preview.style.borderColor = "#444";
        markdown.style.backgroundColor = "#1e1e28";
        markdown.style.color = "#f8f9fa";
        markdown.style.borderColor = "#444";
        previewTabs.forEach(tab => {
          tab.style.backgroundColor = "#2c2c3a";
          tab.style.color = "#f8f9fa";
          tab.style.borderColor = "#444";
        });
      } else {
        toolbar.style.backgroundColor = "#f8f9fa";
        toolbar.style.borderColor = "#dee2e6";
        preview.style.backgroundColor = "#fff";
        preview.style.color = "#212529";
        preview.style.borderColor = "#ced4da";
        markdown.style.backgroundColor = "#fff";
        markdown.style.color = "#212529";
        markdown.style.borderColor = "#ced4da";
        previewTabs.forEach(tab => {
          tab.style.backgroundColor = "#fff";
          tab.style.color = "#212529";
          tab.style.borderColor = "#ced4da";
        });
      }
    }
    applyThemeToHostAndEditor();

    const themeObserver = new MutationObserver(applyThemeToHostAndEditor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ====== 结束：对外暴露 mount 状态清理（可选） ======
    // 如需在 PJAX 离开时清理，可监听 pjax:send 等事件，在其中执行 themeObserver.disconnect()
  } // mountContributeApp

  document.addEventListener("DOMContentLoaded", mountContributeApp);
  document.addEventListener("pjax:complete", mountContributeApp);
  // 立即尝试一次（直达渲染）
  mountContributeApp();
})();
</script>