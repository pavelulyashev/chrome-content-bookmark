(function() {
var each = Array.prototype.forEach;
var slice = Array.prototype.slice;
var indexOf = Array.prototype.indexOf;

var sliceFragment = function(ancestor, startPath, endPath) {
    var childNodes = ancestor.childNodes;
    var startIndex = startPath[0];
    var endIndex = endPath[0];

	if (!(childNodes.length && startPath.length + endPath.length))
        return [];

    if (startPath.length && !endPath.length) {
    	var result = sliceFragment(childNodes[startIndex], 
    	                           startPath.slice(1), 
    	                           endPath);
    	return result.concat(slice.call(childNodes, startIndex + 1));
    }

    if (!startPath.length && endPath.length) {
    	var result = slice.call(childNodes, 0, endIndex);
    	return result.concat(sliceFragment(childNodes[endIndex], 
    	                                   startPath, 
    	                                   endPath.slice(1)));
    }

    var result = sliceFragment(childNodes[startIndex], startPath.slice(1), []);
    result = result.concat(slice.call(childNodes, startIndex + 1, endIndex));
    return result.concat(sliceFragment(childNodes[endIndex], [],
                                       endPath.slice(1)));
};

var getStartFragment = function(range) {
	var start = range.startContainer;
    if (start.nodeType === 1) {
    	if (start !== range.commonAncestorContainer)
            return slice.call(start.childNodes, range.startOffset);
        else {
        	var index = indexOf.call(start.childNodes, range.endContainer);
        	if (index === -1)
        		index = undefined;
        	return slice.call(start.childNodes, range.startOffset, index);
        }
    }

    start.startOffset = range.startOffset;
    return [start];
};

var getEndFragment = function(range) {
	var end = range.endContainer;
    if (end.nodeType === 1) {
    	if (end !== range.commonAncestorContainer)
            return slice.call(end.childNodes, 0, range.endOffset);
        else {
            var index = indexOf.call(end.childNodes, range.startContainer) + 1;
            return slice.call(end.childNodes, index, range.endOffset);
        }
    }
    end.endOffset = range.endOffset;
    return [end];
};

var getCommonFragment = function(range) {
    var ancestor = range.commonAncestorContainer;
    if (ancestor.nodeType === 1) {
    	return slice.call(ancestor.childNodes,
    	                  range.startOffset,
    	                  range.endOffset);
    }

    ancestor.startOffset = range.startOffset;
    ancestor.endOffset = range.endOffset;
    return [ancestor];
};

var getDomFragment = function(range) {
    if (range.startContainer === range.endContainer)
    	return getCommonFragment(range);

	var ancestor = range.commonAncestorContainer;
	var startPath = DomPath.build(range.startContainer, ancestor).slice(1);
	var endPath = DomPath.build(range.endContainer, ancestor).slice(1);

	var result = getStartFragment(range);
	result = result.concat(sliceFragment(ancestor, startPath, endPath));
	return result.concat(getEndFragment(range));
};

var surroundClass = 'content_highlight';
var spanHtml = '<span class="' + surroundClass + '"></span>';

var surround = function(color, node) {
	if (node.nodeType === 3) {
        var span = $(spanHtml).css('background-color', color)[0];
        var range = document.createRange();

        node.startOffset === undefined ? range.setStartBefore(node)
                                       : range.setStart(node, node.startOffset);
        node.endOffset === undefined ? range.setEndAfter(node)
                                     : range.setEnd(node, node.endOffset);

        range.surroundContents(span);
    } else {
        $(node).addClass(surroundClass).css('background-color', color);
    }
};


var highlight = function(range, color) {
	var domFragment = getDomFragment(range);
    domFragment.forEach(function(node) {
        surround(color, node);
        node.startOffset = node.endOffset = undefined;
    });
};

var actions = {
	getSelectionInfo: function(request) {
        var range = window.getSelection().getRangeAt(0);
        var response = {rangeInfo: DomRange.serialize(range)};

        var rng = DomRange.parse(DomRange.serialize(range));
        highlight(rng, 'yellow');
        return response;
    },
    highlightSelection: function(request) {
    	$(document).ready(function() {
            var range = DomRange.parse(request.rangeInfo);
            highlight(range, 'yellow');
        });
    },
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var handler = actions[request.action];
	sendResponse(handler ? handler(request) : undefined);
});
})();
