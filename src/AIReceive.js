const AIReceive = (function() {

const isFunction = e => typeof e === 'function' 

function generateBody(message, {thinking} = {}) {
    return {
        model: API_MODEL,
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
        thinking: {
            type: thinking? "enabled": "disabled"
        },
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
 * @param {boolean}                options.thinking 是否思考
 */
function aiReceive(message, {
    onStart,
    onChunk,
    onComplete,
    onError,
    thinking = true,
} = {}) {
    try {
        if (!message) throw new Error('message is empty')
        fetch(API_ENTRYPOINT, {
            method: 'POST',
            body: JSON.stringify(generateBody(message, {thinking})),
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

/**
 * 
 * @param {string} line
 */
function formatSSE(line) {
    try {
        line = line.slice(5).trim()
        if (line === '[DONE]') return null
        let data = JSON.parse(line)
        return data.choices[0].delta
    } catch (e) {
        console.error(e)
        return null
    }
    
}

return {
    receive: aiReceive,
    format: formatSSE
}
})()
