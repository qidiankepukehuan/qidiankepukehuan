(() => {
    // 请设置为您在配置中配置的默认封面路径
    const defaultCoverSrc = "/qidiankepukehuan/images/default.webp";
    // 请设置为您的随机文件基础路径（{no} 替代编号，从 1 开始）
    const randomImageSrcTemplate = "/qidiankepukehuan/photos/random-cover/random_{no}.webp";
    // 请设置为您的随机图片文件数量
    const randomImageCount = 5;

    // 初始化暂存目录，使用减员随机来减少连续重复可能导致的糟糕体验
    const usedImages = new Array(randomImageCount);

    // 初始化随机函数
    const generateNewCoverID = () => {
        let remailFailCounts = 2; // 设置最大随机失败介入次数
        let imageNo;
        while (remailFailCounts > 0) {
            // 随机挑选一个
            imageNo = Math.floor(Math.random() * randomImageCount);
            if (!usedImages[imageNo]) {
                // 有效
                break;
            } else {
                // 无效，重试
                remailFailCounts--;
            }
        }

        if (remailFailCounts <= 0) {
            // 随机失败了，寻找最近的未使用元素
            imageNo = -1;
            for (let i = 0; i < randomImageCount; i++) {
                if (!usedImages[i]) {
                    // 找到了
                    imageNo = i;
                    break;
                }
            }
            if (imageNo === -1) {
                // 全都被使用过了，清空重置
                for (let i = 0; i < randomImageCount; i++) {
                    usedImages[i] = false;
                }
                // 随机挑选一个
                imageNo = Math.floor(Math.random() * randomImageCount);
            }
        }

        // 标记为已经使用过的
        usedImages[imageNo] = true;

        // 返回 +1 来从 1 开始
        return imageNo + 1;
    }

    // 替换所有使用默认图片的元素
    const randAll = () => {
        const allDefaultImageEls = document.querySelectorAll(`img.kratos-entry-thumb-img[src='${defaultCoverSrc}']`);
        for (const el of allDefaultImageEls) {
            el.setAttribute('src', randomImageSrcTemplate.replace("{no}", generateNewCoverID().toString()));
        }
    }

    // 调用一次
    randAll();
    // 在 PJAX 之后再调用一次
    window.addEventListener('pjax:complete', randAll);
})();
