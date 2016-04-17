// 检查页面是否有引入JDF UI组件
// var hasJDFUI = 'window.$ && window.$.ui && (typeof window.$.ui.all == "function")';
var hasJDFUI = 'window.$ && window.$.ui && true';
chrome.devtools.inspectedWindow.eval(hasJDFUI, (result, isException) => {
	if (result) {
		chrome.devtools.panels.create("JDF UI", "", "devtools.html", (panel) => {});	
 	}
});