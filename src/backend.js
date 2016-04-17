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
	bridge.send('info', {switchable: $('*').length});
});