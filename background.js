// chrome.runtime.onConnect.addListener(function(port) {
//     if (port.name !== 'devtools-JDFUIDebugger') {
//         return;
//     }

//     var tabId;

//     var tabIdListener = function(message) {
//         if (!message.tabId) {
//             return;
//         }

//         tabId = message.tabId;
//         port.onMessage.removeListener(tabIdListener);
//     };
    
//     port.onMessage.addListener(tabIdListener);

//     port.onDisconnect.addListener(function() {
//         if (tabId == null || !chrome.tabs) {
//             return;
//         }

//         port.onMessage.removeListener(tabIdListener);
//     });
// });