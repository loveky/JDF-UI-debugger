// Check if page has JDF UI
var hasJDFUI = 'window.$ && window.$.ui && (typeof window.$.ui.all == "function")';
chrome.devtools.inspectedWindow.eval(hasJDFUI, (result, isException) => {
	if (result) {
		chrome.devtools.panels.create("JDF UI", "", "devtools.html", (panel) => {});	
 	}
});