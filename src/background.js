// background.js作为消息转发中心，建立devtool到backend的一一对应

const ports = {}

chrome.runtime.onConnect.addListener(port => {
	let tab
	let name
	if (isNumeric(port.name)) {
		tab = port.name
		name = 'devtools'
		installProxy(+port.name)
	} else {
		tab = port.sender.tab.id
		name = 'backend'
	}

	if (!ports[tab]) {
		ports[tab] = {
			devtools: null,
			backend: null
		}
	}
	ports[tab][name] = port

	if (ports[tab].devtools && ports[tab].backend) {
		doublePipe(tab, ports[tab].devtools, ports[tab].backend)
	}
})

function isNumeric (str) {
	return +str + '' === str
}

function installProxy (tabId) {
	chrome.tabs.executeScript(tabId, {file: '/build/proxy.js'}, (res) => {
		if (!res) {
			ports[tabId].devtools.postMessage('proxy-fail');
			console.log('Proxy install fall for tabId:' + tabId);
		}
	})
}

function doublePipe (id, devtools, backend) {
	devtools.onMessage.addListener(forwardToBackend)
	function forwardToBackend (message) {
		if (message.event === 'log') {
			return;
		}
		backend.postMessage(message);

		console.log('devtools --> backend : ' + message);
	}

	backend.onMessage.addListener(forwardToDevtools)
	function forwardToDevtools (message) {
		if (message.event === 'log') {
			return;
		}
		devtools.postMessage(message)

		console.log('backend --> devtools : ' + message);
	}

	function shutdown () {
		devtools.onMessage.removeListener(forwardToBackend)
		backend.onMessage.removeListener(forwardToDevtools)
		devtools.disconnect()
		backend.disconnect()
		ports[id] = null
	}
	devtools.onDisconnect.addListener(shutdown)
	backend.onDisconnect.addListener(shutdown)
}