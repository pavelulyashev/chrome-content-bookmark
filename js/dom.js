(function() {
var actions = {
	getSelectionInfo: function() {
        var selection = window.getSelection();
        // returns JSON string with info about selection
    }
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var handler = actions[request.action];
	sendResponse(handler ? handler() : undefined);
});
})();
