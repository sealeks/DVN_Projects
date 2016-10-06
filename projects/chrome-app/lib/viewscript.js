$(function () {
    var webview = $("#webview");
    if (webview.length) {
        webview = webview.get(0);
        webview.addEventListener("contentload", function () {
            try {
                webview.contentWindow.postMessage('init', "*");
            }
            catch (error) {
                console.log("error postMessage to ", error, webview.getAttribute('src'));
            }
        });
    }

    checkApplicationOrigin = function (event) {
        var origin = event.origin.toString();
        return origin && (origin.search('chrome-extension://') >= 0);
    }

    window.addEventListener('message', function () {
        if (event) {
            //console.log("return event = ", event);           
            if (checkApplicationOrigin(event)) {
                if (webview) {
                    webview.contentWindow.postMessage(event.data, "*");
                    console.log('post to webview', event);
                }
                else
                    console.log('not find webviw');
            }
            else
                chrome.runtime.sendMessage(event.data);
        }
    });
})

