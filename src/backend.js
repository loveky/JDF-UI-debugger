function sendToDevtools (data) {
	window.postMessage({
		source: 'backend',
		payload: data
	}, '*')
}

window.addEventListener('message', (event) => {
	if (event.data.source === 'proxy' && event.data.payload) {
		console.log('backend received message: ' + event.data.payload);
		handleDevtoolsRequest(event.data.payload);
	}
})

function handleDevtoolsRequest (request) {
	if (request.type == 'init') {
		sendToDevtools({
			type:'info',
			data: {
				switchable: $('*').length
			}
		})
	}
}