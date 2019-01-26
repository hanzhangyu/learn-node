const tempsMap = new Map

const html = (strings, ...values) => {
    // 注：同一个模版字符串 strings 相同
    let result = tempsMap.get(strings)
    if (!result) {
        const temp = document.createElement('template')
        temp.innerHTML = strings.reduce((p, c, i) => {
            return p + '<!---->' + `{{placeholder-${i}}}` + '<!---->' + c
        })
        tempsMap.set(strings, {strings, values, temp})
    }
    return {...tempsMap.get(strings), values}
}

const instances = new Map

const render = (result, container) => {
    console.log(result);
    let instance = instances.get(container)
    if (instance) {
        // 更新
        instance.setValue(result)
    } else {
        // 首次渲染
        const instance = result.temp.content.cloneNode(true)
        container.append(instance)

        const nodes = result.values.map((v, i) => {
            const xpr = `//node()[contains(text(),'{{placeholder-${i + 1}}}')]/text()`
            return document.evaluate(xpr, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)
        })
        instance.setValue = (result) => {
            result.values.forEach((value, i) => {
                console.log(nodes[i]);
                nodes[i].data = value
            })
        }
        instance.setValue(result)
        instances.set(container, instance)
    }
}

render(html`<span>${Date.now()}</span><span>${Date.now()}</span>`, document.body)
// // 重复调用就可以更新组件
// setInterval(() => {
//     render(html`<span>${Date.now()}</span><span>${Date.now()}</span>`, document.body)
// }, 1000)
