(function() {
/*
 * Serialize path to element
 */
var indexOf = Array.prototype.indexOf;

window.DomPath = {
    build: function(element, ancestor) {
    	if (element === ancestor)
    		return ['ancestor'];
    	if (!ancestor && element.id)
    		return ['#' + element.id];
        if (element === document.body)
            return ['body'];

        var result = DomPath.build(element.parentNode, ancestor); 
        var siblings = element.parentNode.childNodes;
        result.push(indexOf.call(siblings, element));
        return result;
    },
    parse: function(pathArray, ancestor) {
        var destElement = pathArray[0] !== 'ancestor' ?
                          document.querySelector(pathArray[0]) :
                          ancestor;

        for (var i = 1; i < pathArray.length; i++) {
            var index = parseInt(pathArray[i]);
            destElement = destElement.childNodes[index];
        }
        return destElement;
    }
};


/*
 * Serialize info about range object
 */
window.DomRange = {
	serialize: function(range) {
        var rangeInfo = {
            startContainer: DomPath.build(range.startContainer),
            startOffset: range.startOffset,
            endContainer: DomPath.build(range.endContainer),
            endOffset: range.endOffset
        };
        return JSON.stringify(rangeInfo);
    },
    parse: function(source) {
        var rangeInfo = JSON.parse(source);
        var range = document.createRange();
        var startContainer = DomPath.parse(rangeInfo.startContainer);
        var endContainer = DomPath.parse(rangeInfo.endContainer);

        range.setStart(startContainer, rangeInfo.startOffset);
        range.setEnd(endContainer, rangeInfo.endOffset);
        return range;
    }
};

})();
