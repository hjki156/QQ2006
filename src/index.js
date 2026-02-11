const playAudio = url => new Audio(url).play().catch(e => console.error('播放失败:', e));

const simulageMsgs = [
    '时光匆匆，那些篇章再也续不上',
    '好久不见，你还好吗？',
    '回不去的是青春，等不到的是旧人',
    '欢迎回到 2006 年',
    '你好，我是メ乖乖女ソ，很高兴认识你 :)',
    'Vae 的新歌《玫瑰花的葬礼》你听了吗',
    '哈哈哈，真有意思',
    '你有黄钻吗？帮我装修一下空间吧^_^',
    "我也这么觉得",
    "真的吗？",
];

// 添加消息到聊天窗口
function addChatMessage(text, isUser = false) {
    const chatList = document.getElementById('chat-list');
    if (!chatList) return;

    const li = document.createElement('li');
    li.className = isUser ? 'my' : '';

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    li.innerHTML = `
        <p>${isUser ? '痴情梦丶' : 'メ乖乖女ソ'}<span>${timeStr}</span></p>
        <p>${text}</p>
    `;

    chatList.appendChild(li);
    chatList.scrollTop = chatList.scrollHeight;

    // 播放消息音效
    if (!isUser) {
        playAudio('sound/msg.mp3');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btn-send-msg').onclick = () => {
        const input = document.getElementById('chat-input');
        const message = input.value;
        if (message.trim() === '') return;

        addChatMessage(message, true);
        input.value = '';

        // 模拟回复消息
        setTimeout(() => {
            addChatMessage(simulageMsgs[Math.floor(Math.random() * simulageMsgs.length)], false);
        }, Math.floor(Math.random() * 1500 + 500));
    };

    document.getElementById('qq-MsgManagerButton').onclick = () => {
        playAudio('sound/system.mp3');
    };

    document.getElementById('qq-im-msg').onclick = () => {
        playAudio('sound/msg.mp3');
    };

    document.getElementById('qq-im-video').onclick = () => {
        playAudio('sound/call.mp3');
    };

    document.getElementById('qq-im-audio').onclick = () => {
        playAudio('sound/call.mp3');
    };

    playAudio('sound/system.mp3');

    /* 拖拽移动窗口 */
    document.querySelectorAll('.drag-parent').forEach(parent => {
        const handle = parent.querySelector('.drag-handle');
        if (!handle) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const getPosition = (el) => {
            const style = window.getComputedStyle(el);
            return {
                left: parseInt(style.left, 10) || 0,
                top: parseInt(style.top, 10) || 0
            };
        };

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            const pos = getPosition(parent);
            startLeft = pos.left;
            startTop = pos.top;
            startX = e.clientX;
            startY = e.clientY;
        });

        handle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            const pos = getPosition(parent);
            startLeft = pos.left;
            startTop = pos.top;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: false });

        const moveHandler = (e) => {
            if (!isDragging) return;
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY;

            parent.style.left = `${startLeft + (clientX - startX)}px`;
            parent.style.top = `${startTop + (clientY - startY)}px`;
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('touchmove', moveHandler, { passive: false });

        const endHandler = () => isDragging = false;
        document.addEventListener('mouseup', endHandler);
        document.addEventListener('touchend', endHandler);
    });
});