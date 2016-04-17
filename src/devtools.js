import Bridge from './bridge.js';
import { initDevtoolsApp } from './devtoolsApp.js';

// 向页面插入backend.js用来操作页面JDF UI组件
injectScript(chrome.runtime.getURL('build/backend.js'), () => {
    // 向background.js建立请求
    const port = chrome.runtime.connect({
        name: '' + chrome.devtools.inspectedWindow.tabId
    });

    const bridge = new Bridge({
        listen: (fn) => {
            port.onMessage.addListener(fn);
        },
        send: (data) => {
            port.postMessage(data);
        }
    });
    initDevtoolsApp(bridge);
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