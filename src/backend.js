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
	var ele = getElement(data.type, data.expando);
	$('html, body').animate({
	    scrollTop: ele.offset().top -20
	});
})

// Helper
const expando = jQuery.expando;
function gatherComponments () {
	var tabs = [];

	for (let tab of $.ui.all().tab) {
		tabs.push({
			expando: tab.el[0][expando],
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

function getElement (type, expandoValue) {
	for (let instance of $.ui.all()[type]) {
		if (instance.el[0][expando] == expandoValue) {
			return instance.el;
		}
	}
}

window.getElement = getElement;