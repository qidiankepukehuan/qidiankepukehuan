---
sidebar: false
comments: false
toc: false
donate: false
share: false
copyright: false
date: 2025-10-26 20:15:58
---

<div id="app-open-source" class="open-source-page">

<script>
(function () {
  const backend_url = "https://contribute.qidian.space";

  // 防止 PJAX 来回进入时重复挂载
  function alreadyMounted(mountPoint) {
    return mountPoint && mountPoint.dataset.vjsMounted === "1";
  }

  function mountOpenSourceApp() {
    const host = document.getElementById("app-open-source");
    if (!host || alreadyMounted(host)) return;

    const shadow = host.attachShadow({ mode: "open" });
    host.dataset.vjsMounted = "1";
    host.setAttribute("data-has-shadow", "");

    // 清空 Shadow 根（谨慎处理 PJAX 残留）
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

    // 样式：Bootstrap + 自定义
    const linkBootstrap = document.createElement("link");
    linkBootstrap.rel = "stylesheet";
    linkBootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";

    const styleCustom = document.createElement("style");
    styleCustom.textContent = `
      .main-layout-open-source {
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
      .email-group { display: flex; gap: 5px; margin-bottom: 5px; }
      .email-group input { flex: 1; }
      .btn-sm { font-size: 0.8rem; padding: 0.25rem 0.5rem; }
      .custom-border { border: 1px solid #CECECE; border-radius: 5px; transition: border-color 0.3s ease; }
      .blue-border { border: 1px solid #0d6efd; border-radius: 5px; }
      .red-border { border: 1px solid #dc3545; border-radius: 5px; }

      /* 深色主题适配（跟随 <html data-theme> 自动联动） */
      :host([data-theme="dark"]) .guide,
      :host([data-theme="dark"]) .card-section {
        background: #1e1e28; border-color: #333; color: #e0e0e0;
      }
      :host([data-theme="dark"]) .custom-border { border-color: #444; }
      :host([data-theme="dark"]) .blue-border { border-color: #66aaff; }
      :host([data-theme="dark"]) .red-border { border-color: #ff6677; }
      :host([data-theme="dark"]) { background: #121212; color: #e0e0e0; }

      /* 右下角 Toast */
      .toast-info {
        position: fixed; right: 20px; bottom: 20px;
        padding: 10px 20px; border-radius: 5px; color: #fff;
        z-index: 9999; max-width: 360px; text-align: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: opacity 0.3s ease;
      }
      .toast-info.info { background: rgba(13,110,253,.85); }
      .toast-info.success { background: rgba(25,135,84,.9); }
      .toast-info.error { background: rgba(220,53,69,.9); }
      :host([data-theme="dark"]) .toast-info.info { background: rgba(13,110,253,.35); box-shadow: 0 4px 10px rgba(0,0,0,.6); }
      :host([data-theme="dark"]) .toast-info.success { background: rgba(25,135,84,.55); box-shadow: 0 4px 10px rgba(0,0,0,.6); }
      :host([data-theme="dark"]) .toast-info.error { background: rgba(220,53,69,.6); box-shadow: 0 4px 10px rgba(0,0,0,.6); }
    `;

    shadow.append(linkBootstrap, styleCustom);

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

    // 状态
    const state = {
      name: "",
      email: "",
      emailCode: "",
      fileList: [],
      selectedFile: ""
    };

    // 布局
    const layout = document.createElement("div");
    layout.className = "main-layout-open-source";
    root.appendChild(layout);

    // 左侧卡片（表单）
    const left = document.createElement("div");
    left.className = "card-section";
    left.innerHTML = `
      <div class="mb-3">
        <label class="form-label">申请人姓名</label>
        <input type="text" class="form-control custom-border" />
      </div>

      <div class="mb-3">
        <label class="form-label">选择文件</label>
        <select class="form-select custom-border">
          <option value="">请选择要申请的文件</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">接收邮箱</label>
        <div class="email-group">
          <input type="email" class="form-control custom-border" placeholder="邮箱" />
          <button class="btn btn-outline-primary btn-sm blue-border" type="button">发送验证码</button>
          <input type="text" class="form-control custom-border" placeholder="验证码" />
          <button class="btn btn-outline-primary btn-sm blue-border" type="button">验证并发送到邮箱</button>
        </div>
      </div>
    `;
    layout.appendChild(left);

    const nameInput = left.querySelector('input[type="text"]');
    const selectFile = left.querySelector('select');
    const emailInput = left.querySelector('input[type="email"]');
    const codeInput = left.querySelectorAll('input[type="text"]')[1]; // 第二个 text 输入是验证码
    const [btnSendCode, btnSubmit] = left.querySelectorAll('button');

    nameInput.addEventListener("input", e => state.name = e.target.value);
    selectFile.addEventListener("change", e => state.selectedFile = e.target.value);
    emailInput.addEventListener("input", e => state.email = e.target.value);
    codeInput.addEventListener("input", e => state.emailCode = e.target.value);

    // 输入反馈（与前一个页面一致）
    shadow.addEventListener("change", function (e) {
      const target = e.target;
      if (target.classList && target.classList.contains("custom-border")) {
        target.classList.add("blue-border");
      }
    }, true);

    // 右侧指南
    const guide = document.createElement("div");
    guide.className = "guide";
    guide.innerHTML = `
      <h5>文件获取指南</h5>

      <div>
        <strong>一、申请前请确认</strong>
        <ul>
          <li>请完整填写<strong>姓名</strong>与<strong>邮箱地址</strong>，并选择所需文件。</li>
          <li>确保邮箱地址有效，否则可能无法接收验证码及文件。</li>
        </ul>
      </div>

      <div>
        <strong>二、申请步骤</strong>
        <ul>
          <li>点击<strong>“发送验证码”</strong>后，系统将向您的邮箱发送一封验证邮件。</li>
          <li>前往邮箱查收验证码，并填写至“验证码”输入框中。</li>
          <li>点击<strong>“验证并发送到邮箱”</strong>，系统将在验证成功后将文件发送至您的邮箱。</li>
        </ul>
      </div>

      <div>
        <strong>三、注意事项</strong>
        <ul>
          <li>若未收到验证码，请检查垃圾邮件文件夹或稍后重试。</li>
          <li>系统处理可能需要数秒，请耐心等待，切勿重复操作。</li>
          <li>如遇问题，请联系：<code>tsblydyzbjb@qidian.space</code></li>
        </ul>
      </div>
    `;
    layout.appendChild(guide);

    // ====== 数据交互 ======
    async function fetchFiles() {
      try {
        const res = await fetch(`${backend_url}/share/list_file`);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data && (data.code === 200) && Array.isArray(data.data)) {
          state.fileList = data.data;
          // 填充下拉
          selectFile.innerHTML = `<option value="">请选择要申请的文件</option>`;
          state.fileList.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f;
            opt.textContent = f;
            selectFile.appendChild(opt);
          });
        } else {
          throw new Error((data && data.message) || "获取列表失败");
        }
      } catch (e) {
        console.error(e);
        showToast("无法获取文件列表", "error");
      }
    }

    async function sendEmailCode() {
      if (!state.email) {
        showToast("请先填写邮箱", "error");
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
      } catch (e) {
        showToast("网络错误，请稍后重试", "error");
      }
    }

    async function handleDownload() {
      if (!state.name || !state.email || !state.emailCode || !state.selectedFile) {
        showToast("请完整填写信息", "error");
        return;
      }

      showToast("正在验证...", "info");
      try {
        const res = await fetch(`${backend_url}/share/get_file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicant: state.name,
            apply_for: state.selectedFile,
            email: state.email,
            email_code: state.emailCode
          })
        });

        const contentType = res.headers.get("content-type") || "";
        let payload = null;
        if (contentType.includes("application/json")) {
          payload = await res.json();
        } else {
          const text = await res.text();
          payload = { code: res.ok ? 200 : res.status, message: text };
        }

        if (res.ok && ((payload && payload.code === 200) || payload?.success === true)) {
          showToast("验证成功，下载链接已发送至您的邮箱（24小时内有效）", "success");
        } else {
          const msg = (payload && payload.message) || `请求失败（HTTP ${res.status}）`;
          showToast("验证失败: " + msg, "error");
        }
      } catch (e) {
        showToast("网络请求失败：" + (e?.message || e), "error");
      }
    }

    // 事件绑定
    btnSendCode.addEventListener("click", sendEmailCode);
    btnSubmit.addEventListener("click", handleDownload);

    // 拉取文件列表
    fetchFiles();

    // 主题联动（监听 <html data-theme>）
    function syncThemeToHost() {
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      host.setAttribute("data-theme", theme);
    }
    const themeObserver = new MutationObserver(syncThemeToHost);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    syncThemeToHost();
  }

  document.addEventListener("DOMContentLoaded", mountOpenSourceApp);
  window.addEventListener("pjax:complete", mountOpenSourceApp);
  // 直达挂载一次
  mountOpenSourceApp();
})();
</script>
