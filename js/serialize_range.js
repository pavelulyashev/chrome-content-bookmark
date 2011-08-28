/*
 * Serialize path to element
 */
var path = {
    build: function(element) {
        if (element.id)
            return '#' + element.id;
        if (element === document.body)
            return 'body';

        var siblings = element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (element === sibling)
                return [path.build(element.parentNode), i].join(' ')
        }    
    },
    parse: function(source) {
        var pathArray = source.split(' ');
        var destElement = document.querySelector(pathArray[0]);

        for (var i = 1; i < pathArray.length; i++) {
            var index = parseInt(i);
            destElement = destElement.childNodes[index];
        }
        return destElement;
    }
};

/*
 * Serialize info about range object
 */
var range = {
    stringify: function(rng) {
        var rangeInfo = {
            startContainer: path.build(rng.startContainer),
            startOffset: rng.startOffset,
            endContainer: path.build(rng.endContainer),
            endOffset: rng.endOffset
        };
        return JSON.stringify(rangeInfo);
    },
    parse: function(source) {
        var rangeInfo = JSON.parse(source);
        var rng = document.createRange();
        rng.setStart(path.parse(rngInfo.startContainer),
                     rngInfo.startOffset);
        rng.setEnd(path.parse(rngInfo.endContainer),
                   rngInfo.endOffset);
        return rng;
    }
};
