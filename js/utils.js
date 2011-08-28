function setIconText(num) {
    chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]}); 
    chrome.browserAction.setBadgeText({ 
        "text": '' + num
    }); 
}
