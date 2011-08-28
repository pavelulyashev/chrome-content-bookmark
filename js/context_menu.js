(function() {

function setIconText(num) {
    chrome.browserAction.setBadgeText({'text': '' + num}); 
};


function clickHandler(info, tab) {
    var storeBookmark = function(response) {
        localStorage[localStorage.length] = JSON.stringify({
            url: info.pageUrl,
            rangeInfo: response.rangeInfo,
            selectionText: info.selectionText,
            title: tab.title,
            color: 'yellow'
        });
        setIconText(localStorage.length);
    };
    chrome.tabs.sendRequest(tab.id, 
                            {action: 'getSelectionInfo'}, 
                            storeBookmark);
};

/**
 * Create a context menu which will only show up for selections.
 */
chrome.contextMenus.create({
    title: 'Create content bookmark',
    type: 'normal',
    contexts: ['selection'],
    onclick: clickHandler
});

chrome.browserAction.setBadgeBackgroundColor({'color': [0, 255, 0, 255]}); 
setIconText(localStorage.length);

})();
