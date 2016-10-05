$(function () {
    var webview = $("#webview");
    if (webview.length) {
        webview = webview.get(0);
        webview.addEventListener("contentload", function () {
            try {
                webview.contentWindow.postMessage('init', "*");
            }
            catch (error) {
                console.log("erro postMessage to ", error, webview.getAttribute('src'));
            }
        });
    }

    window.addEventListener('message', function () {
        //console.log("return event = ", event);
        chrome.runtime.sendMessage(event.data);
    });
})

