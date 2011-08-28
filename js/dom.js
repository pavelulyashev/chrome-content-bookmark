(function() {
var actions = {
	getSelectionInfo: function() {
        var selection = window.getSelection();
        var rng = selection.getRangeAt(0);
        console.log(path.build(rng.startContainer));
        // returns JSON string with info about selection
		var rangeStr = range.stringify(rng);
		console.log(rangeStr);
		return rangeStr;
    }
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var handler = actions[request.action];
	sendResponse(handler ? handler() : undefined);
});
})();
