if (!localStorage.getItem('AI-NAME')) {
    let buffer = ''
    AIReceive.receive('您 QQ 昵称叫什么,请给出一个最贴切设定的昵称,只输出昵称,无需多余内容.', {
        onChunk(line) {
            let message = AIReceive.format(line)
            if (message && message.content) {
                buffer += message.content
            }
        },
        onComplete() {
            localStorage.setItem('AI-NAME', buffer)
            console.info(buffer)
            buffer = null
        },
        thinking: false,
    })
}
localStorage.getItem('AI-AVATAR') || localStorage.setItem('AI-AVATAR', `/img/avatar/${Math.floor(1 + Math.random() * 116)}.png`)
