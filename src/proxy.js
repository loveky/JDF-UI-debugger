// 由于backend.js是以script标签形式引入页面，所以无法与backgound.js通信，本脚本作为中间代理
// 与backend.js用window.postMessage通信，与background.js通过chrome.runtime.connect通信

const port = chrome.runtime.connect({
  name: 'proxy'
})

port.onMessage.addListener(sendMessageToBackend)
port.onDisconnect.addListener(handleDisconnect)

window.addEventListener('message', sendMessageToDevtools)

sendMessageToBackend({event: 'init'})

function sendMessageToBackend (payload) {
  window.postMessage({
    source: 'proxy',
    payload: payload
  }, '*')
}

function sendMessageToDevtools (e) {
  if (e.data && e.data.source === 'backend') {
    port.postMessage(e.data.payload)
  }
}

function handleDisconnect () {
  window.removeEventListener('message', sendMessageToDevtools)
  sendMessageToBackend('shutdown')
}