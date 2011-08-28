(function() {
var surround = function(color, node, startOffset, endOffset) {
	console.log(node);
    var span = document.createElement('span');
    var r = document.createRange();

    if (startOffset === undefined)
    	r.setStartBefore(node);
    else
        r.setStart(node, startOffset);

    if (endOffset === undefined)
    	r.setEndAfter(node);
    else 
        r.setEnd(node, endOffset);
    span.style.backgroundColor = color;
    r.surroundContents(span);
};

var highlight = function(rng, color) {
    surround(color, rng.startContainer, rng.startOffset);
    surround(color, rng.endContainer, undefined, rng.endOffset);
};

var actions = {
	getSelectionInfo: function() {
        var rng = window.getSelection().getRangeAt(0);
        highlight(rng, 'yellow');
        return {rangeInfo: range.stringify(rng)};
    },
    highlightSelection: function(request) {
        var rng = range.parse(request.rangeInfo);
        console.log(rng);

        highlight(rng, 'yellow');    
    }
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var handler = actions[request.action];
	sendResponse(handler ? handler(request) : undefined);
});
})();
