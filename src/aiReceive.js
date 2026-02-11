const aiReceive = (function() {

const isFunction = e => typeof e === 'function' 

function generateBody(message) {
    return {
        model: API_ENTRYPOINT,
        messages: [
            {
                role:    'system',
                content: USER_SET || ''
            },
            {
                role:    'user',
                content: message
            },
        ],
        stream: true,
    }
}

/**
 * 
 * @param {string}                 message 用户输入
 * @param {object}                 options 选项
 * @param {() => void?}            options.onStart 生命周期函数,在开始读取时
 * @param {(line: string) => void} options.onChunk 生命周期函数,读取一行时
 * @param {() => void?}            options.onComplete 生命周期函数,完成时
 * @param {() => void?}            options.onError 生命周期函数,出错时
 */
function aiReceive(message, {
    onStart,
    onChunk,
    onComplete,
    onError,
} = {}) {
    try {
        if (!message) throw new Error('message is empty')
        fetch(API_ENTRYPOINT, {
            body: JSON.stringify(generateBody(message)),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer ' + API_KEY
            }
        }).then(e => {
            if (!e.ok)   throw new Error('HTTP error.')
            if (!e.body) throw new Error('ReadableStream not supported')
            if (isFunction(onStart)) onStart()
            return e.body.getReader()
        }).then(reader => {
            const decoder = new TextDecoder()
            let buffer = ''
            const pump = () => reader.read().then(e => {
                if (e.done) {
                    if (buffer) onChunk(buffer)
                    if (isFunction(onComplete)) onComplete()
                    return
                }
                buffer += decoder.decode(e.value, {stream: true})
                let lines = buffer.split('\n')
                buffer = lines.pop()

                lines.forEach(line => {
                    (line && line.trim())?
                        onChunk(line): null
                })
                return pump()
            })
            return pump()
        })
    } catch (e) {
        if (isFunction(onError)) {
            onError(e)
        } else {
            console.error(e)
        }
    }
}

return aiReceive
})()
