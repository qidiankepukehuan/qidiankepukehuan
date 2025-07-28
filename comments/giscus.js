(() => {
    const loadComments = async () => {
        const giscusContainer = document.getElementById('giscus_container');
        if (!giscusContainer) return;

        // 清空 iframe
        while (giscusContainer.firstChild) {
            giscusContainer.removeChild(giscusContainer.firstChild);
        }

        // 重建 script - 使用您提供的参数配置
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'qidiankepukehuan/qidiankepukehuan');
        script.setAttribute('data-repo-id', 'R_kgDOPQ3hgw');
        script.setAttribute('data-category', 'Announcements');
        script.setAttribute('data-category-id', 'DIC_kwDOPQ3hg84CtfOM');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'zh-CN');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('async', '');

        giscusContainer.appendChild(script);
    };

    window.addEventListener("message", function giscusMetadataListener(event) {
        if (event.origin !== "https://giscus.app") return;
        const data = event.data.giscus;
        console.log(data); // 💬 如果要知道giscus有提供哪些資料可用，可用這段搭配瀏覽器主控台測試
        if (data?.giscus?.discussion?.totalCommentCount !== undefined) {
            // 若有留言數據
            const comment = data.giscus.discussion.totalCommentCount;
            const reply_count = data.giscus.discussion.totalReplyCount;
            const count = comment + reply_count;
            const countElem = document.getElementById("giscus_count");
            if (countElem) countElem.textContent = count;
        } else if (data?.giscus?.error === "Discussion not found") {
            // 討論串不存在，視同留言數0
            const countElem = document.getElementById("giscus_count");
            if (countElem) countElem.textContent = "0";
        }
    });

    // 载入＆pjax 重新挂载
    window.loadComments = loadComments;
    // 添加初始加载和pjax事件监听
    document.addEventListener('DOMContentLoaded', loadComments);
    window.addEventListener('pjax:success', loadComments);
})();