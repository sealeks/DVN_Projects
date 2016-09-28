$(function () {
    var webview = $("#webview");
    if (webview.length) {
        webview.on("contentload", function () {
            try {
                webview = webview.get(0);
                webview.contentWindow.postMessage("init", "*");
            }
            catch (error) {
            }
        });
    }
    window.addEventListener('message', function () {
        //console.log("return event = ", event);
        chrome.runtime.sendMessage(event.data);
    });
})

