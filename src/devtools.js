// 向页面插入backend.js用来操作页面JDF UI组件
injectScript(chrome.runtime.getURL('build/backend.js'), () => {
    // 向background.js建立请求
    const port = chrome.runtime.connect({
        name: '' + chrome.devtools.inspectedWindow.tabId
    });

    let disconnected = false
    port.onDisconnect.addListener(() => {
        disconnected = true
    })


    port.onMessage.addListener((data) => {
        if (data.type == 'info') {
            $('#switchable').html(data.data.switchable);
        }
    });
})


function injectScript (scriptName, cb) {
    const src = `
        var script = document.constructor.prototype.createElement.call(document, 'script');
        script.src = "${scriptName}";
        document.documentElement.appendChild(script);
        script.parentNode.removeChild(script);
    `
    chrome.devtools.inspectedWindow.eval(src, function (res, err) {
        if (err) {
          console.log(err)
        }
        cb()
    })
}