// ��ҳ�����JDF UI���ʱ�������Խ���
chrome.devtools.inspectedWindow.eval("window.$ && window.$.ui && (typeof window.$.ui.all == 'function')", function(result, isException) {
	if (result) {
		chrome.devtools.panels.create("JDF UI", "", "devtools.html", function(panel) {});	
 	}
});