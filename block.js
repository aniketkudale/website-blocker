function blockRequest() {
    return {
        cancel: true
    };
}
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.urls == 'save') {
            let getStoredURLs = [];
            chrome.storage.local.getBytesInUse('websites', function (bytes) {
                if (bytes) {
                    chrome.storage.local.get("websites", function (res) {
                        if (res != {}) {
                            getStoredURLs = JSON.parse(res.websites);
                            if (getStoredURLs.length > 0) {                                
                                const filter = {
                                    urls: getStoredURLs,
                                };
                                chrome.webRequest.onBeforeRequest.addListener(
                                    blockRequest,
                                    filter, ["blocking"]
                                );
                            } else if (getStoredURLs.length == 0) {

                                if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
                                    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
                                }
                            }
                        }
                    });
                } else {
                    getStoredURLs = false;
                }
            });
        }
    }
);