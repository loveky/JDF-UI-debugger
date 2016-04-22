import Bridge from './bridge.js';

const bridge = new Bridge({
	send: (data) => {
		window.postMessage({
			source: 'backend',
			payload: data
		}, '*');
	},

	listen: (fn) => {
		window.addEventListener('message', (event) => {
			if (event.data.source === 'proxy' && event.data.payload) {
				fn(event.data.payload);
			}
		})		
	}
});

bridge.on('init', () => {
	bridge.send('info', gatherComponments());
});

bridge.on('focus', (data) => {
	var ele = getElement(data.type, data.guid);
	if (ele.is(":visible")) {
		$('.JDFUIDEBUGGERblinker').removeClass('JDFUIDEBUGGERblinker');
		ele.addClass('JDFUIDEBUGGERblinker');	
		$('html, body').stop().animate({
		    scrollTop: ele.offset().top -100
		},200);
	}
});

bridge.on('updateOptions', (data) => {
	var instance = getInstance(data.type, data.guid);
	var options = $.extend({}, instance.cache('options'), data.newOptions);
	instance.init(options);
});

// Helper
function gatherComponments () {
	var tabs = [];

	for (let tab of $.ui.all().tab) {
		tabs.push({
			guid: tab.guid,
			options: cloneOptions(tab.cache('options')),
			selector: tab.el.selector
		})
	}

	return tabs;
}

function cloneOptions (options) {
	var result = {};
	for (let key of Object.keys(options)) {
		if ((typeof options[key]).match(/boolean|number|string/)) {
			result[key] = options[key];
		}
	}

	return result;
}

function getInstance (type, guid) {
	for (let instance of $.ui.all()[type]) {
		if (instance.guid == guid) {
			return instance;
		}
	}
}

function getElement (type, guid) {
	var instance = getInstance (type, guid);
	if (instance) {
		return instance.el;
	}
}

window.JDFUIDEBUGGERgetElement = getElement;

// 添加专用样式到页面
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.JDFUIDEBUGGERblinker {animation: JDFUIDEBUGGERblinker 1s linear 2; } @keyframes JDFUIDEBUGGERblinker {50% { opacity: 0.0; } }';
document.getElementsByTagName('head')[0].appendChild(style);

