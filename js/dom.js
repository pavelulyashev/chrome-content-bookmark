(function() {
var highlight = function(rng, color) {
    var siblings = rng.commonAncestorContainer.childNodes;
    $(siblings).css('background-color', 'yellow');
/*
    var inside = false;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === rng.startContainer) {
            var sibling = rng.startContainer;
            var span = document.createElement('span');
            var rStart = document.createRange();
            rStart.setStart(sibling, rng.startOffset);
            rStart.setEnd(sibling, sibling.nodeValue.length);
            span.style.backgroundColor = color;
            rStart.surroundContents(span);
            inside = true;
        } else if (sibling === rng.endContainer) {
            sibling = rng.endContainer;
            var span = document.createElement('span');
            var rEnd = document.createRange();
            rEnd.setStart(sibling, 0);
            rEnd.setEnd(sibling, rng.endOffset);
            span.style.backgroundColor = color;
            rEnd.surroundContents(span);
            inside = false;
        } else if (inside) {
            sibling.style.backgroundColor = color;
        }    
    }
*/
};
var actions = {
	getSelectionInfo: function() {
        var rng = window.getSelection().getRangeAt(0);
        console.log(range.stringify(rng));
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
