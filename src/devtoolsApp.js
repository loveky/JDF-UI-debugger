export function initDevtoolsApp (bridge) {
	bridge.on('info', function (payload) {
       $('#switchable').html(payload.switchable);
	})
}